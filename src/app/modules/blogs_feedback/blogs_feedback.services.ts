/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { BlogsServices } from '../blogs/blogs.services';
import { IBlog_Feedback } from './blogs_feedback.interface';
import { BlogFeedbackModel } from './blogs_feedback.model';
const SearchableFields = ['feedback'];

const create = async (payload: IBlog_Feedback) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create blog feedback within transaction
    const result = await BlogFeedbackModel.create([payload], { session });

    // Update blog with feedback reference
    await BlogsServices.updateOneById(
      payload.blog as any,
      {
        $push: { feedbacks: result[0]._id },
      } as any,
      { session }, // Pass session to maintain transaction
    );

    // Commit the transaction
    await session.commitTransaction();
    return result[0];
  } catch (error) {
    // Rollback any changes made in the transaction
    await session.abortTransaction();
    throw error; // Re-throw the error after rollback
  } finally {
    // End the session
    session.endSession();
  }
};

const getAll = async (query: Record<string, unknown>) => {
  const baseQuery = new QueryBuilder(BlogFeedbackModel.find(), query)
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
      path: 'blog',
      select: 'title category', // Fields to select from the populated document
    })
    .populate({
      path: 'feedback_by',
      select: 'name email imgUrl role', // Fields to select from the populated document
    });
  const meta = await baseQuery.countTotal();

  return { meta, result };
};

const updateOneById = async (id: string, payload: Partial<IBlog_Feedback>) => {
  const result = await BlogFeedbackModel.findOneAndUpdate(
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
  const result = await BlogFeedbackModel.findOneAndUpdate(
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
  const result = await BlogFeedbackModel.find({ _id: id })
    .populate({
      path: 'blog',
      select: 'title category', // Fields to select from the populated document
    })
    .populate({
      path: 'feedback_by',
      select: 'name email imgUrl role', // Fields to select from the populated document
    });
  return result;
};

export const BlogsFeedbackServices = {
  create,
  getAll,
  updateOneById,
  deleteOneById,
  getOneById,
};
