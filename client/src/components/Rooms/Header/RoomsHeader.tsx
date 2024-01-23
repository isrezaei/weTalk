import {Stack} from "expo-router";
import {Avatar, AvatarFallbackText, Text, VStack} from "@gluestack-ui/themed";
import {Platform} from "react-native";
import React from "react";

const RoomsHeader = ({username}) => {
    return (
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
                headerShadowVisible : false,
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

                        </VStack>
                    );
                },
            }}
        />
    );
};

export default RoomsHeader;
