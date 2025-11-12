import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  TextInputProps as RnTextInputProps,
  StyleProp,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "@/providers/ThemeProvider";
import Button from "./Button";

type EditableTextProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
  textInputStyle?: RnTextInputProps["style"];
} & RnTextInputProps;

const EditableText: FC<EditableTextProps> = ({
  label,
  onChangeText,
  style,
  textInputStyle,
  value = "",
  ...props
}) => {
  const theme = useTheme();

  const textInputRef = useRef<TextInput>(null);

  const [isEditable, setIsEditable] = useState<boolean>(false);

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
    <View style={styles.root}>
      <TextInput
        {...props}
        aria-label={label}
        editable={isEditable}
        onChangeText={onChangeText}
        ref={textInputRef}
        style={[styles.textInput, textInputStyle]}
        value={value}
      />
      <Button
        iconName="pencil"
        iconOnly={true}
        onPress={handleEdit}
        size="compact"
        style={styles.button}
        title="Edit"
        variant="inverted"
      />
    </View>
  );
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    position: "relative",
  },
  textInput: {
    color: theme.color.violet[950],
    flexGrow: 1,
    padding: 0,
    fontSize: 16,
  },
  button: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
}));

export default EditableText;
