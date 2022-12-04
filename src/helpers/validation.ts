import { Response } from "express";
import { Document } from "mongoose";

const validation = async (result: Promise<Document>, res: Response) => {
  try {
    await result;
    return res.json({ success: true });
  } catch (error) {
    let errors: any = {};
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });
    return res.status(400).send({
      success: false,
      errors,
    });
  }
};
export default validation;
