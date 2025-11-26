export type VisitChecklistItems = Record<number, string>;

export type VisitChecklistValues = Record<number, boolean>;

export interface Visit {
  id: number;
  title: string;
  checklist_values?: VisitChecklistValues;
  user_rating?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  provider_id?: number;
  score?: number;
}

export type DbVisit = Omit<Visit, "checklist_values" | "score"> & {
  checklist_values: string;
};
