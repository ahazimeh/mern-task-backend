const mongoose = require("mongoose");

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
    },
    {
      description: {
        type: String,
        required: false,
      },
    },
    {
      price: {
        type: Number,
        required: false,
      },
    },
    {
      image: {
        type: String,
        required: false,
      },
    },
  ],
});

menuSchema.methods.addToCart = function (product: any) {
  console.log("z");

  console.log(this.items);

  console.log("1");

  console.log(product);

  const items = [...this.items];
  items.push({
    name: product.name,
  });
  this.items = items;
  this.save();
  // const cartProductIndex = this.cart.items.findIndex(cp => {
  //   return cp.productId.toString() === product._id.toString();
  // });
  // let newQuantity = 1;
  // const updatedCartItems = [...this.cart.items];
  // if (cartProductIndex >= 0) {
  //   newQuantity = this.cart.items[cartProductIndex].quantity + 1;
  //   updatedCartItems[cartProductIndex].quantity = newQuantity;
  // } else {
  //   updatedCartItems.push({
  //     productId: product._id,
  //     quantity: newQuantity
  //   });
  // }
  // const updatedCart = {
  //   items: updatedCartItems
  // };
  // this.cart = updatedCart;
  // return this.save();
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
