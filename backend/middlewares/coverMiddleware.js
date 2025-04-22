import multer from "multer";
import sharp from "sharp"

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const coverMiddleware = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    try {
        console.log(req.file)
        const resizedCover = await sharp(req.file.buffer)
            .resize(380, 620)
            .toFormat("jpeg")
            .toBuffer();

        req.file.buffer = resizedCover
        req.file.mimetype = 'image/jpeg'
        next();
    } catch (err) {
        res.status(500).json({ error: "Cannot resize cover"});
    }
};
