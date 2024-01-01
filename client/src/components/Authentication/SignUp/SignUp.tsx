import { Button, ScrollView, Text, View } from "@gluestack-ui/themed";
import { useForm } from "react-hook-form";
import { signUpSchema } from "./Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Inputs from "./Inputs";
import { router } from "expo-router";

const signUpInputs = [
  {
    name: "firstName",
    type: "text",
    placeholder: "Your First Name",
    required: true,
  },
  {
    name: "lastName",
    type: "text",
    placeholder: "Your Last Name",
    required: true,
  },
  {
    name: "username",
    type: "text",
    placeholder: "Choose a username",
    required: true,
  },
  {
    name: "number",
    type: "text",
    placeholder: "Your phone number",
    required: false,
  },
  {
    name: "email",
    type: "text",
    placeholder: "Your Email",
    required: true,
  },
  {
    name: "age",
    type: "text",
    placeholder: "Your age",
    required: false,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Choose a strong password",
    required: true,
  },
  {
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm your password",
    required: true,
  },
];

const SignUp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch(
        process.env.EXPO_PUBLIC_URL_ADDRESS + "/authentication/signup",
        {
          method: "POST",
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
            age: data.age,
            number: data.number,
            password: data.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.status === 200) {
        alert("create successfull");
        return router.push("/verification");
      }
      if (res.status === 400) {
        console.log(await res.json());
        throw new Error(await res.json());
      }
    } catch (e) {
      console.log(e);
    }
  };

  const x = async () => {
    const res = await fetch(
      "http://192.168.1.103:3000/authentication/setToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log(await res.json());
    console.log(await res.headers.get("Set-Cookie"));
  };

  const y = async () => {
    const res = await fetch(
      "http://192.168.1.103:3000/authentication/getCookie",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log(await res.json());
  };

  return (
    <ScrollView p={"$10"}>
      {signUpInputs.map((value) => (
        <View key={value.name}>
          <Inputs
            control={control}
            errors={errors}
            type={"text"}
            name={value.name}
            placeholder={value.placeholder}
            required={false}
          />
        </View>
      ))}

      {signUpInputs.map((value) => (
        <Text key={value.name}>
          {errors[value.name] && <Text>{errors[value.name]?.message}</Text>}
        </Text>
      ))}

      <Button onPress={handleSubmit(onSubmit)}>
        <Text>Sign up</Text>
      </Button>

      <Button onPress={x}>
        <Text> Set Token</Text>
      </Button>

      <Button onPress={y}>
        <Text> Get Token</Text>
      </Button>
    </ScrollView>
  );
};

export default SignUp;
