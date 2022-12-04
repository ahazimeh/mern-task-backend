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
  order: {
    type: Number,
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
      order: {
        type: Number,
        required: true,
      },
    },
  ],
});

menuSchema.methods.updateItem = async function (itemId: any, product: any) {
  const items = [...this.items];
  let i;
  for (i = 0; i < items.length; i++) {
    // @ts-ignore
    if (items[i]._id.toString() === itemId) {
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

  this.items = items;
  return this.save();
};

menuSchema.methods.addItem = function (product: any) {
  const items = [...this.items];
  let order = 1;
  if (items.length) {
    for (let i = 0; i < items.length; i++)
      if (items[i].order >= order) order = items[i].order + 1;
  }
  items.push({
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    order,
  });
  this.items = items;
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

menuSchema.methods.reorderItems = async function (item1Id: any, item2Id: any) {
  const items = [...this.items];
  items.sort((a, b) => (a.order > b.order ? 1 : -1));
  let index1 = 0,
    index2 = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i]._id == item1Id) index1 = i;
    if (items[i]._id == item2Id) index2 = i;
  }
  if (index1 < index2) {
    items[index1].order = items[index2].order;
    for (let k = index1 + 1; k <= index2; k++) {
      items[k].order -= 1;
    }
  } else {
    items[index1].order = items[index2].order;
    for (let k = index1 - 1; k >= index2; k--) {
      items[k].order += 1;
    }
  }
  this.items = items;
  return this.save();
};

export default mongoose.model("menu", menuSchema);
