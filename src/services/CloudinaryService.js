import cloudinary from "../configs/CloudinaryConfig.js";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config({ path: ".env.development" });

// upload
const uploadFile = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// delete
const getPublicIdAndResourceTypeFromUrl = (url) => {
  const parts = url.split("/");
  const filenameWithExt = parts[parts.length - 1]; // vd: abc.mp3
  const folder = parts[parts.length - 2]; // vd: kidstudy
  const [filename, ext] = filenameWithExt.split("."); // tách abc, mp3

  const publicId = `${folder}/${filename}`;

  // Xác định loại tài nguyên
  let resourceType = "image"; // mặc định là image
  const videoTypes = ["mp4", "mov", "avi", "mp3", "mkv", "webm"];
  const rawTypes = ["pdf", "doc", "docx", "xls", "xlsx", "zip", "rar"];

  if (videoTypes.includes(ext.toLowerCase())) {
    resourceType = "video";
  } else if (rawTypes.includes(ext.toLowerCase())) {
    resourceType = "raw";
  }

  return { publicId, resourceType };
};

const deleteFile = async (fileUrl) => {
  try {
    const { publicId, resourceType } =
      getPublicIdAndResourceTypeFromUrl(fileUrl);
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    return result;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

export { uploadFile, deleteFile };
