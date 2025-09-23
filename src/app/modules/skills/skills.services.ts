/* eslint-disable @typescript-eslint/no-explicit-any */

import QueryBuilder from '../../builder/QueryBuilder';
import { ISkill } from './skills.interface';
import { SkillsModel } from './skills.model';

const skillsSearchableFields = ['skillName', 'description'];

const createProject = async (payload: ISkill) => {
  const result = await SkillsModel.create(payload);
  return result;
};

const getAllSkills = async (query: Record<string, unknown>) => {
  const SkillsQuery = new QueryBuilder(SkillsModel.find(), query)
    .search(skillsSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await SkillsQuery.modelQuery.sort({ _id: -1 }).find({
    $or: [
      { isDeleted: { $exists: false } }, // Documents where `isDeleted` does not exist
      { isDeleted: false }, // Documents where `isDeleted` is explicitly false
    ],
  });
  const meta = await SkillsQuery.countTotal();

  return { meta, result };
};

const updateSkill = async (id: string, payload: Partial<ISkill>) => {
  const result = await SkillsModel.findOneAndUpdate(
    { _id: id }, // Match the document where the id matches
    payload, // Apply the update
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    },
  );
  return result;
};

const deleteSkill = async (id: string) => {
  const result = await SkillsModel.findOneAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } }, // Add the field `isDeleted` and set it to true
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    },
  );
  return result;
};

export const SkillsServices = {
  createProject,
  getAllSkills,
  updateSkill,
  deleteSkill,
};
