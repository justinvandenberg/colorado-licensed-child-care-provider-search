import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  TextInputProps as RnTextInputProps,
  StyleProp,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

import Button from "./Button";
import Text, { getFontProps, TextProps } from "./Text";

type EditableTextProps = Omit<RnTextInputProps, "onBlur"> & {
  fontSize?: TextProps["fontSize"];
  fontWeight?: TextProps["fontWeight"];
  initialValue?: string;
  label: string;
  onSubmit?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

const EditableText: FC<EditableTextProps> = ({
  fontSize = 16,
  fontWeight = 400,
  initialValue = "",
  label,
  onSubmit,
  style,
  ...props
}) => {
  const textInputRef = useRef<TextInput>(null);

  const [value, setValue] = useState<string>(initialValue);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const { fontFamily, letterSpacing, lineHeight } = getFontProps(
    fontSize,
    fontWeight
  );

  // Toggle text input edibility
  const handleEdit = useCallback(() => {
    setIsEditable((isEditable) => !isEditable);
  }, []);

  useEffect(() => {
    if (!isEditable) {
      return;
    }

    // This must be in a use effect to ensure that the input is focusable
    textInputRef.current?.focus();
  }, [isEditable]);

  return (
    <View style={[styles.root, style]}>
      <View style={styles.textWrapper}>
        <Text
          style={{ fontFamily, letterSpacing, lineHeight }}
          fontSize={fontSize}
          fontWeight={fontWeight}
        >
          {value}
        </Text>
      </View>
      <TextInput
        {...props}
        aria-label={label}
        editable={isEditable}
        multiline={true}
        onChangeText={setValue}
        onBlur={() => {
          setIsEditable(false);
          onSubmit?.(value);
        }}
        ref={textInputRef}
        style={[
          styles.textInput,
          { fontFamily, fontSize, letterSpacing, lineHeight },
        ]}
        value={value}
      />
      <View>
        <Button
          iconName={isEditable ? "minimize" : "edit"}
          iconOnly={true}
          onPress={handleEdit}
          size="compact"
          style={styles.button}
          title="Edit"
          variant="inverted"
        />
      </View>
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    flexDirection: "row",
    paddingRight: theme.spacing[11],
    position: "relative",
  },
  textInput: {
    backgroundColor: "transparent",
    bottom: 0,
    color: "transparent",
    flexGrow: 1,
    left: 0,
    opacity: 1,
    padding: 0,
    paddingRight: theme.spacing[11],
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
  },
  textWrapper: {
    justifyContent: "center",
    pointerEvents: "none",
  },
  button: {
    zIndex: 20,
  },
}));

export default EditableText;
