import { Response } from "express";

const validation = (result: Promise<void>, res: Response) => {
  return result
    .then(() => {
      res.send({ success: true });
    })
    .catch((error: any) => {
      console.log("_res", error);
      let errors: any = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).send({
        success: false,
        errors,
      });
    });
};
export default validation;
