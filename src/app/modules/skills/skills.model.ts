import { Schema, model } from 'mongoose';
import { ISkill } from './skills.interface';

const SkillsSchema = new Schema<ISkill>(
  {
    imgUrl: { type: String, required: true },

    skillName: { type: String, unique: true, required: true },

    description: { type: String },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const SkillsModel = model<ISkill>('Skills', SkillsSchema);
