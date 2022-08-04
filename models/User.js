const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "user first name is required"],
      minlength: [3, "user first name must be at least 3 characters long"],
      maxlength: [20, "user first name must be at most 20 characters long"],
    },
    lastname: {
      type: String,
      required: [true, "user last name is required"],
      minlength: [3, "user last name must be at least 3 characters long"],
      maxlength: [20, "user last name must be at most 20 characters long"],
    },

    username: {
      type: String,
      required: [true, "username is required"],
      minlength: [5, "username must be at least 5 characters long"],
      maxlength: [20, "username must be maximum 20 characters long"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        "Please enter a valid email address",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [4, "password must be at least 4 characters long"],
      maxlength: [25, "password cannot be more than 25 characters"],
      unique: true,
    },

    friends: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSaltSync(10);

  this.password = await bcrypt.hashSync(this.password, salt);
});

UserSchema.methods.isPasswordValid = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  const { password, _id: id, ...user } = this.toObject();

  const token = jwt.sign({ id, ...user }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_TOKEN_EXPIRATION_PERIOD,
  });

  return token;
};

UserSchema.methods.getFullName = function () {
  const { firstname, lastname } = this;

  const fullName = `${firstname} ${lastname}`;

  return fullName;
};

module.exports = mongoose.model("User", UserSchema);
