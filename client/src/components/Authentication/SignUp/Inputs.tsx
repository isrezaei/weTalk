import { Input, InputField, Text, View } from "@gluestack-ui/themed";
import { Controller } from "react-hook-form";
import { TextInput } from "react-native";

type TInputsProps = {
  type: "text" | "password";
  name: string;
  placeholder: string;
  required: boolean;
  control: any;
  errors: any;
};

export default function Inputs({
  type,
  name,
  placeholder,
  required,
  control,
  errors,
}: TInputsProps) {
  return (
    <View>
      <Controller
        control={control}
        rules={{
          required,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name={name}
      />
    </View>
  );
}
