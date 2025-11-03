import { upload } from "../middlewares/uploadMiddleware";

export const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);