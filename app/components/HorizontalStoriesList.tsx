import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const defaultThumbnail = "https://via.placeholder.com/150"; // Placeholder image URL

const HorizontalStoriesList = ({ stories, noStoriesText }) => {
  const { width } = Dimensions.get("window");
  const itemWidth = width * 0.42;

  const onPressStory = (storyId) => {
    router.navigate(`/storyView?id=${storyId}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={`View story titled ${item.title}`}
      style={[styles.storyCard, { width: itemWidth }]}
      onPress={() => onPressStory(item._id)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.thumbnailUrl || defaultThumbnail }}
          style={styles.storyImage}
          resizeMode="cover"
        />
        {item.genre && (
          <View style={styles.genreBadge}>
            <Text style={styles.genreText}>{item.genre}</Text>
          </View>
        )}
      </View>
      <View style={styles.storyContent}>
        <Text style={styles.storyTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {stories && stories.length ? (
        <FlatList
          data={stories}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={itemWidth + 16}
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
          initialNumToRender={5}
          windowSize={5}
        />
      ) : (
        <View>
          <Text style={styles.shrug}>
            <FontAwesome name="meh-o" size={24} />{'  '}{noStoriesText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 8,
  },
  storyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderColor: "#00AAFF",
    borderWidth: 1,
    marginRight: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 190,
  },
  imageContainer: {
    position: "relative",
  },
  storyImage: {
    width: "100%",
    height: 120,
  },
  genreBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#B0DAEE",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  genreText: {
    fontSize: 12,
    color: "#000",
    fontFamily: "DupletRoundedSemibold",
  },
  storyContent: {
    padding: 12,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  storyTitle: {
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
    color: "#333",
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  shrug: {
    textAlign: "center",
    fontSize: 15,
    color: "gray",
    fontFamily: "DupletRoundedSemibold",
    marginBottom: 10,
    fontStyle: "italic",
  },
});

export default HorizontalStoriesList;
