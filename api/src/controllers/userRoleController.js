import UserRoleModel from "../models/userRoleModel.js";

export const getAllUserRoles = async (req, res, next) => {
  try {
    const { skipEndUserRole } = req.query;
    let query = {};

    if (skipEndUserRole === 'true') {
      query = { name: { $ne: 'User' } };
    }

    const userRoles = await UserRoleModel.find(query);
    res.json(userRoles);
  } catch (error) {
    next(error);
  }
};

export const getUserRoleById = async (req, res, next) => {
  try {
    const userRole = await UserRoleModel.findById(req.params.id);
    if (!userRole) {
      return res.status(404).json({ message: "User Role not found" });
    }
    res.json(userRole);
  } catch (error) {
    next(error);
  }
};

export const createNewUserRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userRole = new UserRoleModel({ name, description });
    await userRole.save();

    res.status(201).json(userRole);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create user role", error: error.message });
  }
};
