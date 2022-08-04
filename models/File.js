const mongoose = require("mongoose");

// Schemas
const SharedFileUserSchema = require("./SharedFileUserSchema");

const FileSchema = new mongoose.Schema({
  // File Name
  name: {
    type: String,
    required: [true, "file name required"],
  },
  type: {
    type: String,
    required9: [true, "file type required"],
  },
  storedName: {
    type: String,
    required: [true, "File Stored Name is required"],
    unique: true,
    minLength: [10, "File Stored Name must be at least 10 characters long"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, "user id required"],
    ref: "User",
  },
  shared: {
    type: [SharedFileUserSchema],
    default: [],
  },
});

module.exports = mongoose.model("File", FileSchema);
