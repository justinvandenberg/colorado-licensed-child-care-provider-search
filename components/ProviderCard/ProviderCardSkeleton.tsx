import { FC } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import Skeleton from "../ui/Skeleton";

const ProviderCardSkeleton: FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Skeleton style={styles.staticMap} radii={theme.spacing[8]} />
      <View style={styles.titleWrapper}>
        <Skeleton radii={theme.spacing[2]} height={20} width="30%" />
        <Skeleton radii={theme.spacing[2]} height={20} />
        <Skeleton radii={theme.spacing[2]} height={20} width="50%" />
        <Skeleton variant="buttonCompact" width="45%" />
      </View>
      <Skeleton style={styles.capacities} radii={theme.spacing[8]} />
      <View style={styles.buttonWrapper}>
        <Skeleton variant="buttonCompact" width="40%" />
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.white,
    borderColor: theme.color.violet[200],
    borderWidth: 1,
    borderRadius: theme.spacing[10],
    // flex: 1,
    gap: theme.spacing[2],
    padding: theme.spacing[2],
  },
  staticMap: {
    aspectRatio: "4 / 3",
  },
  titleWrapper: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[1],
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[2],
  },
  title: {
    marginTop: theme.spacing[1],
  },
  capacities: {
    aspectRatio: "181 / 50",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
}));

export default ProviderCardSkeleton;
