import { Button, ButtonText, Text, View } from "@gluestack-ui/themed";
import Inputs from "./Inputs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../SignUp/Schema";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { mutate } from "swr";
import useSession, { TSession } from "../../../../hooks/useSession";

type TLoginInputs = Array<{
  name: string;
  type: "text" | "password";
  placeholder: string;
  required: boolean;
}>;

const loginInputs: TLoginInputs = [
  {
    name: "username",
    type: "text",
    placeholder: "Choose a username",
    required: true,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Choose a strong password",
    required: true,
  },
];

const SignIn = () => {
  const [loginInfo, setLoginInfo] = useState<{
    username: null | string;
    password: null | string;
  }>({
    username: null,
    password: null,
  });

  const { session, error }: TSession = useSession();

  useEffect(() => {
    if (session?.user?.confirmed) return router.push("/");
  }, [session]);

  const submitLogin = async () => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_URL_ADDRESS + "/authentication/login",
        {
          method: "POST",
          body: JSON.stringify({
            username: loginInfo.username,
            password: loginInfo.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      console.log(session?.user.confirmed);

      if (response.status === 400) return Alert.alert("Oops!", result?.message);
      if (response.status === 200) {
        Alert.alert("Welcome!", result?.message);
        await mutate("api/checkVerify");
        return router.push("/verification");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View p={"$10"}>
      {loginInputs.map((value) => (
        <View key={value.name}>
          <Inputs
            name={value.name}
            setLoginInfo={setLoginInfo}
            type={value.type}
            placeholder={value.placeholder}
          />
        </View>
      ))}
      <Button onPress={() => submitLogin()}>
        <ButtonText>Login</ButtonText>
      </Button>
    </View>
  );
};

export default SignIn;
