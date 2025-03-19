import { router } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";

type StoryCardProps = {
  id: string,
  title: string;
  genre: string;
  image: string;
  likes: string;
};

const onPressStory = () => {
  router.navigate("/storyView?id=1");
};

const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  description,
  genre,
  thumbnail,
  likes,
}) => {
  return (
    <TouchableOpacity style={styles.storyCard} onPress={() => {}}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: thumbnail }}
          style={styles.storyImage}
        />
        <View style={styles.genreBadge}>
          <Text style={styles.genreText}>{genre}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.storyTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <View style={styles.storyActions}>
        <Text style={styles.actionIcon}>🎧 Listen</Text>
        <Text style={styles.actionIcon}>🔗 Share</Text>
        <View style={styles.likesContainer}>
          <Text style={styles.likesIcon}>👍 {likes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  storyCard: {
    backgroundColor: "#FFFFFF",
    width: "100%", // Ensures the story card spans the full width
    // borderColor: "#00AAFF", // Adds the border color to the story card
    // borderWidth: 1, // Defines the thickness of the border
    // borderRadius: 8, // Matches the section border radius
    overflow: "hidden", // Ensures content inside respects rounded corners
    elevation: 4, // Adds a shadow (optional)
    height: 520,
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
    width: "100%", // Ensures the image spans the full width of the story card
    height: 405,
  },
  storyImage: {
    width: "100%",
    height: "100%",
  },
  genreBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#B0DAEE",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: "DupletRoundedSemibold",
  },
  genreText: {
    fontSize: 12,
    color: "#000",
    fontFamily: "DupletRoundedSemibold",
  },
  storyTitle: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 3,
    fontFamily: "DupletRoundedSemibold",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    marginVertical: 8,
    color: '#B6B4B4',
    fontFamily: "DupletRoundedSemibold",
  },
  storyActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 15,
    color: "#00AAFF",
    fontFamily: "DupletRoundedSemibold",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesIcon: {
    fontSize: 15,
    color: "#00AAFF",
    marginRight: 4,
    fontFamily: "DupletRoundedSemibold",
  },
});

export default StoryCard;
