import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, required: true },
  avatarId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;