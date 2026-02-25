/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';
import { FeedbackModel } from './feedback.model';
import { IFeedback } from './feedback.interface';
const SearchableFields = ['feedback'];

const create = async (payload: IFeedback) => {
  const result = await FeedbackModel.create(payload);
  return result;
};

const getAll = async (query: Record<string, unknown>) => {
  const baseQuery = new QueryBuilder(FeedbackModel.find(), query)
    .search(SearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await baseQuery.modelQuery.sort({ _id: -1 });
  const meta = await baseQuery.countTotal();

  return { meta, result };
};

const getOneById = async (id: string) => {
  const result = await FeedbackModel.findById(id);
  return result;
};

const updateOneById = async (id: string, payload: Partial<IFeedback>) => {
  const result = await FeedbackModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};
const deleteOneById = async (id: string) => {
  const result = await FeedbackModel.findByIdAndDelete(id);
  return result;
};

export const FeedbackServices = {
  create,
  getAll,
  updateOneById,
  deleteOneById,
  getOneById,
};
