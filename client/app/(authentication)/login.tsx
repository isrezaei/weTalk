import { View } from "@gluestack-ui/themed";
import SignIn from "../../src/components/Authentication/SignIn/SignIn";
import { Stack } from "expo-router";
import { KeyboardAvoidingView, SafeAreaView, StatusBar } from "react-native";

const Login = () => {
  return (
    <View
      alignItems={"center"}
      flex={1}
      sx={{ _dark: { bg: "$trueGray900" }, _light: { bg: "$white" } }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SignIn />
    </View>
  );
};

export default Login;
