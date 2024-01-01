import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  View,
} from "@gluestack-ui/themed";

const Identity = ({ users: { avatar, username } }) => {
  return (
    <View>
      <Avatar bg={"$violet200"}>
        <AvatarFallbackText>{username}</AvatarFallbackText>
      </Avatar>
    </View>
  );
};

export default Identity;
