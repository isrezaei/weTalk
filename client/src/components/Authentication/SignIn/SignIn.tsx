import {
    Button,
    ButtonText,
    HStack,
    Text, Toast,
    ToastDescription,
    ToastTitle, useToast,
    View,
    VStack
} from "@gluestack-ui/themed";
import Inputs from "./Inputs";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signUpSchema} from "../SignUp/Schema";
import {useEffect, useState} from "react";
import {Alert} from "react-native";
import {router} from "expo-router";
import {mutate} from "swr";
import useSession, {TSession} from "../../../../hooks/useSession";
import {MaterialIcons, FontAwesome, Feather} from '@expo/vector-icons';
import {ReactElement} from "react/index";


type TLoginInputs = Array<{
    name: string;
    type: "text" | "password";
    placeholder: string;
    required: boolean;
    icons: ReactElement
}>;

const loginInputs: TLoginInputs = [
    {
        name: "username",
        type: "text",
        placeholder: "Username",
        icons: <Feather name="user" size={24} color="gray"/>,
        required: true,
    },
    {
        name: "password",
        type: "password",
        placeholder: "Password",
        icons: <MaterialIcons name="password" size={24} color="gray"/>,
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

    const toast = useToast()

    const {session, error}: TSession = useSession();

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
                        username: loginInfo.username?.toLowerCase(),
                        password: loginInfo.password,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const result = await response.json();

            console.log(session?.user.confirmed);

            if (response.status === 400) {
                toast.show({
                    placement: "bottom",
                    render: ({ id }) => {
                        const toastId = "toast-" + id
                        return (
                            <Toast nativeID={toastId} action="error" variant="accent">
                                <VStack space="xs">
                                    <ToastTitle>Oops</ToastTitle>
                                    <ToastDescription>
                                        {result?.message}
                                    </ToastDescription>
                                </VStack>
                            </Toast>
                        )
                    },
                })
            }
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
        <View position={"relative"}>


            <VStack flex={1} justifyContent={"center"} p={"$4"} space={"xl"}>

                <VStack space={"md"}>

                    <View>
                        <Text sx={{lineHeight: 60}} size={"6xl"} bold>
                            Welcome
                        </Text>
                        <Text sx={{lineHeight: 60}} size={"6xl"} bold>
                            Back!
                        </Text>
                    </View>

                    <View>
                        <Text size={"sm"}>
                            Enter your username and password to get access your account!
                        </Text>
                    </View>

                </VStack>

                <View rounded={"$lg"} overflow={"hidden"}>
                    {loginInputs.map((value) => (
                        <VStack key={value.name}>
                            <Inputs
                                icons={value.icons}
                                name={value.name}
                                setLoginInfo={setLoginInfo}
                                type={value.type}
                                placeholder={value.placeholder}
                            />
                        </VStack>
                    ))}
                </View>


                <HStack justifyContent={"space-between"} px={"$2"} alignItems={"center"}>
                    <Text size={"sm"} bold>
                        Forgot?
                    </Text>

                    <Button size={"sm"} onPress={() => submitLogin()}>
                        <ButtonText mr={"$2"}>Login</ButtonText>
                        <Feather name="arrow-right-circle" size={20} color="white"/>
                    </Button>
                </HStack>

            </VStack>

            <VStack px={"$3"} py={"$5"}>
                <Text size={"sm"}>
                    Dont have an account?
                </Text>
                <Text bold size={"lg"}>
                    Create account
                </Text>
            </VStack>

        </View>
    );
};

export default SignIn;
