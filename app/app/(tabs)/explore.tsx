import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import VerticalStoriesList from "@/components/VerticalStoriesList";
import UserHeader from "@/components/UserHeader";
import { getAllStories } from "@/app/services/storiesService";
import { useFocusEffect } from "expo-router";
import React from "react";

const ExploreScreen = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      if (!isLoading) fetchMoreStories();
    }, [pageNumber, isLoading])
  );

  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchMoreStories = async () => {
    setIsLoading(true);
    await delay(500); // Simulate a delay

    try {
      const response = await getAllStories(20, pageNumber + 1);
      const newStories = response?.data || [];

      if (!newStories.length) {
        console.log("No more stories to fetch.");
      } else {
        setStories((prevStories) => [...prevStories, ...newStories]);
        setPageNumber((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching stories:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <UserHeader />
      <Text style={styles.headerText}>Explore</Text>
      <VerticalStoriesList
        stories={stories}
        fetchMoreStories={fetchMoreStories}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "DupletRoundedSemibold",
  },
});

export default ExploreScreen;
