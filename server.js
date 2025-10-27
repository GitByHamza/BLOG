// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const blogRoutes = require("./Routes/blogRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/blogs", blogRoutes);

// ✅ Home route
app.get("/", (req, res) => {
  res.json({
    message: "Blog API is running!",
    endpoints: {
      getBlogs: "GET /api/blogs",
      getBlog: "GET /api/blogs/:slug",
      createBlog: "POST /api/blogs",
      updateBlog: "PUT /api/blogs/:id",
      deleteBlog: "DELETE /api/blogs/:id",
    },
  });
});

// ✅ Mongoose configuration (remove deprecated options)
mongoose.set("strictQuery", true);

// ✅ Connect to MongoDB (Atlas or Local)
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blogdb";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
