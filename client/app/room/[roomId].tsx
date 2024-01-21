import GluestackProvider from "GluestackProvider";
import {useLocalSearchParams} from "expo-router";
import dataFetchers from "../../utils/(FUNC)dataFetchers";
import useSession, {TSession} from "../../hooks/useSession";
import useSwrFetcher from "../../hooks/useSwrFetcher";
import {useSwrMutation} from "../../hooks/useSwrMutation";
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {socket} from "../../utils/(INIT)socket";
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";
import "react-native-url-polyfill/auto";
import {createClient} from "@supabase/supabase-js";
import {GiftedChat} from 'react-native-gifted-chat'
import {Text} from "@gluestack-ui/themed";

const supabase = createClient(
    "https://jypkghsswdcnotmnrieb.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtnaHNzd2Rjbm90bW5yaWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg3OTU1NjIsImV4cCI6MTk5NDM3MTU2Mn0.WxEQplNdW0Lq8f6kjv52evMEyGfEfj1rq9kZrSLbVfM",
);

const RoomId = () => {

    const {roomId, username, avatar} = useLocalSearchParams();
    const {session}: TSession = useSession();
    const {swrFetcher} = useSwrFetcher();
    const {swrMutation} = useSwrMutation();
    const [inputValue, setInputValue] = useState<null | string>(null);
    const [showActionsheet, setShowActionsheet] = useState(false);


    const {swrResult: messages} = swrFetcher(
        ["/chat/find/messages/roomId", roomId],
        ([_, roomId]) =>
            session ? dataFetchers(`/chat/find/messages/${roomId}`, "GET") : null,
        {
            refreshInterval: 0,
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


    const [chatUiMessages, setChatUiMessage] = useState([])


    useEffect(() => {
        function onGetMessages(socketParams) {
            setChatUiMessage(prev => GiftedChat.append(prev, socketParams),)
        }

        socket.on("(ROOMS)|(GET)|(MESSAGES)", onGetMessages);
        return () => socket.off("(ROOMS)|(GET)|(MESSAGES)", onGetMessages);
    }, []);

    //! Old Message update logic | (Socket.emit)
    // const sendMessage = () => {
    //   const messageObj = {
    //     id: uuid.v4(),
    //     context: inputValue,
    //     created_at: new Date(),
    //     user_id: session?.user?.id,
    //     room_id: roomId,
    //     files_url: "none",
    //   };
    //   socket
    //       .timeout(5000)
    //       .emit("(ROOMS)|(SEND)|(MESSAGES)", messageObj, async (err, response) => {
    //         if (err) {
    //           return sendMessage();
    //         }
    //         //>Send new message to database
    //         return await dataFetchers("/chat/post/messages", "POST", messageObj)
    //       });
    //   setInputValue(null);
    // };
    //?Choose image function
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
            const {data, error} = await supabase.storage
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
                        // return dataFetchers("/chat/post/messages", "POST", messageObj)
                    },
                );
            setInputValue(null);
            setUploadLoader("success");

        }

        handleClose();
    };
    //?Choose image function

    //!Thats old code


    // console.log(messages)

    //?New logic of chat ui!
    useEffect(() => {
        const convertMessageForChatUi = messages?.data?.map((msg) => {
            return ({
                _id: msg.id,
                text: msg.context,
                createdAt: msg.created_at,
                files_url: msg.files_url,
                room_id: msg.room_id,
                user: {
                    _id: msg.user_id
                }
            })
        })

        if (messages) {
            setChatUiMessage(convertMessageForChatUi)
        }
    }, [messages])

    //?Chat ui update with socket :))
    const onSend = useCallback((msg = []) => {
        const sendToDb = {
            _id: msg[0]._id,
            text: msg[0].text,
            createdAt: msg[0].createdAt,
            files_url: "none",
            room_id: roomId,
            user: {
                _id: msg[0].user._id
            }
        }
        socket
            .timeout(5000)
            .emit("(ROOMS)|(SEND)|(MESSAGES)", sendToDb, async (err, response) => {
                if (err) {
                    return onSend();
                }
                //>Send new message to database
                // return await dataFetchers("/chat/post/messages", "POST", messageObj)
            });
    }, [])


    return (
        <GluestackProvider>
            <GiftedChat
                messages={chatUiMessages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: session?.user.id || "",
                }}
            />
        </GluestackProvider>
    );
};

export default RoomId;
