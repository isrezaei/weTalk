import dataFetchers from "../../../utils/(FUNC)dataFetchers";
import useSwrFetcher from "../../../hooks/useSwrFetcher";
import { Button, ButtonText, HStack } from "@gluestack-ui/themed";
import useSession, { TSession } from "../../../hooks/useSession";
import Avatars from "../SearchBar/Results/People/Avatars";
import uuid from "react-native-uuid";
import { socket } from "../../../utils/(INIT)socket";
import { useEffect } from "react";
import { router } from "expo-router";

const Requests = () => {
  const { session }: TSession = useSession();

  const { swrFetcher } = useSwrFetcher();

  const { swrResult: submittedRequests, error } = swrFetcher(
    "(GET)|(RECEIVER)|(REQUESTS)",
    () =>
      session
        ? dataFetchers(`/request/chat/find/${session?.user.id}/receiver`, "GET")
        : null,
    {
      refreshInterval: 1000,
    },
  );

  const handelConfirmRequests = async (requestSenderUser) => {
    const result = await dataFetchers("/request/chat/confirm", "POST", {
      id: uuid.v4(),
      request_sender_id: requestSenderUser?.id,
      request_receiver_id: session?.user.id,
      created_at: new Date(),
    });
    // console.log(result);

    console.log(result);
    //>Go to room of chats
    router.push(`/room/${result?.data?.id}`);
  };

  return submittedRequests?.data?.map((userInfo) => {
    return (
      <HStack
        justifyContent={"space-between"}
        alignItems={"center"}
        key={userInfo?.id}
        p={"$5"}
      >
        <Avatars key={userInfo?.id} userInfo={userInfo} />
        <Button onPress={() => handelConfirmRequests(userInfo)} size={"xs"}>
          <ButtonText>Confirm</ButtonText>
        </Button>
      </HStack>
    );
  });
};

export default Requests;
