import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function readProducts() {
  const fileUrl = new URL("../data/products.json", import.meta.url);
  const fileContent = await readFile(fileUrl, "utf-8");

  return JSON.parse(fileContent);
}

app.get("/", (req, res) => {
  res.json({
    message: "React Course API is running",
    documentation: {
      products: "/api/products",
      singleProduct: "/api/products/:id",
      categories: "/api/categories"
    }
  });
});

app.get("/api/products", async (req, res, next) => {
  try {
    let products = await readProducts();

    const {
      search,
      category,
      available,
      sort = "id",
      order = "asc",
      page = "1",
      limit = "10"
    } = req.query;

    if (search) {
      const normalizedSearch = search.trim().toLowerCase();

      products = products.filter((product) =>
        product.title.toLowerCase().includes(normalizedSearch)
      );
    }

    if (category) {
      products = products.filter(
        (product) =>
          product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (available === "true") {
      products = products.filter((product) => product.isAvailable);
    }

    if (available === "false") {
      products = products.filter((product) => !product.isAvailable);
    }

    const allowedSortFields = ["id", "title", "price", "stock"];

    if (allowedSortFields.includes(sort)) {
      products.sort((firstProduct, secondProduct) => {
        const firstValue = firstProduct[sort];
        const secondValue = secondProduct[sort];

        if (typeof firstValue === "string") {
          return firstValue.localeCompare(secondValue);
        }

        return firstValue - secondValue;
      });
    }

    if (order === "desc") {
      products.reverse();
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 50);

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const paginatedProducts = products.slice(
      startIndex,
      startIndex + pageSize
    );

    res.json({
      data: paginatedProducts,
      pagination: {
        currentPage: pageNumber,
        pageSize,
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const products = await readProducts();
    const productId = Number(req.params.id);

    const product = products.find((item) => item.id === productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      data: product
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/categories", async (req, res, next) => {
  try {
    const products = await readProducts();

    const categories = [...new Set(
      products.map((product) => product.category)
    )];

    res.json({
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    message: "Internal server error"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});