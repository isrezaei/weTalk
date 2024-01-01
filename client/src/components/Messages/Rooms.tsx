import {
  HStack,
  Divider,
  Button,
  Text,
  View,
  ScrollView,
} from "@gluestack-ui/themed";
import Identity from "./Identity/Identity";
import Content from "./Content/Content";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import useSession, { TSession } from "../../../hooks/useSession";
import useSwrFetcher from "../../../hooks/useSwrFetcher";
import dataFetchers from "../../../utils/(FUNC)dataFetchers";
import _ from "lodash";

const Rooms = () => {
  const { swrFetcher } = useSwrFetcher();

  const { session }: TSession = useSession();

  const { swrResult: rooms } = swrFetcher(
    "(GET)|(USERS)|(ROOMS)",
    () =>
      session
        ? dataFetchers(`/chat/find/rooms/${session.user.id}`, "GET")
        : null,
    {
      refreshInterval: 1000,
    },
  );
  console.log(rooms);

  return (
    <>
      <ScrollView flex={1}>
        {rooms?.data?.map((rooms, i) => (
          <TouchableOpacity
            key={rooms?.id}
            onPress={() =>
              router.push({
                pathname: `/room/${rooms?.id}`,
                params: {
                  username: rooms?.users?.username,
                  avatar: rooms?.users?.avatar,
                },
              })
            }
          >
            <HStack
              w={"$full"}
              bg={"$coolGray100"}
              p={"$3"}
              my={"$1"}
              space={"sm"}
              rounded={"$lg"}
              alignItems={"center"}
            >
              <Identity {...rooms} />
              <Divider orientation={"vertical"} />
              <Content {...rooms} />
            </HStack>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

export default Rooms;
