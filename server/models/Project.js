import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    role: { type: String, required: true }, // e.g. "Interactive Experience / WebGL"
    // Which canvas animation to render behind the card on the frontend
    type: {
      type: String,
      enum: ['particles', 'grid', 'wave', 'noise', 'scan'],
      default: 'particles',
    },
    color: { type: String, default: 'c8ff00' }, // hex without '#'
    large: { type: Boolean, default: false }, // spans 2 grid columns
    order: { type: Number, default: 0 }, // controls display order
    link: { type: String, default: '' }, // optional external URL
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
