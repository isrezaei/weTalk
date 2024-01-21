import {
  View,
  ScrollView,
} from "@gluestack-ui/themed";
import Rooms from "../src/components/Messages/Rooms";
import Footer from "../src/components/Footer/Footer";
import SearchButton from "../src/components/SearchBar/SearchButton";
import useSession, {TSession} from "../hooks/useSession";
import Login from "./(authentication)/login";
import {useEffect} from "react";
import {Redirect, router} from "expo-router";
import {StatusBar} from "react-native";
const index = () => {

  const {session} : TSession = useSession()


  return (
    <View
      flex={1}
      p={"$2"}
      sx={{ _dark: { bg: "$trueGray900" }, _light: { bg: "$white" } }}
    >
      {
        session?.user ?
            <>
              <ScrollView flex={1}>
                <SearchButton />
                <Rooms />
              </ScrollView>
              <View>
                <Footer />
              </View>
            </>
            :
            <Redirect href={"/login"}/>

      }
    </View>
  );
};

export default index;
