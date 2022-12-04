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
  const menu = await categories.find().sort([["order", "asc"]]);
  return res.send({ menu });
};

export const getSingleCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const menu = await categories.findById(categoryId);
  //   console.log(menu?.items);
  if (menu?.items) {
    menu.items.sort((a, b) => (a.order > b.order ? 1 : -1));
  }
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

  const menu = await categories.findOne().sort("order");
  console.log(menu?.order);
  let order = 1;
  if (menu?.order) {
    order = menu?.order + 1;
  }
  console.log(order);
  category = await new categories({
    order: order,
    name: req.body.name,
    image: req?.file?.filename,
  });
  return validation(category.save(), res);
};

export const orderCategories = async (req: Request, res: Response) => {
  console.log("a");
  const { cat1, cat2 } = req.params;

  const category1 = await categories.findById(cat1);
  const category2 = await categories.findById(cat2);
  console.log(category1?.order, category2?.order);
  // category1.order = 2;
  // category2.order = 1;
  await categories.updateOne({ _id: cat1 }, { order: category2?.order });
  await categories.updateOne({ _id: cat2 }, { order: category1?.order });
  return res.json({});
};

export const orderItems = async (req: Request, res: Response) => {
  const { categoryId, item1Id, item2Id } = req.params;
  categories.findById(categoryId).then((_res: any) => {
    const result = _res?.reorderItems(item1Id, item2Id);
    console.log(result);
  });
  return res.json({});
};
