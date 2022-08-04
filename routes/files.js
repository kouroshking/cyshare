const express = require("express");
// middleware
const fileUploadMiddleware = require("../middleware/fileUpload");
const { authMiddleware } = require("../middleware/auth");
// controllers
const {
  filesUpload,
  getFile,
  deleteFile,
  getSharedFile,
  shareFile,
} = require("../controllers/files");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/upload",
  // authMiddleware,
  fileUploadMiddleware({
    // fileExtLimiter: ["jpg", "jpeg", "png", "gif"],
    fileSizeLimiter: true,
  }),
  filesUpload
);

router.route("/file/:fileId").get(getFile).delete(deleteFile);

router.route("/file/shared/:fileId").get(getSharedFile);

router.route("/file/share/:fileId").patch(shareFile);

module.exports = router;
