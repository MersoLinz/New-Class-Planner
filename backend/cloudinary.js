import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dggilfufz",
  api_key: "494338921468359",
  api_secret: "4oCA3Mq2CSaEo1j5xN-0SE_q90M",
});

export async function uploadImage(localPath, subjectSlug, pageSlug) {
  const result = await cloudinary.uploader.upload(localPath, {
    folder: `${subjectSlug}/${pageSlug}`,
  });

  fs.unlinkSync(localPath);

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}

export async function deleteImage(publicId) {
  await cloudinary.uploader.destroy(publicId);
}
