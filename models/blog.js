const { Schema, model } = require("mongoose");
const { schema } = require("./user");

const blogSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true },
);

const Blog = model("blog", blogSchema);

module.exports = Blog;
