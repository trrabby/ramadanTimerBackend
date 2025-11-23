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
    const isFeedbackExistOnSameBlogByUser = await BlogFeedbackModel.findOne(
      {
        blog: payload.blog,
        feedback_by: payload.feedback_by,
        isDeleted: { $ne: true },
      },
      null,
      { session },
    );

    let result;

    if (isFeedbackExistOnSameBlogByUser && payload.feedback?.[0]?.text) {
      // Add to existing feedback array
      const newFeedback = {
        text: payload.feedback?.[0]?.text,
        createdAt: new Date(),
      };

      result = await BlogFeedbackModel.findByIdAndUpdate(
        isFeedbackExistOnSameBlogByUser._id,
        {
          $push: { feedback: newFeedback },
        },
        {
          new: true,
          session,
        },
      );
    } else if (isFeedbackExistOnSameBlogByUser && payload.vote) {
      // Add to existing feedback array
      result = await BlogFeedbackModel.findByIdAndUpdate(
        isFeedbackExistOnSameBlogByUser._id,
        {
          $set: {
            ...(payload.vote && { vote: payload.vote }),
            updatedAt: new Date(),
          },
        },
        {
          new: true,
          session,
        },
      );
    } else {
      // Create new document
      result = await BlogFeedbackModel.create(
        [
          {
            blog: payload.blog,
            feedback_by: payload.feedback_by,
            feedback: payload.feedback?.map((fb) => ({
              text: fb.text,
              createdAt: new Date(),
            })),
            vote: payload.vote,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { session },
      );

      // Link to blog only for new documents
      await BlogsServices.updateOneById(
        payload.blog as any,
        {
          $push: { feedbacks: result[0]._id },
        } as any,
        { session },
      );
    }

    await session.commitTransaction();
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
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
