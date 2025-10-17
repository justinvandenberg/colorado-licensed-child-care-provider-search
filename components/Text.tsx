import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_400Regular_Italic } from "@expo-google-fonts/dm-sans/400Regular_Italic";
import { DMSans_500Medium } from "@expo-google-fonts/dm-sans/500Medium";
import { DMSans_500Medium_Italic } from "@expo-google-fonts/dm-sans/500Medium_Italic";
import { DMSans_600SemiBold } from "@expo-google-fonts/dm-sans/600SemiBold";
import { DMSans_600SemiBold_Italic } from "@expo-google-fonts/dm-sans/600SemiBold_Italic";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans/700Bold";
import { DMSans_700Bold_Italic } from "@expo-google-fonts/dm-sans/700Bold_Italic";
import { useFonts } from "@expo-google-fonts/dm-sans/useFonts";
import { FC } from "react";
import {
  ColorValue,
  Text as ReactNativeText,
  TextProps as ReactNativeTextProps,
} from "react-native";

type TextProps = {
  color?: ColorValue;
  fontSize?: number;
  fontWeight?:
    | 400
    | "400"
    | "400i"
    | 500
    | "500"
    | "500i"
    | 600
    | "600"
    | "600i"
    | 700
    | "700"
    | "700i";
} & ReactNativeTextProps;

const Text: FC<TextProps> = ({
  color,
  fontSize = 16,
  fontWeight = 400,
  style = {},
  ...props
}) => {
  // Ensure fonts are loaded
  let [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_400Regular_Italic,
    DMSans_500Medium_Italic,
    DMSans_600SemiBold_Italic,
    DMSans_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  } else {
    let fontFamily;
    switch (fontWeight) {
      case 400:
      case "400":
        fontFamily = "DMSans_400Regular";
        break;
      case "400i":
        fontFamily = "DMSans_400Regular_Italic";
        break;
      case 500:
      case "500":
        fontFamily = "DMSans_500Medium";
        fontWeight = 600;
        break;
      case "500i":
        fontFamily = "DMSans_500Medium_Italic";
        fontWeight = 600;
        break;
      case 600:
      case "600":
        fontFamily = "DMSans_600SemiBold";
        fontWeight = 600;
        break;
      case "600i":
        fontFamily = "DMSans_600SemiBold_Italic";
        fontWeight = 600;
        break;
      case 700:
      case "700":
        fontFamily = "DMSans_700Bold";
        fontWeight = 700;
        break;
      case "700i":
        fontFamily = "DMSans_700Bold_Italic";
        fontWeight = 700;
        break;
    }
    const letterSpacing = fontSize * -0.01; // Equal to -1%
    const lineHeight = fontSize; // Equal to 1

    return (
      <ReactNativeText
        {...props}
        style={[
          style,
          { color, lineHeight, fontFamily, fontSize, letterSpacing },
        ]}
      />
    );
  }
};

export default Text;
