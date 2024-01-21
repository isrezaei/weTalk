import {Input, InputField, InputIcon, InputSlot, View} from "@gluestack-ui/themed";
import {ReactElement} from "react/index";


type TInputs = {
    placeholder: string;
    type: "text" | "password";
    name: string;
    setLoginInfo: Function;
    icons: ReactElement
};

const Inputs = ({placeholder, type, setLoginInfo, name, icons}: TInputs) => {
    return (
        <View>
            <Input
                sx={{
                    borderRadius: 0,
                    borderWidth: 0,
                    height: 70,
                    backgroundColor: "#e7e7e7"
                }}
                size={"sm"}>
                <InputSlot pl="$3">
                    {icons}
                </InputSlot>
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
