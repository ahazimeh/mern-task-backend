import mongoose from "mongoose";
import fs from "fs/promises";
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
      price: {
        type: Number,
        required: false,
      },
      image: {
        type: String,
        required: false,
      },
    },
  ],
});

menuSchema.methods.updateItem = async function (itemId: any, product: any) {
  // console.log(product);
  // console.log(itemId);
  const items = [...this.items];
  // console.log(items);
  let i;
  for (i = 0; i < items.length; i++) {
    // @ts-ignore
    if (items[i]._id.toString() === itemId) {
      console.log("zzzaaa");

      break;
    }
  }
  if (product.image) {
    try {
      await fs.unlink(`public/images/${items[i].image}`);
    } catch (err) {}
  }
  items[i].name = product.name ?? items[i].name;
  items[i].description = product.description ?? items[i].description;
  items[i].image = product.image ?? items[i].image;
  items[i].price = product.price ?? items[i].price;
  console.log(items[i]);

  this.items = items;
  return this.save();
};

menuSchema.methods.addItem = function (product: any) {
  const items = [...this.items];

  items.push({
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
  });
  this.items = items;
  // this.items.push(product);
  return this.save();
};
menuSchema.methods.removeItem = function (itemId: any) {
  const updatedCartItems = this.items.filter(
    (item: { _id: { toString: () => any } }) => {
      return item._id.toString() !== itemId.toString();
    }
  );
  this.items = updatedCartItems;
  return this.save();
};

export default mongoose.model("menu", menuSchema);
// export default categoriesSchema;
