import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import HorizontalStoriesList from "./HorizontalStoriesList";
import Story from "../app/story";
import { User } from "../app/common/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { getTrendingStories } from "@/app/services/storiesService";
import { FontAwesome } from "@expo/vector-icons";

const TrendingStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userDataString = await AsyncStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString) as User;
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  const fetchTrendingStories = async () => {
    try {
      setLoading(true);
      const response = await getTrendingStories();
      if (response && response.status === 200) {
        setStories(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTrendingStories();
    }, [])
  );

  const handleViewAll = () => {
    router.push("/stack/RecentStories");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trending stories</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.headerLink}>
            View all {""}
            <FontAwesome name="chevron-right" size={13} color="#00AAFF" />
          </Text>
        </TouchableOpacity>
      </View>
      {!loading ? (
        <HorizontalStoriesList
          stories={stories}
          noStoriesText="No stories here yet!"
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00AAFF" />
        </View>
      )}
      <View style={{ height: 25 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "DupletRoundedSemibold",
  },
  headerLink: {
    fontSize: 15,
    fontFamily: "DupletRoundedSemibold",
    color: "#00AAFF",
  },
});

export default TrendingStories;
