import {
  CertificateBadge1Outlined,
  StarSharpDisabledOutlined,
  ThumbsUp3Outlined,
  Trophy1Outlined,
} from "@lineiconshq/free-icons";
import { FC, useMemo } from "react";

import { Provider } from "@/types/Provider";

import { useTheme } from "@/providers/ThemeProvider";

import TextIcon from "./TextIcon";

type ProviderQualityRatingProps = {
  qualityRating: Provider["quality_rating"];
};

const ProviderQualityRating: FC<ProviderQualityRatingProps> = ({
  qualityRating,
}) => {
  const theme = useTheme();
  const props = useMemo(() => {
    let icon = StarSharpDisabledOutlined;
    let iconColor = theme.color.red[400];
    let title = "Not yet rated";
    let titleColor = theme.color.red[700];

    switch (qualityRating) {
      case "1":
        icon = CertificateBadge1Outlined;
        iconColor = theme.color.yellow[400];
        title = "Licensed";
        titleColor = theme.color.yellow[700];
        break;

      case "2":
        icon = ThumbsUp3Outlined;
        iconColor = theme.color.violet[400];
        title = "Good standing";
        titleColor = theme.color.violet[700];
        break;

      case "3":
      case "4":
      case "5":
        icon = Trophy1Outlined;
        iconColor = theme.color.green[400];
        title = "High-quality";
        titleColor = theme.color.green[700];
        break;
    }
    return {
      icon,
      iconStyle: { color: iconColor },
      title,
      titleStyle: { color: titleColor },
    };
  }, [
    qualityRating,
    theme.color.green,
    theme.color.violet,
    theme.color.yellow,
  ]);

  return <TextIcon {...props} />;
};

export default ProviderQualityRating;
