const mongoose = require("mongoose");

const SharedFileUserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: [true, "user id required"],
    ref: "User",
  },
  access: {
    type: String,
    default: "read",
    enum: ["read", "write", "creator", "fullaccess"],
  },
});

module.exports = SharedFileUserSchema;
