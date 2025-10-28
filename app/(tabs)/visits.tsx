import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import Text from "@/components/ui/Text";

export default function VisitsScreen() {
  return (
    <ScrollView style={styles.root}>
      <Text>Visits</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
});
