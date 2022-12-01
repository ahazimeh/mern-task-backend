import { Response } from "express";

const validation = async (result: Promise<void>, res: Response) => {
  try {
    await result;
    return res.send({ success: true });
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
