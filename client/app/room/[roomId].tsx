import {
  Avatar,
  AvatarFallbackText,
  Button,
  Input,
  InputField,
  Text,
  VStack,
  View,
  ButtonText,
  HStack,
  Box,
  ScrollView,
  Divider,
  Center,
  PaperclipIcon,
  Icon,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItemText,
  ActionsheetItem,
  Image,
  Spinner,
} from "@gluestack-ui/themed";
import moment from "moment";
import GluestackProvider from "GluestackProvider";
import { Stack, Tabs, useLocalSearchParams } from "expo-router";
import dataFetchers from "../../utils/(FUNC)dataFetchers";
import useSession, { TSession } from "../../hooks/useSession";
import useSwrFetcher from "../../hooks/useSwrFetcher";
import { useSwrMutation } from "../../hooks/useSwrMutation";
import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../utils/(INIT)socket";
import uuid from "react-native-uuid";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jypkghsswdcnotmnrieb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtnaHNzd2Rjbm90bW5yaWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg3OTU1NjIsImV4cCI6MTk5NDM3MTU2Mn0.WxEQplNdW0Lq8f6kjv52evMEyGfEfj1rq9kZrSLbVfM",
);

const RoomId = () => {
  const flatListRef = useRef();
  const { roomId, username, avatar } = useLocalSearchParams();
  const { session }: TSession = useSession();
  const { swrFetcher } = useSwrFetcher();
  const { swrMutation } = useSwrMutation();
  const [inputValue, setInputValue] = useState<null | string>(null);
  const [newMessage, setNewMessage] = useState([]);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [chatImages, setChatImages] = useState(null);

  const [uploadLoader, setUploadLoader] = useState("idle");

  const { swrResult: messages } = swrFetcher(
    ["/chat/find/messages/roomId", roomId],
    ([_, roomId]) =>
      session ? dataFetchers(`/chat/find/messages/${roomId}`, "GET") : null,
    {
      refreshInterval: 1000,
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

  //>Get new message from socket (Socket.on)
  useEffect(() => {
    function onGetMessages(values) {
      if (messages?.data) {
        setNewMessage((prevState) => [...messages.data, values]);
      }
    }

    socket.on("(ROOMS)|(GET)|(MESSAGES)", onGetMessages);
    return () => socket.off("(ROOMS)|(MESSAGES)", onGetMessages);
  }, []);

  //?Send new message logic | (Socket.emit)
  const sendMessage = () => {
    const messageObj = {
      id: uuid.v4(),
      context: inputValue,
      created_at: new Date(),
      user_id: session?.user?.id,
      room_id: roomId,
      files_url: "none",
    };

    socket
      .timeout(5000)
      .emit("(ROOMS)|(SEND)|(MESSAGES)", messageObj, async (err, response) => {
        if (err) {
          return sendMessage();
        }
        //>Send new message to database
        return swrMutation(
          ["/chat/find/messages/roomId", roomId],
          () => dataFetchers("/chat/post/messages", "POST", messageObj),
          {
            data: [...messages.data, messageObj],
          },
        );
      });
    setInputValue(null);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync();

    // setChatImages()

    handleClose();

    if (!result.canceled) {
      const formData = await new FormData();
      formData.append("file", {
        uri: result?.assets[0].uri || "",
        type: "image/jpeg",
        name: result?.assets[0].fileName || "",
      });

      setUploadLoader("pending");
      const { data, error } = await supabase.storage
        .from("we-talk")
        .upload(`/chat-images/${Date.now()}`, formData, {
          contentType: "image/jpeg",
        });

      const messageObj = {
        id: uuid.v4(),
        context: "none",
        created_at: new Date(),
        user_id: session?.user?.id,
        room_id: roomId,
        files_url: data?.fullPath,
      };

      socket
        .timeout(5000)
        .emit(
          "(ROOMS)|(SEND)|(MESSAGES)",
          messageObj,
          async (err, response) => {
            if (err) {
              return sendMessage();
            }
            //>Send new message to database
            return await swrMutation(
              ["/chat/find/messages/roomId", roomId],
              () => dataFetchers("/chat/post/messages", "POST", messageObj),
              {
                data: [...messages.data, messageObj],
              },
            );
          },
        );
      setInputValue(null);
      setUploadLoader("success");

      console.log(data);
      console.log(error);
    }

    handleClose();
  };

  useEffect(() => {
    console.log(flatListRef?.current?.scrollToEnd());
  }, [messages]);

  // useEffect(() => {
  //   console.log(flatListRef?.current?.scrollToEnd());
  //
  //   flatListRef?.current?.scrollToEnd();
  // }, [roomId, flatListRef?.current]);

  return (
    <GluestackProvider>
      <Stack.Screen
        options={{
          title: "",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#ce5050",
          headerTransparent: false,
          headerTitleAlign: "left",
          headerBackVisible: false,

          headerRight: () => (
            <Avatar size={"sm"} borderRadius="$xl">
              <AvatarFallbackText>{username}</AvatarFallbackText>
            </Avatar>
          ),
          [Platform.OS === "android" ? "headerTitle" : "headerLeft"]: () => {
            return (
              <VStack alignItems={"flex-start"}>
                <Text size={"2xl"} bold={true}>
                  {username}
                </Text>
                <Text size={"sm"}>online</Text>
              </VStack>
            );
          },
        }}
      />

      <View flex={8} p={"$5"} bg={"#fff"}>
        {/*{messages?.data && (*/}
        {/*  <FlatList*/}
        {/*    keyExtractor={(item) => item.id}*/}
        {/*    scrollEnabled={true}*/}
        {/*    ref={flatListRef}*/}
        {/*    style={{ flex: 2 }}*/}
        {/*    data={newMessage?.length ? newMessage : messages.data}*/}
        {/*    renderItem={({ item: message }) => {*/}
        {/*      return (*/}
        {/*        <HStack*/}
        {/*          m={"$1"}*/}
        {/*          key={message?.id}*/}
        {/*          justifyContent={*/}
        {/*            message?.user_id === session?.user.id*/}
        {/*              ? "flex-end"*/}
        {/*              : "flex-start"*/}
        {/*          }*/}
        {/*        >*/}
        {/*          <Box*/}
        {/*            bg={*/}
        {/*              message?.user_id === session?.user.id*/}
        {/*                ? "$light300"*/}
        {/*                : "$violet200"*/}
        {/*            }*/}
        {/*            p={"$2"}*/}
        {/*            rounded={"$xl"}*/}
        {/*          >*/}
        {/*            {message?.context != "none" ? (*/}
        {/*              <Text>{message?.context}</Text>*/}
        {/*            ) : (*/}
        {/*              <Image*/}
        {/*                alt={"message-images"}*/}
        {/*                size="2xl"*/}
        {/*                role={""}*/}
        {/*                source={{*/}
        {/*                  uri:*/}
        {/*                    "https://jypkghsswdcnotmnrieb.supabase.co/storage/v1/object/public/" +*/}
        {/*                    message.files_url,*/}
        {/*                }}*/}
        {/*              />*/}
        {/*            )}*/}
        {/*          </Box>*/}
        {/*        </HStack>*/}
        {/*      );*/}
        {/*    }}*/}
        {/*  />*/}
        {/*)}*/}

        <ScrollView ref={flatListRef} flex={2}>
          {(newMessage?.length ? newMessage : messages?.data)?.map(
            (message) => {
              return (
                <HStack
                  m={"$1"}
                  key={message?.id}
                  justifyContent={
                    message?.user_id === session?.user.id
                      ? "flex-end"
                      : "flex-start"
                  }
                >
                  <Box
                    bg={
                      message?.user_id === session?.user.id
                        ? "$light300"
                        : "$violet200"
                    }
                    p={"$2"}
                    rounded={"$xl"}
                  >
                    {message?.context != "none" ? (
                      <Text>{message?.context}</Text>
                    ) : (
                      <Image
                        alt={"message-images"}
                        size="2xl"
                        role={""}
                        source={{
                          uri:
                            "https://jypkghsswdcnotmnrieb.supabase.co/storage/v1/object/public/" +
                            message.files_url,
                        }}
                      />
                    )}
                    <Text size={"xs"}>
                      {moment(message?.created_at).format("LT")}
                    </Text>
                  </Box>
                </HStack>
              );
            },
          )}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        keyboardVerticalOffset={35 + 47}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <HStack
          w={"$full"}
          alignItems={"center"}
          justifyContent={"space-between"}
          p={"$4"}
        >
          <TextInput
            style={{
              height: 35,
            }}
            multiline={true}
            numberOfLines={5}
            maxLength={450}
            value={inputValue || ""}
            onChangeText={(text) => setInputValue(text)}
            placeholder="Enter Text here"
          />

          <HStack space={"md"} alignItems={"center"}>
            {uploadLoader !== "pending" ? (
              <TouchableOpacity onPress={handleClose}>
                <Icon as={PaperclipIcon} />
              </TouchableOpacity>
            ) : (
              <Spinner size="small" />
            )}

            {inputValue?.length ? (
              <Button
                rounded={"$full"}
                onPress={sendMessage}
                action={"positive"}
                size={"xs"}
              >
                <ButtonText>Send</ButtonText>
              </Button>
            ) : null}
          </HStack>
        </HStack>
      </KeyboardAvoidingView>

      <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
        <ActionsheetBackdrop />
        <ActionsheetContent h="$72" zIndex={999}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Camera</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={pickImage}>
            <ActionsheetItemText>Photo & Video</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Document</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Location</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </GluestackProvider>
  );
};

export default RoomId;
