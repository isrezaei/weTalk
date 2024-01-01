import { Input, InputField, View } from "@gluestack-ui/themed";

type TInputs = {
  placeholder: string;
  type: "text" | "password";
  name: string;
  setLoginInfo: Function;
};

const Inputs = ({ placeholder, type, setLoginInfo, name }: TInputs) => {
  return (
    <View>
      <Input>
        <InputField
          placeholder={placeholder}
          type={type}
          onChangeText={(text) =>
            setLoginInfo(
              (prev: { username: string | null; password: string | null }) => ({
                ...prev,
                [name]: text,
              }),
            )
          }
        />
      </Input>
    </View>
  );
};

export default Inputs;
