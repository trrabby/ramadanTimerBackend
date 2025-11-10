/* eslint-disable @typescript-eslint/no-explicit-any */

import QueryBuilder from '../../builder/QueryBuilder';
import { IBlog } from './blogs.interface';
import { BlogModel } from './blogs.model';

const SearchableFields = ['title', 'category', 'tags'];

const create = async (payload: IBlog) => {
  const result = await BlogModel.create(payload);
  return result;
};

const getAll = async (query: Record<string, unknown>) => {
  const baseQuery = new QueryBuilder(BlogModel.find(), query)
    .search(SearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await baseQuery.modelQuery
    .sort({ _id: -1 })
    .find({
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
    })
    .populate({
      path: 'author',
      select: 'name email imgUrl role', // Fields to select from the populated document
    });
  const meta = await baseQuery.countTotal();

  return { meta, result };
};

const updateOneById = async (id: string, payload: Partial<IBlog>) => {
  const result = await BlogModel.findOneAndUpdate(
    { _id: id }, // Match the document where the id matches

    payload, // Apply the update
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    },
  );
  return result;
};

const updateCoverPhotoById = async (id: string, payload: Partial<IBlog>) => {
  const result = await BlogModel.findOneAndUpdate(
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
  const result = await BlogModel.findOneAndUpdate(
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
  const result = await BlogModel.find({ _id: id }).populate({
    path: 'author',
    select: 'name email imgUrl role', // Fields to select from the populated document
  });
  return result;
};

export const BlogsServices = {
  create,
  getAll,
  updateOneById,
  updateCoverPhotoById,
  deleteOneById,
  getOneById,
};
