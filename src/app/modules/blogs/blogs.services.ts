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
    .populate({
      path: 'author',
      select: 'name email imgUrl role',
    })
    .populate({
      path: 'feedbacks',
      select: 'feedback vote feedback_by createdAt',
      match: {
        $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
      },
      populate: {
        path: 'feedback_by',
        select: 'name email imgUrl role',
      },
    });

  const meta = await baseQuery.countTotal();

  return { meta, result };
};

const updateOneById = async (
  id: string,
  payload: Partial<IBlog>,
  options: any = {},
) => {
  const result = await BlogModel.findOneAndUpdate(
    { _id: id }, // Match the document where the id matches

    payload, // Apply the update
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
      ...options,
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
  const result = await BlogModel.findOne({
    _id: id,
    $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
  })
    .populate({
      path: 'author',
      select: 'name email imgUrl role',
    })
    .populate({
      path: 'feedbacks',
      select: 'feedback vote feedback_by createdAt',
      match: {
        $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
      },
      populate: {
        path: 'feedback_by',
        select: 'name email imgUrl role',
      },
    })
    .lean();

  if (!result) {
    return null;
  }

  // Filter out deleted feedback items from each feedback document
  if (result.feedbacks && Array.isArray(result.feedbacks)) {
    (result as any).feedbacks = result.feedbacks.map((feedbackDoc: any) => ({
      ...feedbackDoc,
      feedback:
        feedbackDoc.feedback?.filter(
          (fbItem: any) => fbItem.isDeleted !== true,
        ) || [],
    }));
  }

  // Calculate totals from the filtered feedbacks
  const feedbacks = result.feedbacks || ([] as any[]);

  const totalLikes = feedbacks.filter((fb) => fb.vote === 'like').length;
  const totalDislikes = feedbacks.filter((fb) => fb.vote === 'dislike').length;

  // Count total individual feedback text items (excluding deleted ones)
  const totalComments = feedbacks.reduce((total, feedbackDoc) => {
    if (feedbackDoc.feedback && Array.isArray(feedbackDoc.feedback)) {
      const validFeedbacks = feedbackDoc.feedback.filter(
        (fbItem: any) => fbItem.text && fbItem.text.trim() !== '',
      );
      return total + validFeedbacks.length;
    }
    return total;
  }, 0);

  return {
    ...result,
    totalLikes,
    totalDislikes,
    totalComments,
  };
};

export const BlogsServices = {
  create,
  getAll,
  updateOneById,
  updateCoverPhotoById,
  deleteOneById,
  getOneById,
};
