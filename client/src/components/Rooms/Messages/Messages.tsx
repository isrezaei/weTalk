import React, {useEffect} from 'react';
import {Box, HStack, Image, Text, View} from "@gluestack-ui/themed";
import {FlatList} from "react-native";
import useSession, {TSession} from "../../../../hooks/useSession";


const Messages = ({messages , newMessage , flatListRef}) => {

    const { session }: TSession = useSession();

    useEffect(() => {
        const X = () => flatListRef?.current?.scrollToEnd()
        X()
    }, [newMessage]);

    return (
        <View flex={8} p={"$2"}  bg={"#7be36f"} position={"relative"}>
            <FlatList
                ref={flatListRef}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                contentContainerStyle={{
                    minHeight : 45,
                    backgroundColor : "red",
                    flexGrow: 1,  // Use flexGrow to make sure it takes up the available space
                    justifyContent: "flex-end",
                }}
                data={newMessage}
                renderItem={({ item: message }) => {
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
                                        role={undefined}
                                        source={{
                                            uri:
                                                "https://jypkghsswdcnotmnrieb.supabase.co/storage/v1/object/public/" +
                                                message.files_url,
                                        }}
                                    />
                                )}
                            </Box>
                        </HStack>
                    );
                }}
            />





        </View>
    );
};

export default Messages;
