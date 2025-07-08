/* eslint-disable @typescript-eslint/no-explicit-any */

import QueryBuilder from '../../builder/QueryBuilder';
import { IProject } from './project.interface';
import { ProjectModel } from './projects.model';

const carSearchableFields = [
  'projTitle',
  'shortDescription',
  'descriptionOfProject',
];

const createProject = async (payload: IProject) => {
  const result = await ProjectModel.create(payload);
  return result;
};

const getAllProjects = async (query: Record<string, unknown>) => {
  const projectsQuery = new QueryBuilder(ProjectModel.find(), query)
    .search(carSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await projectsQuery.modelQuery.sort({ _id: -1 }).find({
    $or: [
      { isDeleted: { $exists: false } }, // Documents where `isDeleted` does not exist
      { isDeleted: false }, // Documents where `isDeleted` is explicitly false
    ],
  });
  const meta = await projectsQuery.countTotal();

  return { meta, result };
};

const updateAProject = async (id: string, payload: Partial<IProject>) => {
  const result = await ProjectModel.findOneAndUpdate(
    { _id: id }, // Match the document where the id matches
    payload, // Apply the update
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    },
  );
  return result;
};

const deleteAProject = async (id: string) => {
  const result = await ProjectModel.findOneAndUpdate(
    { _id: id }, // Match the document where the email matches
    { $set: { isDeleted: true } }, // Add the field `isDeleted` and set it to true
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    },
  );
  return result;
};

const getAProject = async (id: string) => {
  const result = await ProjectModel.find({ _id: id });
  return result;
};

export const ProjectServices = {
  createProject,
  getAllProjects,
  updateAProject,
  deleteAProject,
  getAProject,
};
