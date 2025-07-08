import { Schema, model } from 'mongoose';
import { IProject } from './project.interface';

const ProjectSchema = new Schema<IProject>(
  {
    projTitle: {
      type: String,
      required: true,
    },
    liveLInk: {
      type: String,
      required: true,
    },
    clientLink: {
      type: String,
      required: true,
    },
    serverLink: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    descriptionOfProject: {
      type: String,
      required: true,
    },
    thumbnails: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectModel = model<IProject>('Project', ProjectSchema);
