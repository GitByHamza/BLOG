const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  likeBlog
} = require('../Controllers/blogController');

// No upload middleware needed - we're using direct image URLs

// Public routes
router.get('/', getBlogs);
router.get('/category/:category', getBlogsByCategory);
router.get('/:slug', getBlog);

// Protected routes (add auth middleware later)
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.put('/:id/like', likeBlog);

module.exports = router;