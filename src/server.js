import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    title: "Laptop",
    price: 1200,
    category: "electronics",
  },
  {
    id: 2,
    title: "Keyboard",
    price: 80,
    category: "accessories",
  },
  {
    id: 3,
    title: "Mouse",
    price: 45,
    category: "accessories",
  },
];

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Express API is running on Vercel",
    routes: [
      "GET /api/products",
      "GET /api/products/:id",
    ],
  });
});

app.get("/api/products", (req, res) => {
  res.status(200).json({
    success: true,
    data: products,
  });
});

app.get("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);

  const product = products.find(
    (item) => item.id === productId
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
});

app.post("/api/products", (req, res) => {
  const { title, price, category } = req.body;

  if (!title || price === undefined) {
    return res.status(400).json({
      success: false,
      message: "title and price are required",
    });
  }

  const newProduct = {
    id: products.length + 1,
    title,
    price: Number(price),
    category: category || "general",
  };

  products.push(newProduct);

  return res.status(201).json({
    success: true,
    data: newProduct,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/*
در Vercel از app.listen استفاده نمی‌کنیم.
خود Vercel برنامه Express را اجرا می‌کند.
*/
export default app;