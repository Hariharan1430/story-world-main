import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel.js";
import UserRoleModel from "../models/userRoleModel.js";
import { auth } from "../../firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
} from "firebase/auth";

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().populate({
      path: 'role',
      model: 'UserRole', // Use the correct model name
      select: 'name'
    }).exec();

    const result = users.map((user) => ({
      _id: user._id,
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      avatarId: user.avatarId,
      createdAt: user.createdAt,
      roleId: user.role?._id,
      roleName: user.role?.name || 'No Role',
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUserById = async (req, res) => {
  const { _id } = req.params;

  try {
    const user = await UserModel.findById(_id).populate("role", "name").exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      roleId: user.role._id,
      roleName: user.role.name,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const createNewUser = async (req, res) => {
  const { displayName, email, password, roleName = "User", avatarId } = req.body;

  try {
    const role = await UserRoleModel.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const newUser = new UserModel({
      uid: userCredential.user.uid,
      displayName,
      email,
      role: role._id,
      avatarId,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" + error.message });
  }
};

export const updateUser = async (req, res) => {
  const { uid, displayName, avatarId } = req.body;

  try {
    const user = await UserModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.displayName = displayName;
    user.avatarId = avatarId;
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const userData = await UserModel.findOne({ uid: user.uid }).populate("role", "name");

    // Generate JWT
    const token = jwt.sign({ uid: user.uid, email: user.email, role: userData.role.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "Sign-in successful",
      token,
      user: {
        uid: user.uid,
        displayName: userData.displayName,
        email: user.email,
        avatarId: userData.avatarId,
      },
    });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ message: "Failed to sign in" });
  }
};

export const signOut = async (req, res) => {
  try {
    await firebaseSignOut(auth);
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    console.error("Error signing out:", error);
    res.status(500).json({ message: "Error signing out the user" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ message: "Failed to send password reset email" });
  }
};
