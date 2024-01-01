import { View } from "@gluestack-ui/themed";
import SearchBar from "../src/components/SearchBar/SearchBar";

export default function Modal() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <SearchBar />
    </View>
  );
}
