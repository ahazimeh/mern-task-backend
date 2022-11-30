const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menuSchema = new Schema({
  name: {
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
export default mongoose.model("menu", menuSchema);
// export default categoriesSchema;
