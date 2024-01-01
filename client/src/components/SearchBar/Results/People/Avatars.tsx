import { Avatar, AvatarFallbackText, HStack, Text } from "@gluestack-ui/themed";

const Avatars = ({ userInfo }) => {
  return (
    <HStack alignItems={"center"} space={"sm"}>
      <Avatar>
        <AvatarFallbackText>{userInfo?.username}</AvatarFallbackText>
      </Avatar>
      <Text>{userInfo?.username}</Text>
    </HStack>
  );
};

export default Avatars;
