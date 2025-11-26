import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { DbVisit, Visit, VisitChecklistValues } from "@/types/Visit";

import { localDb } from "@/localDb";

interface VisitsContextType {
  currentVisit?: Visit;
  deleteVisits: (ids: number[]) => void;
  error: Error | null;
  isFetching: boolean;
  isFetched: boolean;
  isLoading: boolean;
  setCurrentVisit: (visit?: Omit<Visit, "id"> & { id?: number }) => void;
  updateCurrentVisit: (visit: Visit, userId?: number) => void;
  visits?: Visit[];
}

const VisitsContext = createContext<VisitsContextType>({
  currentVisit: undefined,
  deleteVisits: () => {},
  error: null,
  isFetched: false,
  isFetching: false,
  isLoading: false,
  setCurrentVisit: () => {},
  updateCurrentVisit: () => {},
  visits: [],
});

const VisitsProvider = ({ children }: PropsWithChildren) => {
  const [visits, setVisits] = useState<Visit[]>();
  const [currentVisit, setCurrentVisit] = useState<Visit | undefined>();

  const { data, error, isLoading, isFetching, isFetched, refetch } = useQuery({
    queryKey: ["fetchVisits"],
    queryFn: fetchVisits,
    enabled: visits === undefined,
  });

  /**
   *
   */
  const updateCurrentVisit = useCallback(
    async (visit: Visit, userId?: number) => {
      // First try to update the existing visit by ID
      const result = await localDb.runAsync(
        `
          UPDATE visits SET
          title = ?,
          checklist_values = ?,
          user_rating = ?,
          notes = ?
          WHERE id = ?;
        `,
        [
          visit.title || "",
          JSON.stringify(visit.checklist_values || []),
          visit.user_rating !== undefined ? visit.user_rating : 4,
          visit.notes || "",
          visit.id,
        ]
      );

      // If UPDATE changed 0 rows, the visit doesn't exist yet → INSERT
      if (result.changes === 0) {
        if (!userId) {
          return;
        }

        await localDb.runAsync(
          `
            INSERT INTO visits (user_id, title, checklist_values, user_rating, notes, created_at) VALUES (?, ?, ?, ?, ?, ?);
          `,
          [
            userId,
            visit.title || "",
            JSON.stringify(visit.checklist_values || []),
            visit.user_rating !== undefined ? visit.user_rating : 4,
            visit.notes || "",
            new Date().toISOString(),
          ]
        );
      }

      refetch();
    },
    [refetch]
  );

  /**
   *
   */
  const deleteVisits = useCallback(
    async (ids: number[]) => {
      await localDb.runAsync(
        `
          DELETE FROM visits
          WHERE id IN (?);
        `,
        [ids.join(", ")]
      );

      refetch();
    },
    [refetch]
  );

  useEffect(() => {
    setVisits(data);
  }, [data]);

  return (
    <VisitsContext.Provider
      value={{
        currentVisit,
        deleteVisits,
        error,
        isLoading,
        isFetching,
        isFetched,
        updateCurrentVisit,
        setCurrentVisit: (visit) => setCurrentVisit(visit as Visit),
        visits,
      }}
    >
      {children}
    </VisitsContext.Provider>
  );
};

const useVisits = () => {
  const context = useContext(VisitsContext);

  if (!context) {
    throw new Error("useVisits must be used within a VisitsProvider");
  }

  return context;
};

/**
 * Get the first row from the user db table
 * A db will be created if it doesn't exist
 * @returns {Promise<Visit[]>}
 */
const fetchVisits = async (): Promise<Visit[]> => {
  // If a db table for the user data doesn't exist, create it

  await localDb.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      checklist_values TEXT NOT NULL,
      user_rating INTEGER NOT NULL,
      notes TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT
    );
    CREATE TRIGGER IF NOT EXISTS visits_updated_at_timestamp
    AFTER UPDATE ON visits
    FOR EACH ROW
    BEGIN
      UPDATE visits
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = NEW.id;
    END;
  `);

  // Get the first row from the user db table
  const visits: DbVisit[] | null = await localDb.getAllAsync(
    "SELECT * FROM visits"
  );

  if (!visits) {
    return [];
  }

  const parsedVisits = visits.map((visit) => {
    const parsedChecklistValues = JSON.parse(visit.checklist_values);

    return {
      ...visit,
      checklist_values: parsedChecklistValues,
      score: calculateScore(parsedChecklistValues, visit.user_rating),
    };
  });

  return parsedVisits;
};

/**
 *
 * @param checklistValues
 * @param user_rating
 * @returns
 */
const calculateScore = (
  checklistValues: VisitChecklistValues,
  user_rating: number = 5
) => {
  const CHECKLIST_VALUES_WEIGHT = 1;
  const USER_RATING_WEIGHT = 0.7;

  // Normalize weights so they always add up to 1
  const totalWeight = CHECKLIST_VALUES_WEIGHT + USER_RATING_WEIGHT;
  const checklistValuesWeight = CHECKLIST_VALUES_WEIGHT / totalWeight;
  const userRatingWeight = USER_RATING_WEIGHT / totalWeight;

  // Get number of checked checklist values
  const checkedChecklistValues = Object.values(checklistValues).filter(
    (v) => v === true
  ).length;

  // Get the weighted values
  const weightedChecklistValues =
    (checkedChecklistValues / 21) * checklistValuesWeight; // TODO: Make the length (21) dynamic
  const weightedUserRating = (user_rating / 9) * userRatingWeight;

  // Add the weighted values and constrain to 1 decimal
  return Math.trunc((weightedChecklistValues + weightedUserRating) * 100) / 10;
};

export { useVisits, VisitsProvider };
