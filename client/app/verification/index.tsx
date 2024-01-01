import {
  Box,
  Button,
  ButtonText,
  Center,
  Text,
  View,
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, TextInput } from "react-native";
import { PinInput } from "@pakenfit/react-native-pin-input";
import useSession, { TSession } from "../../hooks/useSession";
import requestOTP from "../../api/requestOTP";

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const { session, error }: TSession = useSession();

  const otpRequest = async () => {
    if (session) {
      await requestOTP(session);
      setModalVisible(!modalVisible);
    }
    if (!session) return Alert.alert(error?.title || "", error?.body);
  };

  const otpVerify = async (otp: string) => {
    if (session) {
      const resVerify = await fetch(
        `${process.env.EXPO_PUBLIC_URL_ADDRESS}/otp/verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user?.id,
            otpCode: otp,
            currentDate: new Date(),
          }),
        },
      );

      console.log(await resVerify.json());
    }
  };

  return (
    <>
      <View flex={1}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible((prevState) => !prevState);
          }}
        >
          <View h={"$full"} bg={"$white"}>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Text>Hide Modal</Text>
            </Pressable>
            <Center h={"$full"}>
              <PinInput
                inputStyle={{ width: 50, height: 50, fontSize: 20 }}
                length={6}
                onFillEnded={(otp) => otpVerify(otp)}
              />
            </Center>
          </View>
        </Modal>

        <Box>
          <Button onPress={() => otpRequest()}>
            <ButtonText>Click to send verification code</ButtonText>
          </Button>
        </Box>
      </View>
    </>
  );
};

export default Index;
