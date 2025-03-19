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
import { getRecentStories } from "@/app/services/storiesService";
import { FontAwesome } from "@expo/vector-icons";

const RecentStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchRecentStories();
      }
    }, [user])
  );

  const fetchRecentStories = async () => {
    try {
      setLoading(true);
      const response = await getRecentStories(user?.id);
      console.log('response = ', response);
      
      if (response && response.status === 200) {
        setStories(response.data);
        setError(null);
      } else {
        setError("Failed to load stories.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    router.push("/stack/RecentStories");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My recent stories</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.headerLink}>
            View all {""}
            <FontAwesome name="chevron-right" size={13} color="#00AAFF" />
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00AAFF" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : stories.length > 0 ? (
        <HorizontalStoriesList
          stories={stories}
          noStoriesText="Nothing here yet — start crafting your stories now!"
        />
      ) : (
        <Text style={styles.noStoriesText}>
          Nothing here yet — start crafting your stories now!
        </Text>
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 15,
  },
  noStoriesText: {
    textAlign: "center",
    fontStyle: 'italic',
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
});

export default RecentStories;
