import Octicons from "@expo/vector-icons/Octicons";
import { Tabs } from "expo-router";
import React from "react";

import { useTheme } from "@/providers/ThemeProvider";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export default function TabLayout() {
  const theme = useTheme();
  const tabBarItemStyle: StyleProp<ViewStyle> = {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 2,
    maxWidth: theme.spacing[18],
    minHeight: theme.spacing[18],
    paddingTop: 6,
  };
  const tabBarLabelStyle: StyleProp<TextStyle> = {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    marginTop: theme.spacing[1],
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          alignItems: "center",
          backgroundColor: theme.color.white,
          borderWidth: 0,
          borderRadius: 32,
          bottom: theme.spacing[3],
          left: 0,
          minHeight: theme.spacing[20],
          maxHeight: theme.spacing[20],
          padding: 0,
          paddingTop: 6,
          position: "absolute",
          marginHorizontal: "15%",
          right: 0,
          // Shadow
          shadowColor: theme.color.violet[700],
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.2,
          shadowRadius: 5.62,
          elevation: 8,
        },
        tabBarItemStyle,
        tabBarLabelStyle: {
          ...tabBarLabelStyle,
          color: theme.color.violet[700],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Octicons color={theme.color.violet[400]} name="search" size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: "Visits",
          tabBarIcon: ({ color }) => (
            <Octicons
              color={theme.color.violet[700]}
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
              color={theme.color.green[400]}
              name="command-palette"
              size={24}
            />
          ),
          tabBarItemStyle,
          tabBarLabelStyle: {
            ...tabBarLabelStyle,
            color: theme.color.green[700],
          },
        }}
      />
    </Tabs>
  );
}
