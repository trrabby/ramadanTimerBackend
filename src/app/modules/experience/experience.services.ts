/* eslint-disable @typescript-eslint/no-explicit-any */

import QueryBuilder from '../../builder/QueryBuilder';
import { IExperience } from './experience.interface';
import { ExperieceModel } from './experience.model';

const SearchableFields = ['category', 'institute', 'designation', 'details'];

const create = async (payload: IExperience) => {
  const result = await ExperieceModel.create(payload);
  return result;
};

const getAll = async (query: Record<string, unknown>) => {
  const Query = new QueryBuilder(ExperieceModel.find(), query)
    .search(SearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await Query.modelQuery.sort({ _id: -1 }).find({
    $or: [
      { isDeleted: { $exists: false } }, // Documents where `isDeleted` does not exist
      { isDeleted: false }, // Documents where `isDeleted` is explicitly false
    ],
  });
  const meta = await Query.countTotal();

  return { meta, result };
};

const updateOneById = async (id: string, payload: Partial<IExperience>) => {
  const result = await ExperieceModel.findOneAndUpdate(
    { _id: id }, // Match the document where the id matches

    payload, // Apply the update
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    },
  );
  return result;
};

const updateInstLogoById = async (
  id: string,
  payload: Partial<IExperience>,
) => {
  const result = await ExperieceModel.findOneAndUpdate(
    { _id: id }, // Match the document where the id matches
    payload, // Apply the update
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    },
  );
  return result;
};

const deleteOneById = async (id: string) => {
  const result = await ExperieceModel.findOneAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } }, // Add the field `isDeleted` and set it to true
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    },
  );
  return result;
};

const getOneById = async (id: string) => {
  const result = await ExperieceModel.find({ _id: id });
  return result;
};

export const ExperieceServices = {
  create,
  getAll,
  updateOneById,
  updateInstLogoById,
  deleteOneById,
  getOneById,
};
