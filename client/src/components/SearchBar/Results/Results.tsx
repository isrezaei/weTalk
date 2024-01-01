import { HStack, VStack } from "@gluestack-ui/themed";
import { ResultFoundUserContext } from "../SearchBar";
import { useContext } from "react";
import Avatars from "./People/Avatars";
import RequestButton from "./People/RequestButton";

const Results = () => {
  const { result } = useContext(ResultFoundUserContext);

  return (
    <VStack space={"sm"}>
      {result?.map((userInfo) => {
        return (
          <HStack
            key={userInfo?.id}
            alignItems={"center"}
            justifyContent={"space-between"}
            bg={"$warmGray200"}
            p={"$2"}
            rounded={"$xl"}
          >
            <Avatars userInfo={userInfo} />
            <RequestButton userInfo={userInfo} />
          </HStack>
        );
      })}
    </VStack>
  );
};

export default Results;
