import express from "express";
import {
  getAllUserRoles,
  getUserRoleById,
  createNewUserRole,
} from "../controllers/userRoleController.js";

const router = express.Router();

/**
 * @swagger
 * /userRoles:
 *   get:
 *     summary: Retrieve a list of user roles
 *     responses:
 *       200:
 *         description: A list of user roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", getAllUserRoles);

/**
 * @swagger
 * /userRoles/{id}:
 *   get:
 *     summary: Retrieve a user role by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/:id", getUserRoleById);

/**
 * @swagger
 * /userRoles:
 *   post:
 *     summary: Create a new user role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", createNewUserRole);

export default router;
