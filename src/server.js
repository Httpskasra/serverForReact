import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "React course API is running",
  });
});

app.get("/api/products", (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      {
        id: 1,
        title: "Laptop",
        price: 1200,
      },
      {
        id: 2,
        title: "Keyboard",
        price: 80,
      },
    ],
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});