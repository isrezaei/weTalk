import { Text, VStack } from "@gluestack-ui/themed";

const Content = ({ prev_message , users: { username} }) => {
  return (
    <VStack>
      <Text bold={true} fontSize={"$md"}>
        {username}
      </Text>
      <Text numberOfLines={1} fontSize={"$sm"}>
          {prev_message}
      </Text>
    </VStack>
  );
};

export default Content;
