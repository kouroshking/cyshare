const path = require("path");
const { v4 } = require("uuid");
const fs = require("fs");

// models
const FileModel = require("../models/File");
const UserModel = require("../models/User");

const filesUpload = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }

  const { id } = req.user;

  const files = req.files;

  const savingFiles = [];

  Object.keys(files).forEach((key) => {
    const fileId = v4();
    const storeFileName = fileId + path.extname(files[key].name);
    const filePath = path.join(process.env.FILES_PATH, storeFileName);
    const fileType = path.extname(files[key].name);

    files[key].mv(filePath, (error) => {
      if (error)
        return res.status(500).json({ status: "error", message: error });
    });

    savingFiles.push({
      name: files[key].name,
      storedName: storeFileName,
      type: fileType,
      user: id,
    });
  });

  for (let fileProps of savingFiles) {
    try {
      const file = await FileModel.create(fileProps);

      if (!file) {
        return res.status(500).json({
          success: false,
          message: "failed to create file in database",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error,
      });
    }
  }

  res.status(200).json({
    status: "success",
    message:
      "successfully uploaded images: " +
      Object.keys(files).toString().replaceAll(",", ", "),
  });
};

const getFile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "unauthorized",
      });
    }

    const { id } = req.user;

    const fileName = req.params.fileId;
    const file = await FileModel.findOne({ storedName: fileName, user: id });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "file not found",
      });
    }

    const filePath = path.join(process.env.FILES_PATH, file.storedName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "file not found",
      });
    }
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const fileName = req.params.fileId;

    const deletingFile = await FileModel.findOne({ storedName: fileName });

    if (!deletingFile) {
      return res.status(404).json({
        success: false,
        message: "file not found",
      });
    }

    const filePath = path.join(process.env.FILES_PATH, deletingFile.storedName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "file not found",
      });
    }

    fs.unlinkSync(filePath, (err) => {
      return res.status(500).json({
        success: false,
        message: "failed to delete file",
      });
    });

    const file = await FileModel.deleteOne({ storedName: fileName });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "file not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "file deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

const getSharedFile = async (req, res) => {
  const fileName = req.params.fileId;

  if (!fileName) {
    return res.status(400).json({
      scuccess: false,
      message: "file name is required",
    });
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }

  const { id: userId } = req.user;

  try {
    const file = await FileModel.findOne({ storedName: fileName });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "file not found",
      });
    }

    const isShared = file.shared.find(
      (user) => user._id.toString() === userId.toString()
    );

    if (!isShared) {
      return res.status(200).json({
        success: true,
        message: "you are not allowed to see this file",
      });
    }

    const filePath = path.join(process.env.FILES_PATH, file.storedName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "file not found",
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

const shareFile = async (req, res) => {
  const fileName = req.params.fileId;

  if (!fileName) {
    return res.status(400).json({
      success: false,
      message: "file name is required",
    });
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }

  const { id: userId } = req.user;
  if (!req.body.shareWith) {
    return res.status(400).json({
      success: false,
      message: "no one selected to share file with",
    });
  }

  const allowedUserAccess = ["read", "write", "creator", "fullaccess"];

  const userAccess =
    !req.body.access || !allowedUserAccess.includes(req.body.access)
      ? "read"
      : req.body.access;

  const shareWithUserId = req.body.shareWith;

  try {
    // searching if user exists
    const sharingWithUser = await UserModel.findOne({ _id: shareWithUserId });

    if (!sharingWithUser) {
      return res.status(404).json({
        success: false,
        message: "selected user to share file not found",
      });
    }

    // updating the file
    const file = await FileModel.updateOne(
      {
        storedName: fileName,
        user: userId,
      },
      {
        $push: {
          shared: {
            _id: shareWithUserId,
            access: userAccess,
          },
        },
      }
    );

    console.log(file);

    if (!file || !file.matchedCount) {
      return res.status(404).json({
        success: false,
        message: "file not found",
      });
    }

    if (!file.modifiedCount) {
      return res.status(500).json({
        success: false,
        message: "failed to share file",
      });
    }

    return res.status(200).json({
      success: true,
      message: "file shared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

module.exports = { filesUpload, getFile, deleteFile, getSharedFile, shareFile };
