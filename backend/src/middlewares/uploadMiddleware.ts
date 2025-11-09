import multer from "multer";
import path from "path";
import fs from "fs";

// Store files temporarily before uploading to Cloudinary
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "public/uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const upload = multer({ storage });
