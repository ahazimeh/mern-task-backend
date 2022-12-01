import mongoose from "mongoose";

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

  this.save();
};
menuSchema.methods.removeFromCart = function (itemId: any) {
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
