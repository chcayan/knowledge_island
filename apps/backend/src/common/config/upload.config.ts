import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), 'temp'),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + ext)
  },
})

export const uploadOptions = {
  storage,
}
