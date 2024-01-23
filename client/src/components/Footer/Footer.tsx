import {
  Avatar,
  AvatarFallbackText,
  HStack,
  Text,
  SettingsIcon,
  MailIcon,
} from "@gluestack-ui/themed";
import useSession, { TSession } from "../../../hooks/useSession";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

const Footer = () => {
  const { session }: TSession = useSession();

  return (
    <HStack
      py={"$2"}
      px={"$4"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <HStack space={"md"}>
        <SettingsIcon size={"lg"} />

        <TouchableOpacity onPress={() => router.push("/requests")}>
          <MailIcon size={"lg"} />
        </TouchableOpacity>
      </HStack>


      <TouchableOpacity>
        <HStack bg={"#F5F5F5"} rounded={"$xl"} p={"$2"} space={"md"} alignItems={"center"}>
          <Text size={"sm"} bold={true}>
            {session?.user.username}
          </Text>
          <Avatar size={"sm"} bg={"$emerald200"}>
            <AvatarFallbackText>{session?.user.username}</AvatarFallbackText>
          </Avatar>
        </HStack>
      </TouchableOpacity>

    </HStack>
  );
};

export default Footer;
