import { Request, Response } from "express";
import categories from "../models/categories";
import fs from "fs/promises";
import validation from "../helpers/validation";

export const updateCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const name = req.body.name;
  const image = req.file?.filename;

  categories
    .findById(categoryId)
    .then(async (_res: any) => {
      if (image) {
        try {
          await fs.unlink(`public/images/${_res.image}`);
        } catch (err) {}
      }
      _res.image = image ?? _res.image;

      _res.name = name ?? _res.name;
      _res.save();
      res.send({ success: true });
    })
    .catch(() => {
      res.json({ success: false });
    });
};

export const getAllCategories = async (_: Request, res: Response) => {
  const menu = await categories.find();
  return res.send({ menu });
};

export const getSingleCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const menu = await categories.findById(categoryId);
  return res.send({ menu });
};

export const removeCategory = (req: Request, res: Response) => {
  const { categoryId } = req.params;
  categories.remove({ _id: categoryId }).exec();
  res.send("");
};

export const removeItem = (req: Request, res: Response) => {
  const { categoryId, itemId } = req.params;
  categories.findById(categoryId).then((_res: any) => {
    _res.removeItem(itemId);
    res.send("");
  });
};

export const addItem = (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { itemName, itemDescription, itemPrice } = req.body;
  const image = req.file?.filename;

  categories.findById(categoryId).then((_res: any) => {
    const result = _res.addItem({
      name: itemName,
      description: itemDescription,
      price: !isNaN(+itemPrice) && +itemPrice,
      image,
    });
    return validation(result, res);
  });
};

export const updateItem = async (req: Request, res: Response) => {
  const { categoryId, itemId } = req.params;
  const { itemName, itemDescription, itemPrice } = req.body;
  const image = req.file?.filename;
  categories.findById(categoryId).then((_res: any) => {
    const result = _res?.updateItem(itemId, {
      name: itemName,
      description: itemDescription,
      price: !isNaN(+itemPrice) && +itemPrice,
      image,
    });
    return validation(result, res);
  });
};

export const addCategory = async (req: Request, res: Response) => {
  let category;
  category = await new categories({
    name: req.body.name,
    image: req?.file?.filename,
  });
  return validation(category.save(), res);
};
