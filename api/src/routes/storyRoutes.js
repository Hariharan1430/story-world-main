import express from 'express';
import {
  getAllStories,
  getStoryById,
  createNewStory,
  publishStory,
  //updateStory,
  //deleteStory,
} from '../controllers/storyController.js';

const router = express.Router();

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Retrieve a list of stories
 *     responses:
 *       200:
 *         description: A list of stories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", getAllStories);

/**
 * @swagger
 * /stories/{id}:
 *   get:
 *     summary: Retrieve a story by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A story
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/:id", getStoryById);

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Create a new story
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", createNewStory);

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Create a new story
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/publish", publishStory);

/**
 * @swagger
 * /stories/{id}:
 *   put:
 *     summary: Update a story
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */
//router.put("/:id", updateStory);

/**
 * @swagger
 * /stories/{id}:
 *   delete:
 *     summary: Delete a story
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
//router.delete("/:id", deleteStory);

export default router;