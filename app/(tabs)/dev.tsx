import { useQuery } from "@tanstack/react-query";
import { Directory, Paths } from "expo-file-system";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import { DIR_NAME, refetchProviders } from "@/utilities/fetch";

import { useTheme } from "@/providers/ThemeProvider";

import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

export default function DevScreen() {
  const theme = useTheme();

  const {
    isSuccess: refetchAndUpdateProvidersIsSuccess,
    isError: refetchAndUpdateProvidersIsError,
    refetch: refetchAndUpdateProviders,
  } = useQuery({
    queryKey: ["refetchAndUpdateProviders"],
    queryFn: () => refetchProviders(),
    enabled: false,
  });

  const {
    isSuccess: refetchAndOverwriteProvidersIsSuccess,
    isError: refetchAndOverwriteProvidersIsError,
    refetch: refetchAndOverwriteProviders,
  } = useQuery({
    queryKey: ["refetchAndOverwriteProviders"],
    queryFn: () => refetchProviders(true),
    enabled: false,
  });

  const dir = useMemo(() => new Directory(Paths.cache, DIR_NAME), []);

  // Clear the local image cache
  const clearImageCache = useCallback(() => {
    Image.clearDiskCache();
    console.log("✅ Local cache cleared");
  }, []);

  // Delete image from the local file system
  const deleteLocalImages = useCallback(() => {
    if (dir.exists) {
      dir.delete();
    }
    console.log(`✅ ${dir.name} deleted`);
  }, [dir]);

  useEffect(() => {
    if (
      !refetchAndUpdateProvidersIsSuccess &&
      !refetchAndUpdateProvidersIsSuccess
    ) {
      return;
    }
    console.log("✅ Providers updated");
  }, [
    refetchAndUpdateProvidersIsSuccess,
    refetchAndOverwriteProvidersIsSuccess,
  ]);

  useEffect(() => {
    if (
      !refetchAndUpdateProvidersIsError &&
      !refetchAndOverwriteProvidersIsError
    ) {
      return;
    }
    console.log("❌ Providers could not be updated");
  }, [refetchAndUpdateProvidersIsError, refetchAndOverwriteProvidersIsError]);

  return (
    <ScrollView style={styles.root}>
      <View style={styles.buttonsWrapper}>
        <Text color={theme.color.green[400]} fontSize={36} fontWeight="600">
          Dev
        </Text>
        <Button
          onPress={() => refetchAndUpdateProviders()}
          title="Fetch providers (CDEC)"
          titleColor={theme.color.green[400]}
          titleWeight="mono"
          style={styles.button}
        />
        <Button
          onPress={() => refetchAndOverwriteProviders()}
          title="Fetch providers (CDEC/Google)"
          titleColor={theme.color.green[400]}
          titleWeight="mono"
          style={styles.button}
        />
        <Button
          onPress={clearImageCache}
          title="Clear image cache"
          titleColor={theme.color.green[400]}
          titleWeight="mono"
          style={styles.button}
        />
        <Button
          onPress={deleteLocalImages}
          title="Delete local images"
          titleColor={theme.color.green[400]}
          titleWeight="mono"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[950],
    flex: 1,
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[4],
  },
  buttonsWrapper: {
    gap: theme.spacing[2],
    paddingTop: theme.spacing[20],
  },
  button: {
    backgroundColor: "transparent",
    borderColor: theme.color.green[400],
    borderWidth: 2,
  },
}));
