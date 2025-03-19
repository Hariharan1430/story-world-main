import { randomUUID } from 'crypto';
import axios from "axios";
import { OpenAI } from "openai/index.mjs";
import dotenv from "dotenv";
import { uploadToGridFS } from "../db/gridfsStorage.js";
import { uploadImageToImgur } from './imgurService.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const downloadImage = async (url) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
};

const generateImageWithDalle = async (prompt, size) => {
  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size,
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("Image URL not generated");
    }

    console.log("Generated image URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error generating image with DALL·E:", error);
    throw new Error("Image generation failed");
  }
};

export const createStory = async (description, wordCount) => {
  try {
    const storyPrompt = `
      Write a story for a kid based on the following details:
      - Description: "${description}"
      - Max word count: ${wordCount}
      - The story should have a title, genre, a short summary, 
        and engaging content for kids.
        Content should have multiple meaningful paragraphs.
        Return a string that has the title, genre, summary, and content.
      - Each field in the string should delimited with "|||" symbols.
      - The result should have only one genre.
      - Result should be in this order title|||genre|||summary|||content.
    `;
    const storyResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: storyPrompt }],
    });

    const storyData = storyResponse.choices[0]?.message?.content;

    const parts = storyData.split('|||').map(part => part.replace(/^[^:]+:\s*/, '').trim());
    let jsonObject = {
      title: parts[0].replace('"', '').replace('"', ''),
      genre: parts[1],
      summary: parts[2],
      content: parts[3],
    };

    const imagePrompt = `
      Create a detailed and engaging image for a children's story based on the following:
      - Kid's prompt: "${description}". This is the highest priority and should directly guide the image.
      - Story Title: "${storyData.title}".
      - Genre: "${storyData.genre}".
      - Summary: "${storyData.summary}".
      Ensure the image captures the essence of the story with relevant and clear visual details, such as characters, actions, and the setting. 
      Use a realistic and vibrant art style (not cartoonish or overly abstract). 
      The image should align with the tone and mood of the story and be captivating for children.
    `;

    let imageRemoteUrl = await generateImageWithDalle(imagePrompt, "1024x1024");
    let thumbnailRemoteUrl = await generateImageWithDalle(imagePrompt, "256x256");

    imageRemoteUrl = await uploadImageToImgur(imageRemoteUrl);
    thumbnailRemoteUrl = await uploadImageToImgur(thumbnailRemoteUrl);

    jsonObject.imageUrl = imageRemoteUrl;
    jsonObject.thumbnailUrl = thumbnailRemoteUrl;

    return jsonObject;
  } catch (error) {
    console.error("Error creating story:", error);
    throw new Error(`Failed to create the story: ${error.message}`);
  }
};

export const checkPrompt = async (prompt) => {
  try {
    const response = await openai.createModeration({
      input: prompt,
    });

    const results = response.data.results[0];
    if (results.flagged) {
      return {
        isSafe: false,
        categories: results.categories,
      };
    } else {
      return { isSafe: true };
    }
  } catch (error) {
    return { isSafe: false, error };
  }
};
