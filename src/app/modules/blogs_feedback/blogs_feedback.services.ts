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

const getFeedbackForBlog = async (blogId: string) => {
  const result = await BlogFeedbackModel.aggregate([
    {
      $match: {
        blog: new mongoose.Types.ObjectId(blogId),
      },
    },

    { $unwind: '$feedback' },

    // REMOVE deleted feedback
    {
      $match: {
        'feedback.isDeleted': { $ne: true },
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'feedback_by',
        foreignField: '_id',
        as: 'feedback_by',
      },
    },
    { $unwind: '$feedback_by' },

    {
      $lookup: {
        from: 'blogs',
        localField: 'blog',
        foreignField: '_id',
        as: 'blog',
      },
    },
    { $unwind: '$blog' },

    {
      $group: {
        _id: '$blog._id',
        blog: { $first: '$blog' },
        feedbacks: {
          $push: {
            _id: '$feedback._id',
            text: '$feedback.text',
            createdAt: '$feedback.createdAt',
            updatedAt: '$feedback.updatedAt',
            isDeleted: '$feedback.isDeleted',
            feedback_by: {
              _id: '$feedback_by._id',
              name: '$feedback_by.name',
              email: '$feedback_by.email',
              imgUrl: '$feedback_by.imgUrl',
              role: '$feedback_by.role',
            },
          },
        },
      },
    },

    { $project: { _id: 0 } },
  ]);

  return result[0] || { blog: null, feedbacks: [] };
};

const updateVoteByFeedbackId = async (feedbackId: string, text: string) => {
  const result = await BlogFeedbackModel.findOneAndUpdate(
    {
      _id: feedbackId, // match specific feedback
    },
    {
      $set: {
        vote: text, // only update vote
        updatedAt: new Date(), // auto-update timestamp
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const updateOneById = async (feedbackId: string, text: string) => {
  const result = await BlogFeedbackModel.findOneAndUpdate(
    {
      'feedback._id': feedbackId, // match specific feedback item
    },
    {
      $set: {
        'feedback.$.text': text, // only update text
        'feedback.$.updatedAt': new Date(), // auto-update timestamp
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const deleteOneById = async (feedbackId: string) => {
  const result = await BlogFeedbackModel.findOneAndUpdate(
    {
      'feedback._id': feedbackId, // find the specific feedback element
    },
    {
      $set: {
        'feedback.$.isDeleted': true, // mark only this feedback deleted
        'feedback.$.updatedAt': new Date(), // optional: update timestamp
      },
    },
    {
      new: true,
      runValidators: true,
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

const getOneByFeedbackId = async (feedbackId: string) => {
  const result = await BlogFeedbackModel.aggregate([
    {
      $match: {
        'feedback._id': new mongoose.Types.ObjectId(feedbackId),
      },
    },

    { $unwind: '$feedback' },

    {
      $match: {
        'feedback._id': new mongoose.Types.ObjectId(feedbackId),
      },
    },

    // Populate feedback_by
    {
      $lookup: {
        from: 'users',
        localField: 'feedback_by',
        foreignField: '_id',
        as: 'feedback_by',
      },
    },
    { $unwind: '$feedback_by' },

    // Populate blog
    {
      $lookup: {
        from: 'blogs',
        localField: 'blog',
        foreignField: '_id',
        as: 'blog',
      },
    },
    { $unwind: '$blog' },

    {
      $project: {
        _id: 0,
        blog: {
          _id: '$blog._id',
          title: '$blog.title',
          category: '$blog.category',
        },
        feedback: '$feedback',
        feedback_by: {
          _id: '$feedback_by._id',
          name: '$feedback_by.name',
          email: '$feedback_by.email',
          imgUrl: '$feedback_by.imgUrl',
          role: '$feedback_by.role',
        },
      },
    },
  ]);

  return result[0] || null;
};

export const BlogsFeedbackServices = {
  create,
  getAll,
  getFeedbackForBlog,
  updateVoteByFeedbackId,
  updateOneById,
  deleteOneById,
  getOneByFeedbackId,
  getOneById,
};
