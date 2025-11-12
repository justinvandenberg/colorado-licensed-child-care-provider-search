import { Visit } from "@/types/User";
import { FC } from "react";
import { Pressable } from "react-native";
import Text from "./ui/Text";

type VisitCardProps = {
  onClick: () => void;
} & Visit;

const VisitCard: FC<VisitCardProps> = ({ id, onClick }) => {
  return (
    <Pressable onPress={onClick}>
      <Text>{id}</Text>
    </Pressable>
  );
};

export default VisitCard;
