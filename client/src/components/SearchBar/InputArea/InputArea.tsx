import { Input, InputField, View } from "@gluestack-ui/themed";
import { TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import dataFetchers from "../../../../utils/(FUNC)dataFetchers";
import { ResultFoundUserContext } from "../SearchBar";
import { useContext } from "react";

const InputArea = () => {
  const [inputValue, setInputValue] = useState<string | null>(null);

  const [debounceValue] = useDebounce(inputValue, 1000);

  const { setResult } = useContext(ResultFoundUserContext);

  useEffect(() => {
    if (inputValue) {
      const searchRes = async () => {
        const { data } = await dataFetchers(`/search/find/user`, "POST", {
          username: debounceValue,
        });
        setResult(data);
      };

      searchRes();
    }
  }, [debounceValue]);

  return (
    <View>
      <Input>
        <InputField
          onChangeText={(text) => setInputValue(text)}
          placeholder={"search"}
          value={inputValue || ""}
        />
      </Input>
    </View>
  );
};

export default InputArea;
