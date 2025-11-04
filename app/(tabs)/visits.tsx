import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";

import Text from "@/components/ui/Text";
import { useUser } from "@/providers/UserProvider";

export default function VisitsScreen() {
  const { user } = useUser();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <ScrollView style={styles.root}>
      <Text>Visit2rs</Text>
      {/* <Button onPress={() => toggleFavorite(1676722, true)} title="1676722" />
      <Button onPress={() => toggleFavorite(1724032, true)} title="1724032" /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
});
