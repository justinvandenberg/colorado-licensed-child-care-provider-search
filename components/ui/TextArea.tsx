import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { forwardRef, useEffect, useMemo, useState } from "react";
import {
  ColorValue,
  TextInput as RnTextInput,
  TextInputProps as RnTextInputProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import Text from "./Text";
import { IconName } from "./TextIcon";

type TextAreaBaseProps = RnTextInputProps & {
  iconColor?: ColorValue;
  iconName?: IconName;
  initialValue?: string;
  isDisabled?: boolean;
  isInBottomSheet?: boolean;
  label: string;
  labelColor?: ColorValue;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  textInputStyle?: RnTextInputProps["style"];
  transformValue?: (value: string) => string;
};

// When in a BottomSheet
type BottomSheetTextAreaProps = TextAreaBaseProps & {
  isInBottomSheet: true;
  ref?: React.Ref<typeof BottomSheetTextInput>;
};

// When NOT in a BottomSheet
type RnTextAreaPropsType = TextAreaBaseProps & {
  isInBottomSheet?: false;
  ref?: React.Ref<RnTextInput>;
};

export type TextAreaProps = BottomSheetTextAreaProps | RnTextAreaPropsType;

const TextArea = forwardRef<
  RnTextInput | typeof BottomSheetTextInput,
  TextAreaProps
>(
  (
    {
      iconColor,
      iconName,
      initialValue = "",
      isDisabled = false,
      isInBottomSheet = false,
      label,
      labelColor,
      onChangeText,
      showLabel = true,
      style,
      textInputStyle,
      transformValue = (value) => value,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState<string>(initialValue);

    const TextInputComponent = useMemo(
      () => (isInBottomSheet ? BottomSheetTextInput : RnTextInput),
      [isInBottomSheet]
    );

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <View style={styles.root}>
        {showLabel && (
          <Text color={labelColor} fontWeight={500}>
            {label}
          </Text>
        )}
        <TextInputComponent
          {...props}
          aria-label={!showLabel ? label : undefined}
          editable={!isDisabled}
          multiline={true}
          onChangeText={(value) => {
            const transformedValue = transformValue(value);
            setValue(transformedValue);
            onChangeText?.(transformedValue);
          }}
          ref={ref as any}
          style={[styles.textInput, textInputStyle]}
          value={value}
        />
      </View>
    );
  }
);

// This is important for devtools
TextArea.displayName = "TextArea";

const styles = createThemedStyleSheet((theme) => ({
  root: {
    gap: theme.spacing[1],
    flex: 1,
  },
  textInput: {
    backgroundColor: theme.color.white,
    borderColor: theme.color.violet[400],
    borderRadius: theme.spacing[6],
    borderWidth: 2,
    color: theme.color.violet[950],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    fontSize: 16,
    minHeight: 200,
    flex: 1,
  },
}));

export default TextArea;
