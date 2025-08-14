import multer from "multer";
import fs from "fs";
import path from "path";

const dir = process.env.UPLOAD_DIR || "./uploads";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const name = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  }
});

export const upload = multer({ storage });
export function publicUrl(filename){ return `/uploads/${filename}`; }
