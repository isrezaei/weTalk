import {
  HStack,
  Divider,
  Button,
  Text,
  View,
  ScrollView, VStack,
} from "@gluestack-ui/themed";
import Identity from "./Identity/Identity";
import Content from "./Content/Content";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import useSession, { TSession } from "../../../hooks/useSession";
import useSwrFetcher from "../../../hooks/useSwrFetcher";
import dataFetchers from "../../../utils/(FUNC)dataFetchers";
import _ from "lodash";
import { SimpleGrid } from 'react-native-super-grid';

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

    const calculateItemHeight = (content) => {
        const lineHeight = 20; // Adjust this based on your font size and line height
        const numberOfLines = Math.ceil(content.length / 30); // Adjust this based on your content length per line
        return numberOfLines * lineHeight + 20; // Add extra padding if needed
    };

  return (
    <>

      <SimpleGrid
          itemDimension={130}
          data={rooms?.data}
          listKey = {({ item }) => item?.id}
          renderItem={({ item  : rooms}) => (
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
                <VStack
                    sx={{ height: 200, overflow: 'hidden' }}
                    bg={"$coolGray100"}
                    p={"$3"}
                    rounded={"$lg"}
                    space={"sm"}
                >
                  <Identity {...rooms} />
                  <Divider orientation={"horizontal"} />
                  <Content {...rooms} />
                </VStack>
              </TouchableOpacity>

          )}
      />

      {/*<ScrollView flex={1}>*/}
      {/*  {rooms?.data?.map((rooms, i) => (*/}
      {/*    <TouchableOpacity*/}
      {/*      key={rooms?.id}*/}
      {/*      onPress={() =>*/}
      {/*        router.push({*/}
      {/*          pathname: `/room/${rooms?.id}`,*/}
      {/*          params: {*/}
      {/*            username: rooms?.users?.username,*/}
      {/*            avatar: rooms?.users?.avatar,*/}
      {/*          },*/}
      {/*        })*/}
      {/*      }*/}
      {/*    >*/}
      {/*      <HStack*/}
      {/*        w={"$full"}*/}
      {/*        bg={"$coolGray100"}*/}
      {/*        p={"$3"}*/}
      {/*        my={"$1"}*/}
      {/*        space={"sm"}*/}
      {/*        rounded={"$lg"}*/}
      {/*        alignItems={"center"}*/}
      {/*      >*/}
      {/*        <Identity {...rooms} />*/}
      {/*        <Divider orientation={"vertical"} />*/}
      {/*        <Content {...rooms} />*/}
      {/*      </HStack>*/}
      {/*    </TouchableOpacity>*/}
      {/*  ))}*/}
      {/*</ScrollView>*/}
    </>
  );
};

export default Rooms;
