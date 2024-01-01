import React, { useEffect, useState } from "react";
import { Button, ButtonText } from "@gluestack-ui/themed";
import _ from "lodash";
import useSession, { TSession } from "../../../../../hooks/useSession";
import useSwrFetcher from "../../../../../hooks/useSwrFetcher";
import { useSwrMutation } from "../../../../../hooks/useSwrMutation";
import dataFetchers from "../../../../../utils/(FUNC)dataFetchers";
import { Alert } from "react-native";
import { router } from "expo-router";
import uuid from "react-native-uuid";
import socketEmit from "../../../../../utils/(SOCKET)emit";
import { socket } from "../../../../../utils/(INIT)socket";

const RequestButton = ({ userInfo }) => {
  const { session }: TSession = useSession();
  const { swrFetcher } = useSwrFetcher();
  const { swrMutation } = useSwrMutation();
  const { swrResult, error } = swrFetcher("/get/request/chat/find", () =>
    session
      ? dataFetchers(`/request/chat/find/${session?.user?.id}/sender`, "GET")
      : null,
  );

  const conditional = !!_.find(swrResult?.data, {
    request_receiver_id: userInfo?.id,
  });

  const sendRequestChat = (receiverInfo, rolls) => {
    if (session?.user) {
      const bodyRequest = {
        id: uuid.v4(),
        request_sender_id: session?.user?.id,
        request_receiver_id: receiverInfo?.id,
        created_at: new Date(),
      };

      const removeData = _.remove(
        swrResult.data,
        ({ request_receiver_id }) => request_receiver_id === receiverInfo?.id,
      );

      swrMutation(
        "/get/request/chat/find",
        dataFetchers(`/request/${rolls}/chat`, "POST", bodyRequest),
        {
          ...swrResult,
          data: [...swrResult.data, rolls === "add" ? bodyRequest : removeData],
        },
      );
    } else {
      Alert.alert("User not access", "Pleas login first !");
      return router.push("/login");
    }
  };

  // useEffect(() => {
  //   // no-op if the socket is already connected
  //   socket.connect();
  //
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  //
  // const [wssInfo, setWssInfo] = useState([]);
  //
  // useEffect(() => {
  //   socket.on("(CHATS)|(REQUESTS)", (msg) => setWssInfo(wssInfo.concat(msg)));
  //   return () =>
  //     socket.off("(CHATS)|(REQUESTS)", (msg) =>
  //       setWssInfo(wssInfo.concat(msg)),
  //     );
  // }, []);
  //
  // console.log(wssInfo);
  //
  // const conditional = !!_.find(wssInfo, {
  //   request_receiver_id: userInfo?.id,
  // });
  //
  // const wsSendRequests = (receiverInfo, role) => {
  //   const body = {
  //     id: uuid.v4(),
  //     request_sender_id: session?.user?.id,
  //     request_receiver_id: receiverInfo?.id,
  //     created_at: new Date(),
  //   };
  //   socketEmit(socket, "(CHATS)|(REQUESTS)", { body, role });
  // };

  return (
    <Button
      onPress={() =>
        conditional
          ? sendRequestChat(userInfo, "delete")
          : sendRequestChat(userInfo, "add")
      }
      action={conditional ? "positive" : "secondary"}
      size={"xs"}
    >
      <ButtonText>{conditional ? "Pending" : "Send request"}</ButtonText>
    </Button>

    // <Button
    //   onPress={() =>
    //     conditional
    //       ? wsSendRequests(userInfo, "delete")
    //       : wsSendRequests(userInfo, "add")
    //   }
    //   action={conditional ? "positive" : "secondary"}
    //   size={"xs"}
    // >
    //   <ButtonText>{conditional ? "Pending" : "Send request"}</ButtonText>
    // </Button>
  );
};

export default RequestButton;
