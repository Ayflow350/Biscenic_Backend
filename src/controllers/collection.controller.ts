import { Request, Response } from "express";
import * as collectionService from "../services/collection.service";
import { collectionSchema } from "../validation/collection.validation";

export const createCollectionHandler = async (req: Request, res: Response) => {
  try {
    const validatedData = collectionSchema.parse(req.body);
    const collection = await collectionService.createCollection(validatedData);
    res
      .status(201)
      .json({ message: "Collection created successfully", collection });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCollectionsHandler = async (req: Request, res: Response) => {
  try {
    const collections = await collectionService.getAllCollections();
    res.status(200).json(collections);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCollectionByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Collection ID is required" });
    }
    const collection = await collectionService.getCollectionById(id);
    if (!collection)
      return res.status(404).json({ message: "Collection not found" });
    res.status(200).json(collection);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollectionHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = collectionSchema.partial().parse(req.body);
    if (!id) {
      return res.status(400).json({ message: "Collection ID is required" });
    }
    const updated = await collectionService.updateCollection(id, validatedData);
    if (!updated)
      return res.status(404).json({ message: "Collection not found" });
    res
      .status(200)
      .json({ message: "Collection updated successfully", updated });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCollectionHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Collection ID is required" });
    }
    const deleted = await collectionService.deleteCollection(id);
    if (!deleted)
      return res.status(404).json({ message: "Collection not found" });
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
