import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${ext}`;	
        cb(null, name);
    }
});

const upload = multer({ storage });

export default upload;