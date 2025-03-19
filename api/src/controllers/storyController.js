import { createStory, checkPrompt } from "../services/openAIService.js";
import StoryModel from "../models/storyModel.js";

export const getAllStories = async (req, res, next) => {
  try {
    const { sort, limit, page, createdBy, status } = req.query;

    // Set default values if they are not provided
    const sortOption = sort || "-createdAt"; // Default to sorting by createdAt in descending order
    const itemsPerPage = limit ? parseInt(limit) : 20; // Default to 20 items per page
    const currentPage = page ? parseInt(page) : 1; // Default to page 1

    // Calculate the number of items to skip for pagination
    const skip = (currentPage - 1) * itemsPerPage;

    // Query the database with sorting, pagination, and filtering by createdBy
    const query = {};
    if (createdBy) {
      query.createdBy = createdBy;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = 'Published';
    }

    const stories = await StoryModel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(itemsPerPage);

    res.json(stories);
  } catch (error) {
    next(error);
  }
};

export const getStoryById = async (req, res, next) => {
  try {
    const story = await StoryModel.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    next(error);
  }
};

export const createNewStory = async (req, res, next) => {
  try {
    const { description, wordCount, uid, byContentCreator = false } = req.body;

    const isValidPrompt = await checkPrompt(description);

    console.log('isValidPrompt: ', isValidPrompt);
    /* if (!isValidPrompt.isSafe) {
      console.log('Invalid Prompt!');
      res.status(400).json({ message: "InvalidPrompt" });
      return;
    } */

    const storyData = await createStory(description, wordCount);

    if (byContentCreator) {
      storyData.status = "Draft";
    } else {
      storyData.status = "Published";
    }

    storyData.createdBy = uid;

    const story = new StoryModel(storyData);
    await story.save();

    res.status(201).json(story);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create story", error: error.message });
  }
};

export const publishStory = async (req, res, next) => {
  try {
    const { id } = req.query;
    const story = await StoryModel.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    story.status = 'Published';
    await story.save();

    res.json(story);
  } catch (error) {
    next(error);
  }
};
