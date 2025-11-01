import Collection, { ICollection } from "../models/Collection";
import { CollectionInput } from "../types/collection.types";

export const createCollection = async (
  data: CollectionInput
): Promise<ICollection> => {
  const newCollection = new Collection(data);
  return await newCollection.save();
};

export const getAllCollections = async (): Promise<ICollection[]> => {
  return await Collection.find().sort({ createdAt: -1 });
};

export const getCollectionById = async (
  id: string
): Promise<ICollection | null> => {
  return await Collection.findById(id);
};

export const updateCollection = async (
  id: string,
  data: Partial<CollectionInput>
): Promise<ICollection | null> => {
  return await Collection.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCollection = async (
  id: string
): Promise<ICollection | null> => {
  return await Collection.findByIdAndDelete(id);
};
