import { Text, VStack } from "@gluestack-ui/themed";

const Content = ({ users: { username } }) => {
  return (
    <VStack>
      <Text bold={true} fontSize={"$md"}>
        {username}
      </Text>
      <Text fontSize={"$sm"} numberOfLines={1}>
        This is Content of message!
      </Text>
    </VStack>
  );
};

export default Content;
