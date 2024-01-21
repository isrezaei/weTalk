import { View } from "@gluestack-ui/themed";
import SignIn from "../../src/components/Authentication/SignIn/SignIn";
import { Stack } from "expo-router";
import {KeyboardAvoidingView, SafeAreaView} from "react-native";

const Login = () => {
  return (

      <SafeAreaView style={{ flex: 1, alignItems : "center"}}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

            <SignIn />

      </SafeAreaView>
  );
};

export default Login;
