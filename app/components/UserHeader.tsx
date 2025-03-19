import { StyleSheet, View, Image, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { User } from "@/app/common/types";
import { getAvatarPathById } from "@/app/services/avatarService";

export default function UserHeader() {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const setUserInfo = async () => {
      const userData = await AsyncStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    };

    setUserInfo();
  });
  
  return (
    <View style={styles.header}>
      <View style={styles.profileContainer}>
        <Image
          source={getAvatarPathById(user?.avatar || '')}
          style={styles.profileImage}
          resizeMode="contain"
        />
        <Text style={styles.username}>{user?.displayName}</Text>
      </View>
      <View style={styles.headerIcons}>
        {/* <AntDesign name="search" size={24} color="black" /> */}
        {/* <FontAwesome
            name="bookmark-o"
            size={20}
            color="black"
            style={styles.icon}
            /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 35,
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 25,
    marginRight: 10, // Adds spacing between the image and username
  },
  username: {
    fontSize: 20,
    fontFamily: "DupletRoundedSemibold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 10,
    marginRight: 8,
  },
});
