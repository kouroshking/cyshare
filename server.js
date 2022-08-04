require("dotenv").config();
const express = require("express");
const path = require("path");
// import database connection
const connectDB = require("./config/connectDB");
// importing middlewares

// importing routers
const filesRouter = require("./routes/files");
const authRouter = require("./routes/auth");

const app = express();

// applying middleware
app.use(express.static("./public"));
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      if (!req.is("application/json")) {
        throw new Error("Invalid request");
      }

      try {
        JSON.parse(buf.toString(encoding)); // try to parse the body buff
      } catch (err) {
        res.status(400).json({
          message: "Body is not a json object",
          success: false,
        });
      }
    },
  })
);

// applying routes
// -- files routes
app.use("/files", filesRouter);
// -- authentication routes
app.use("/auth", authRouter);

// starting the server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_CONNECTION_URL);

    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  } catch (error) {
    console.error("Failed to start the server: " + error);
  }
};
startServer();
