import GluestackProvider from "GluestackProvider";
import { useLocalSearchParams } from "expo-router";
import dataFetchers from "../../utils/(FUNC)dataFetchers";
import useSession, { TSession } from "../../hooks/useSession";
import useSwrFetcher from "../../hooks/useSwrFetcher";
import { useSwrMutation } from "../../hooks/useSwrMutation";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { socket } from "../../utils/(INIT)socket";
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import {
  Box,
  Button,
  ButtonText, CloseIcon, Icon,
  Spinner,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  View,
  VStack,
  Pressable
} from "@gluestack-ui/themed";
import {Image, SafeAreaView} from "react-native";
import RoomsHeader from "../../src/components/Rooms/Header/RoomsHeader";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import _ from "lodash";
import { FontAwesome5 } from "@expo/vector-icons";

const supabase = createClient(
  "https://jypkghsswdcnotmnrieb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtnaHNzd2Rjbm90bW5yaWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg3OTU1NjIsImV4cCI6MTk5NDM3MTU2Mn0.WxEQplNdW0Lq8f6kjv52evMEyGfEfj1rq9kZrSLbVfM",
);

const RoomId = () => {
  const { roomId, username, avatar } = useLocalSearchParams();
  const { session }: TSession = useSession();
  const { swrFetcher } = useSwrFetcher();
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [showActionsheet, setShowActionsheet] = useState(false);

  const { swrResult: messages } = swrFetcher(
    ["/chat/find/messages/roomId", roomId],
    ([_, roomId]) =>
      session ? dataFetchers(`/chat/find/messages/${roomId}`, "GET") : null,
    {
      refreshInterval: 1000,
      onLoadingSlow: () => {
        console.log("Loading ");
      },
    },
  );

  const handleClose = () => setShowActionsheet(!showActionsheet);

  //?Connect user to socket
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  //>When the component is mounted, the user joins the desired room
  useEffect(() => {
    socket.emit("(JOIN)|(ROOMS)", roomId);
  }, [roomId]);

  const [chatUiMessages, setChatUiMessage] = useState([]);

  useEffect(() => {
    function onGetMessages(socketParams) {
      setChatUiMessage((prev) => GiftedChat.append(prev, socketParams));
    }

    socket.on("(ROOMS)|(GET)|(MESSAGES)", onGetMessages);
    return () => socket.off("(ROOMS)|(GET)|(MESSAGES)", onGetMessages);
  }, []);

  //>First initial render and set state
  useEffect(() => {
    const convertMessageForChatUi = messages?.data
      ?.map((msg) => {
        return {
          _id: msg.id,
          text: msg.msg_type == "text" ? msg.context : null,
          createdAt: msg.created_at,
          room_id: msg.room_id,
          user: {
            _id: msg.user_id,
          },
          image:
            msg.msg_type == "image"
              ? `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${msg.context}`
              : null,
        };
      })
      .reverse();

    if (convertMessageForChatUi) {
      setChatUiMessage(convertMessageForChatUi);
    }
  }, [messages ? null : messages]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    handleClose();

    if (!result.canceled) {
      const formData = await new FormData();
      formData.append("file", {
        uri: result?.assets[0].uri || "",
        type: "image/jpeg",
        name: result?.assets[0].fileName || "",
      });

      setUploadStatus("pending")
      const { data, error } = await supabase.storage
        .from("we-talk")
        .upload(`/chat-images/${Date.now()}`, formData, {
          contentType: "image/jpeg",
        });

      const messageObj = {
        _id: uuid.v4(),
        msg_type: "image",
        createdAt: new Date(),
        user: {
          _id: session?.user?.id,
        },
        room_id: roomId,
        image: data?.fullPath,
      };

      socket.timeout(5000).emit(
        "(ROOMS)|(SEND)|(MESSAGES)",
        {
          ...messageObj,
          image: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.fullPath}`,
        },
        async (err, response) => {
          if (err) {
            return pickImage();
          }
          //>Send new message to database
          return dataFetchers("/chat/post/messages", "POST", messageObj);
        },
      );
      setUploadStatus("success")
    }

    handleClose();
  };
  //?Choose image function

  const toast = useToast();

  useEffect(() => {
    if (uploadStatus !== "idle") {
      toast.show({
        placement: "bottom left",
        duration : null,
        render: ({ id }) => {
          const toastId = "123";
          console.log(toastId)
          return (
            <SafeAreaView>
              <Toast nativeID={toastId} action="info" variant="accent" >
                <VStack space="xs">
                  <ToastDescription>
                    {uploadStatus == "pending" && "Uploading"}
                    {uploadStatus == "success" && "upload successful"}
                  </ToastDescription>
                </VStack>
                <Pressable mt="$1" onPress={() => toast.close(id)}>
                  <FontAwesome name="close" size={24} color="black" />
                </Pressable>
              </Toast>
            </SafeAreaView>
          );
        },
      });
    }
  }, [uploadStatus]);

  const onSend = useCallback((msg = []) => {
    const sendToDb = {
      _id: msg[0]._id,
      text: msg[0].text,
      createdAt: new Date(),
      room_id: roomId,
      msg_type: "text",
      user: {
        _id: msg[0].user._id,
      },
    };
    socket
      .timeout(5000)
      .emit("(ROOMS)|(SEND)|(MESSAGES)", sendToDb, async (err, response) => {
        if (err) {
          return onSend();
        }
        //>Send new message to database
        return await dataFetchers("/chat/post/messages", "POST", sendToDb);
      });
  }, []);

  return (
    <GluestackProvider>
      <RoomsHeader username={username} />
      <Box flex={1} bg={"white"}>
        <GiftedChat
          messages={chatUiMessages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: session?.user.id || "",
          }}
          renderAvatar={() => <Text>Hello</Text>}
          showUserAvatar={true}
          renderAvatarOnTop={true}
          inverted={true}
          renderActions={() => (
            <TouchableOpacity onPress={pickImage}>
              <VStack h={"$full"} justifyContent={"center"} p={"$2"}>
                <Ionicons name="document-attach" size={16} color="black" />
              </VStack>
            </TouchableOpacity>
          )}
          renderTicks={(props) => {
            const includeMessage = !!_.find(messages?.data, { id: props._id });
            return includeMessage ? (
              <View p={"$1"}>
                <FontAwesome5 name="check" size={12} color="white" />
              </View>
            ) : (
              <View>
                <Spinner size="small" />
              </View>
            );
          }}
          renderBubble={(message) => {
            return (
              <Bubble
                {...message}
                wrapperStyle={{
                  right: {
                    backgroundColor: "#ec27a8",
                  },
                  left: {
                    backgroundColor: "#ececec",
                  },
                }}
                textStyle={{ right: { fontWeight: "bold" } }}
              />
            );
          }}
          renderChatEmpty={() => <Text>Lets start talk :))</Text>}
          onLongPress={(context, messages) => {
            console.log(messages);
            console.log(context);
          }}
        />
      </Box>
    </GluestackProvider>
  );
};

export default RoomId;
