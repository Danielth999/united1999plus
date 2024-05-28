import { PrismaClient } from "@prisma/client";
import nextConnect from "next-connect";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();

const upload = multer({ dest: "./public/uploads" }); // กำหนดโฟลเดอร์สำหรับเก็บไฟล์

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' not allowed` });
  },
});

apiRoute.use(upload.single("image"));

apiRoute.post(async (req, res) => {
  const { name, description, price, stock, subcategoryId } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }

  const imageUrl = path.join("/uploads", image.filename);

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        subcategoryId: parseInt(subcategoryId), // เชื่อมโยงกับ subcategory
      },
    });

    res.status(201).json({ newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false, // ปิดการใช้งาน bodyParser เพื่อให้ multer จัดการ multipart data
  },
};

export default apiRoute;
