import { FC, useState } from "react";
import { View } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useProviders } from "@/providers/ProvidersProvider";
import { useTheme } from "@/providers/ThemeProvider";

import LocationButton from "./ui/LocationButton";
import Text from "./ui/Text";
import TextInput from "./ui/TextInput";

interface ProviderSearchProps {
  disabled?: boolean;
}

const ProviderSearch: FC<ProviderSearchProps> = ({ disabled = false }) => {
  const theme = useTheme();
  const { updateZip, resetProviders } = useProviders();
  const [zip, setZip] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View style={styles.root}>
      <Text color={theme.color.white} fontSize={36} fontWeight={600}>
        Lorem ipsum dolor sit amet
      </Text>
      <View style={styles.form}>
        <View style={styles.textInputWrapper}>
          <TextInput
            disabled={disabled}
            style={[
              styles.textInput,
              {
                borderColor:
                  isFocused && zip.length > 0
                    ? zip.length === 5
                      ? theme.color.green[400]
                      : theme.color.red[400]
                    : theme.color.white,
              },
            ]}
            iconName="search"
            label="Zip code"
            onBlur={() => setIsFocused(false)}
            onChangeText={(value) => {
              // Remove non-numeric characters
              const numericValue = value.replace(/[^0-9]/g, "");

              // Limit to 5 characters
              const truncatedValue = numericValue.slice(0, 5);

              /**
               * Reset when value is empty and zip is not
               * Checking against `zip` will ensure we don't continuous check when empty
               * Check against `numericValue` for this one
               */
              if (numericValue.length === 0 && zip.length !== 0) {
                resetProviders();
              }

              /**
               * Fetch new providers ONLY if the value is 5 characters
               * Check against `value` for this one
               */
              if (value.length === 5) {
                updateZip(value.slice(0, 5));
              }

              // Set zip all the time, so the value still updates for the user
              setZip(truncatedValue);
            }}
            onFocus={() => setIsFocused(true)}
            showLabel={false}
            textInputStyle={{
              paddingTop: theme.spacing[5],
              paddingBottom: theme.spacing[5],
            }}
            value={zip}
          />
        </View>
        <LocationButton
          disabled={disabled}
          onLocationPermissionGranted={(zip) => {
            if (!zip) {
              return;
            }
            updateZip(zip);
            setZip(zip);
          }}
        />
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    backgroundColor: theme.color.violet[400],
    borderTopLeftRadius: theme.spacing[12],
    borderTopRightRadius: theme.spacing[12],
    borderBottomLeftRadius: theme.spacing[11],
    borderBottomRightRadius: theme.spacing[11],
    gap: theme.spacing[2],
    marginBottom: theme.spacing[1],
    padding: theme.spacing[4],
    paddingTop: theme.spacing[24],
    // Shadow
    // shadowColor: theme.color.violet[700],
    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 5.62,
    // elevation: 8,
  },
  form: {
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  textInputWrapper: {
    flexGrow: 1,
  },
  textInput: {
    borderWidth: 4,
  },
}));

export default ProviderSearch;
