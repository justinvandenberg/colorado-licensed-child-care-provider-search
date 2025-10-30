import { FC, useMemo } from "react";

import { Provider } from "@/types/Provider";

import { useTheme } from "@/providers/ThemeProvider";

import { createThemedStyleSheet } from "@/utilities/createThemedStyleSheet";
import TextIcon, { IconName } from "../ui/TextIcon";

type ProviderStandingProps = {
  qualityRating: Provider["quality_rating"];
};

const ProviderStanding: FC<ProviderStandingProps> = ({ qualityRating }) => {
  const theme = useTheme();
  const props = useMemo(() => {
    let iconName: IconName = "hourglass";
    let iconColor = theme.color.red[400];
    let title = "Not yet rated";
    let titleColor = theme.color.red[700];
    let bgColor = theme.color.red[100];

    switch (qualityRating) {
      case "1":
        iconName = "file-badge";
        iconColor = theme.color.yellow[400];
        title = "Licensed";
        titleColor = theme.color.yellow[700];
        bgColor = theme.color.yellow[100];
        break;

      case "2":
        iconName = "thumbsup";
        iconColor = theme.color.violet[400];
        title = "Good standing";
        titleColor = theme.color.violet[700];
        bgColor = theme.color.violet[100];
        break;

      case "3":
      case "4":
      case "5":
        iconName = "sponsor-tiers";
        iconColor = theme.color.green[400];
        title = "High-quality";
        titleColor = theme.color.green[700];
        bgColor = theme.color.green[100];
        break;
    }
    return {
      iconName,
      iconColor,
      title,
      titleColor,
      style: [styles.root, { backgroundColor: bgColor }],
    };
  }, [
    qualityRating,
    theme.color.green,
    theme.color.red,
    theme.color.violet,
    theme.color.yellow,
  ]);

  return <TextIcon {...props} />;
};

const styles = createThemedStyleSheet((theme) => ({
  root: {
    borderRadius: 12,
    marginBottom: 6,
    paddingHorizontal: theme.spacing[3],
  },
}));

export default ProviderStanding;
