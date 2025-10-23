import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";

import { useTheme } from "@/providers/ThemeProvider";

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Octicons color={theme.color.violet[400]} name="search" size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Visits",
          tabBarIcon: ({ color }) => (
            <Octicons
              color={theme.color.violet[400]}
              name="checklist"
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dev"
        options={{
          title: "Dev",
          tabBarIcon: ({ color }) => (
            <Octicons
              color={theme.color.violet[400]}
              name="command-palette"
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
