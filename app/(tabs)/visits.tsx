import { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import Button from "@/components/ui/Button";
import VisitCard from "@/components/VisitCard";
import VisitModal from "@/components/VisitModal";
import { useUser } from "@/providers/UserProvider";

export default function VisitsScreen() {
  const { currentUser, setCurrentVisit, currentVisit } = useUser();

  useEffect(() => {
    // console.log(user);
  }, [currentUser]);

  return (
    <View style={styles.root}>
      <FlatList
        data={currentUser?.visits}
        // ListHeaderComponent={ProviderListHeader}
        // ListEmptyComponent={() => {
        //   return isFetching ?? <ActivityIndicator />;
        // }}
        renderItem={({ item }) => (
          <VisitCard {...item} onClick={() => setCurrentVisit(item)} />
        )}
        keyExtractor={(item) => item.id}
        // contentContainerStyle={{
        //   gap: theme.spacing[2],
        //   paddingBottom: 104,
        // }}
      />
      <Button
        onPress={() => {
          const id = generateId();
          setCurrentVisit({ id, title: "" });
        }}
        iconName="plus"
        title="Add a visit"
      />
      {currentVisit && currentUser && (
        <VisitModal
          onClose={() => setCurrentVisit(null)}
          user={currentUser}
          visit={currentVisit}
          visible={!!currentVisit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
});

const generateId = (length: number = 14) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};
