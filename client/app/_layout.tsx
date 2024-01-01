import { Button, ButtonText, HStack } from "@gluestack-ui/themed";
import { router, Stack } from "expo-router";
import GluestackProvider from "../src/GluestackProvider";
import useSession, { TSession } from "../hooks/useSession";
import { mutate } from "swr";
import { ExpoProvider } from "expo";

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
              backgroundColor: "#e5e5e5",
            },
            headerTintColor: "#232323",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerRight: () => (
              <HStack space={"sm"}>
                {!session?.user ? (
                  <>
                    <Button
                      size={"sm"}
                      action={"positive"}
                      onPress={() => router.push("/signup")}
                    >
                      <ButtonText>signup</ButtonText>
                    </Button>
                    <Button
                      size={"sm"}
                      action={"secondary"}
                      onPress={() => router.push("/login")}
                    >
                      <ButtonText>login</ButtonText>
                    </Button>
                  </>
                ) : (
                  <Button size={"sm"} action={"negative"} onPress={logout}>
                    <ButtonText>logout</ButtonText>
                  </Button>
                )}
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
