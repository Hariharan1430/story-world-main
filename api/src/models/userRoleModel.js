import mongoose from 'mongoose';

const userRoleSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
});

const UserRoleModel = mongoose.model('UserRole', userRoleSchema);

export default UserRoleModel;