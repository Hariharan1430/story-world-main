import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import UserHeader from "@/components/UserHeader";
// import SpeechToText from '@/components/SpeechToText';
import Icon from "react-native-vector-icons/FontAwesome";
import { router, useFocusEffect } from "expo-router";
// import { Audio } from "expo-av";
// import * as Permissions from "expo-permissions";
import axios from "axios";
import Config from "react-native-config";
import Story from "../story";
import { User } from "../common/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecentStories from "@/components/RecentStories";
import TrendingStories from "@/components/TrendingStories";
import { createStory } from "@/app/services/storiesService";

const CreateStoryScreen = () => {
  const [storyDescription, setStoryDescription] = useState("");
  const [storyLength, setStoryLength] = useState(1000);
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<User | null>();

  useFocusEffect(
    React.useCallback(() => {
      setStoryDescription('');
    }, [])
  );
  
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

  const handleCreateStory = async () => {
    setIsCreating(true);
    try {
      const response = await createStory(storyDescription, storyLength, user?.id);

      // Navigate to the story preview screen with the created story's ID
      const storyId = response.data._id;
      setIsCreating(false);
      router.navigate(`/storyView?id=${storyId}`);
    } catch (error: any) {
      console.log('error.data.message:::::::::::::::::::::::::::::::::::::: ');
      console.log('error: ', JSON.stringify(error));
      console.log('error.data.message: ', error.data.message);
      console.log('error.data.message:::::::::::::::::::::::::::::::::::::: ');
      if (error.response) {
        // If there is a response, handle the error based on the status code
        if (error.response.status === 400) {
          Alert.alert('Bad request. Please check the data you are sending.');
        } else {
          Alert.alert('An unexpected error occurred.');
        }
      } else if (error.message === 'InvalidPrompt') {
        Alert.alert('Prompt has offensive or abusive words. Please check!');
      } else {
        // Handle general errors (network issues, etc.)
        Alert.alert('Network error. Please try again later.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <UserHeader />

      {/* Create Your Story Section */}
      <Text
        style={{
          fontSize: 20,
          marginBottom: 10,
          marginTop: -10,
          fontFamily: "DupletRoundedSemibold",
        }}
      >
        Create your story
      </Text>
      <Text
        style={{
          fontSize: 15,
          marginBottom: 10,
          marginTop: 0,
          fontFamily: "DupletRoundedSemibold",
          color: "gray",
        }}
      >
        Write a short description to create a story!
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={10}
          textAlignVertical="top"
          maxLength={160}
          value={storyDescription}
          onChangeText={(newText) => setStoryDescription(newText)}
        />
      </View>

      <View style={styles.recordContainer}>
        {/* <SpeechToText /> */}
        <Text style={styles.characterCounter}>
          Characters limit: {storyDescription.length}/160
        </Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1000}
        value={storyLength}
        minimumTrackTintColor="#00AAFF"
        maximumTrackTintColor="#000000"
        thumbImage={require("@/assets/images/circle-filled.png")}
        onValueChange={(newValue) => setStoryLength(newValue)}
      />
      <Text
        style={{
          fontSize: 14,
          marginBottom: 10,
          marginTop: -10,
          fontFamily: "DupletRoundedSemibold",
          color: "gray",
        }}
      >
        Number of words for the story: {storyLength}
      </Text>

      {/* Generate Story Button */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleCreateStory}
        disabled={!storyDescription.trim().length}
      >
        <FontAwesome name="magic" size={18} color="#000" style={styles.icon} />
        <Text style={styles.generateText}>Create</Text>
      </TouchableOpacity>

      <RecentStories />
      <TrendingStories />      

      {/* Loading Overlay */}
      <Modal transparent animationType="fade" visible={isCreating}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#00AAFF" />
          <Text style={styles.overlayText}>Creating your story...</Text>
        </View>
      </Modal>

      <View style={{ height: 25 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    fontFamily: "DupletRoundedSemibold",
  },
  icon: {
    marginHorizontal: 10,
    marginRight: 8,
  },
  characterCounter: {
    color: "gray",
    fontFamily: "DupletRoundedSemibold",
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 16,
    fontFamily: "DupletRoundedSemibold",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#00aaff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  textInput: {
    fontSize: 16,
    fontFamily: "DupletRoundedRegular",
    color: "#333",
    borderColor: "#00aaff",
    height: 100,
    padding: 0,
  },
  recordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 0,
  },
  characterCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#888",
    fontFamily: "DupletRoundedSemibold",
  },
  slider: {
    width: "100%",
    height: 30,
    marginVertical: 10,
  },
  thumb: {
    width: 30, // Adjust the width of the thumb
    height: 30, // Adjust the height of the thumb
    borderRadius: 50, // Make the thumb circular
    backgroundColor: "#00AAFF",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center", // Ensures button is centered within its container
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#00AAFF",
    width: 300, // Set an appropriate width
    marginTop: 20,
    height: 40,
  },
  generateText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
    fontFamily: "DupletRoundedSemibold",
  },
  generateButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "DupletRoundedSemibold",
  },
  storiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  storyImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  storyContent: {
    marginTop: 8,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  storyGenre: {
    fontSize: 12,
    color: "#888",
  },
  storyDescription: {
    fontSize: 12,
    color: "#444",
  },
  storyActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  actionIcon: {
    marginRight: 10,
  },
  likesIcon: {},
  likesContainer: {
    borderColor: "red",
    borderWidth: 2,
    textAlign: "right",
  },
  likes: {
    fontSize: 12,
    color: "#888",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayText: {
    marginTop: 10,
    fontSize: 18,
    color: "#fff",
    fontFamily: "DupletRoundedSemibold",
  },
});

export default CreateStoryScreen;
