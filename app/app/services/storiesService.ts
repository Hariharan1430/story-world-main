import axios from "axios";
import Config from "react-native-config";

const API_BASE_URL = "http://localhost:5000/api";

// TODO: Place it in a common place
interface Story {
  id: string;
  title: string;
  genre: string,
  summary: string;
  content: string;
  imageUrl: string;
  thumbnailUrl: string;
}

export const getRecentStories = async (userId) => {
  return await axios.get(
    `${API_BASE_URL}/stories?createdBy=${userId}`
  );
};

// TODO: Implement the logic for fetching all stories with pagination support
export const getAllStories = async (limit, page) => {
  return await axios.get(`${API_BASE_URL}/stories?limit=${limit}&page=${page}`);
};

// TODO: Implement the logic for fetching trending stories
export const getTrendingStories = async () => {
  return await axios.get(`${API_BASE_URL}/stories`);
};

export const getStoryById = async (id: string) => {
  return await axios.get<Story>(
    `${API_BASE_URL}/stories/${id}`
  );
};

export const createStory = async (storyDescription: string, storyLength, uid) => {
  return await axios.post(
    `${API_BASE_URL}/api/stories`,
    {
      description: storyDescription,
      wordCount: storyLength,
      uid: uid,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
