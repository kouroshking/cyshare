const fileUpload = require("express-fileupload");

const fileExtLimiter = require("./fileExtLimiter");
const fileSizeLimiter = require("./fileSizeLimiter");
const filesPayloadExists = require("./filesPayloadExists");

const fileUploadMiddleware = (middleware) => {
  const usingMiddleware = [
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
  ];

  if (middleware.fileExtLimiter) {
    usingMiddleware.push(fileExtLimiter(middleware.fileExtLimiter));
  }

  if (middleware.fileSizeLimiter) {
    usingMiddleware.push(fileSizeLimiter);
  }

  return usingMiddleware;
};

module.exports = fileUploadMiddleware;
