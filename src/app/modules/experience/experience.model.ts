import { Schema, model } from 'mongoose';
import { IExperience } from './experience.interface';

const ExperieceSchema = new Schema<IExperience>(
  {
    category: { type: String, required: true },
    institute: { type: String, required: true },
    instituteLogo: { type: String },
    designation: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    currentlyWorking: { type: Boolean, default: false },
    details: { type: Schema.Types.Mixed, required: true },
    thumbnails: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const ExperieceModel = model<IExperience>('Experience', ExperieceSchema);
