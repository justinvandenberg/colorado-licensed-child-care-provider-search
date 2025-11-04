import { Directory, Paths } from "expo-file-system";
import React, { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import { DIR_NAME, refetchFirestoreDbProviders } from "@/utilities/firestoreDb";
import { dropLocalDbUserTable } from "@/utilities/localDb";

import { useTheme } from "@/providers/ThemeProvider";

import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

export default function DevScreen() {
  const theme = useTheme();

  // const { refetch: updateProviders } = useQuery({
  //   queryKey: ["updateProviders"],
  //   queryFn: () => refetchFirestoreDbProviders(),
  //   enabled: false,
  // });

  // const { refetch: overwriteProviders } = useQuery({
  //   queryKey: ["overwriteProviders"],
  //   queryFn: () => refetchFirestoreDbProviders(true),
  //   enabled: false,
  // });

  // const { refetch: deleteUserTable } = useQuery({
  //   queryKey: ["deleteUserTable"],
  //   queryFn: dropLocalDbUserTable,
  //   enabled: false,
  // });

  const dir = useMemo(() => new Directory(Paths.document, DIR_NAME), []);

  // Delete image from the local file system
  const deleteLocalImages = useCallback(() => {
    if (dir.exists) {
      dir.delete();
    }
    console.log(`✅ Directory '${dir.name}' deleted`);
  }, [dir]);

  return (
    <ScrollView style={styles.root}>
      <View style={styles.buttonsWrapper}>
        <Text color={theme.color.green[400]} fontSize={36} fontWeight="600">
          Dev
        </Text>
        <Button
          onPress={() => refetchFirestoreDbProviders()}
          title="Fetch providers (CDEC)"
          titleColor={theme.color.green[400]}
          titleWeight="mono"
          style={styles.button}
        />
        <Button
          onPress={() => refetchFirestoreDbProviders(true)}
          title="Fetch providers (CDEC/Google)"
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
        <Button
          onPress={dropLocalDbUserTable}
          title="Drop user DB table"
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
