import {
  View,
  ScrollView,
  VStack,
  Button,
  ButtonText,
  HStack,
} from "@gluestack-ui/themed";
import Rooms from "../src/components/Messages/Rooms";
import Footer from "../src/components/Footer/Footer";
import SearchButton from "../src/components/SearchBar/SearchButton";
import { useEffect } from "react";
import { socket } from "../utils/(INIT)socket";
const index = () => {
  useEffect(() => {
    //?Connect user to socket
    socket.connect();
    return () => socket.disconnect();
  }, []);

  return (
    <View
      flex={1}
      p={"$2"}
      sx={{ _dark: { bg: "$trueGray900" }, _light: { bg: "$white" } }}
    >
      <ScrollView flex={1}>
        <SearchButton />
        <Rooms />
      </ScrollView>
      <View>
        <Footer />
      </View>
    </View>
  );
};

export default index;
