import Feather from "@expo/vector-icons/Feather";
import { FC, useRef, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";

import { useTheme } from "@/providers/ThemeProvider";

import TextInput, { TextInputProps } from "../ui/TextInput";

type VisitBottomSheetModalTitleProps = Omit<TextInputProps, "onBlur"> & {
  onSubmit?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

const VisitBottomSheetModalTitle: FC<VisitBottomSheetModalTitleProps> = ({
  initialValue = "",
  isDisabled = false,
  label,
  onSubmit,
  style,
  ...props
}) => {
  const theme = useTheme();

  const textInputRef = useRef<any>(null);

  const [value, setValue] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View
      style={[
        styles.root,
        {
          borderColor: isFocused
            ? theme.color.violet[400]
            : theme.color.violet[100],
        },
        style,
      ]}
    >
      <TextInput
        {...props}
        initialValue={value}
        isDisabled={isDisabled}
        isInBottomSheet={true}
        label={label}
        multiline={true}
        onChangeText={setValue}
        onBlur={() => {
          setIsFocused(false);
          onSubmit?.(value);
        }}
        onFocus={() => setIsFocused(true)}
        ref={textInputRef}
        showLabel={false}
        style={styles.textInput}
        textInputStyle={styles.textInputTextInput}
      />
      <View style={styles.iconWrapper}>
        <Feather color={theme.color.violet[400]} name="edit" size={20} />
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    position: "relative",
  },
  textInput: {
    borderColor: theme.color.violet[200],
    borderWidth: 2,
    paddingHorizontal: 0,
  },
  textInputTextInput: {
    fontFamily: theme.fontFamily.sans.semiBold,
    fontSize: 28,
    paddingVertical: 14,
    paddingRight: theme.spacing[13],
  },
  iconWrapper: {
    pointerEvents: "none",
    position: "absolute",
    top: theme.spacing[6],
    right: theme.spacing[4],
  },
}));

export default VisitBottomSheetModalTitle;
