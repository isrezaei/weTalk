import { View, VStack } from "@gluestack-ui/themed";

import InputArea from "./InputArea/InputArea";
import Results from "./Results/Results";
import { createContext, useState } from "react";

export const ResultFoundUserContext = createContext<null | {
  result: {} | null;
  setResult: Function;
}>(null);

const SearchBar = () => {
  const [result, setResult] = useState(null);

  return (
    <View flex={1} p={"$5"} width={"$full"}>
      <VStack space={"md"}>
        <ResultFoundUserContext.Provider value={{ result, setResult }}>
          <InputArea />
          <Results />
        </ResultFoundUserContext.Provider>
      </VStack>
    </View>
  );
};

export default SearchBar;
