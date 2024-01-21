import React from "react";
import {Button, ButtonText, HStack, Input, InputField} from "@gluestack-ui/themed";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import {TouchableOpacity} from "react-native";

const SearchButton = () => {
  return (

      <HStack p={"$2"} justifyContent={"space-between"}>
          <Ionicons name="chatbox" size={24} color="gray" />
          <TouchableOpacity onPress={() => router.push("/modal")}>
              <Ionicons name="search" size={24} color="gray" />
          </TouchableOpacity>
      </HStack>
  );
};

export default SearchButton;
