import React from "react";
import { Button, ButtonText, Input, InputField } from "@gluestack-ui/themed";
import { router } from "expo-router";

const SearchButton = () => {
  return (
    <Button onPress={() => router.push("/modal")}>
      <ButtonText>search :)</ButtonText>
    </Button>
  );
};

export default SearchButton;
