import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // bcrypt hash
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
