import {Button, ButtonText, HStack} from "@gluestack-ui/themed";
import {Redirect, Stack} from "expo-router";
import GluestackProvider from "../src/GluestackProvider";
import useSession, {TSession} from "../hooks/useSession";
import {mutate} from "swr";

const Layout = () => {
  const { session, error }: TSession = useSession();
  const logout = async () => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_URL_ADDRESS}/authentication/logout`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return await mutate("api/checkVerify");
  };


  return (
    <GluestackProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Chats",
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTintColor: "#232323",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerBackVisible : false,
            headerShadowVisible : false,
            headerShown : !!session?.user,
            headerRight: () => (
              <HStack space={"sm"}>
                {session?.user &&
                  <Button size={"sm"} action={"negative"} onPress={logout}>
                    <ButtonText>logout</ButtonText>
                  </Button>
                }
              </HStack>
            ),
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </GluestackProvider>
  );
};

export default Layout;
