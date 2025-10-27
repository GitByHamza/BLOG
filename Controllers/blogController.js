// const Blog = require('../Models/Blog');

// // @desc    Get all blogs with filtering and pagination
// // @route   GET /api/blogs
// // @access  Public (with admin capabilities)
// exports.getBlogs = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
    
//     // Build query
//     let query = {}; // Start with an empty query

//     // --- NEW LOGIC ---
//     // If 'status=all' is NOT provided, default to 'published' for public site
//     if (req.query.status !== 'all') {
//       query.status = 'published';
//     }
//     // Now the admin panel can pass 'status=all' to see drafts

//     // Filter by category
//     if (req.query.category) {
//       query.category = req.query.category;
//     }
    
//     // Filter by tag
//     if (req.query.tag) {
//       query.tags = { $in: [req.query.tag] };
//     }
    
//     // Search
//     if (req.query.search) {
//       query.$text = { $search: req.query.search };
//     }
    
//     // Featured blogs
//     if (req.query.featured) {
//       query.featured = req.query.featured === 'true';
//     }

//     // Prepare the query, but don't execute it yet
//     const blogsQuery = Blog.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     // --- NEW LOGIC ---
//     // If 'content=true' is NOT provided, select('-content') for public site
//     // This ensures your edit button will work in the admin panel
//     if (req.query.content !== 'true') {
//       blogsQuery.select('-content');
//     }

//     // Now execute the final query
//     const blogs = await blogsQuery;
    
//     const total = await Blog.countDocuments(query);
    
//     res.status(200).json({
//       success: true,
//       count: blogs.length,
//       total,
//       page,
//       pages: Math.ceil(total / limit),
//       data: blogs
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// };

// // @desc    Get single blog by slug
// // @route   GET /api/blogs/:slug
// // @access  Public
// exports.getBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findOne({ slug: req.params.slug });
    
//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }
    
//     // Increment views
//     blog.views += 1;
//     await blog.save();
    
//     res.status(200).json({
//       success: true,
//       data: blog
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// };

// // @desc    Create new blog
// // @route   POST /api/blogs
// // @access  Private
// exports.createBlog = async (req, res) => {
//   try {
//     const blog = await Blog.create(req.body);
    
//     res.status(201).json({
//       success: true,
//       message: 'Blog created successfully',
//       data: blog
//     });
//   } catch (error) {
//     console.error('--- CREATE BLOG FAILED ---', error);
//     res.status(400).json({
//       success: false,
//       message: 'Error creating blog',
//       error: error.message
//     });
//   }
// };

// // @desc    Update blog
// // @route   PUT /api/blogs/:id
// // @access  Private
// exports.updateBlog = async (req, res) => {
//   try {
//     let blog = await Blog.findById(req.params.id);
    
//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }
    
//     blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });
    
//     res.status(200).json({
//       success: true,
//       message: 'Blog updated successfully',
//       data: blog
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error updating blog',
//       error: error.message
//     });
//   }
// };

// // @desc    Delete blog
// // @route   DELETE /api/blogs/:id
// // @access  Private
// exports.deleteBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
    
//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }
    
//     await Blog.findByIdAndDelete(req.params.id);
    
//     res.status(200).json({
//       success: true,
//       message: 'Blog deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// };

// // @desc    Get blogs by category
// // @route   GET /api/blogs/category/:category
// // @access  Public
// exports.getBlogsByCategory = async (req, res) => {
//   try {
//     const blogs = await Blog.find({ 
//       category: req.params.category,
//       status: 'published'
//     }).sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       count: blogs.length,
//       data: blogs
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// };

// // @desc    Like a blog
// // @route   PUT /api/blogs/:id/like
// // @access  Private
// exports.likeBlog = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
    
//     if (!blog) {
//       return res.status(404).json({
//         success: false,
//         message: 'Blog not found'
//       });
//     }
    
//     blog.likes += 1;
//     await blog.save();
    
//     res.status(200).json({
//       success: true,
//       message: 'Blog liked successfully',
//       likes: blog.likes
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// };

const Blog = require('../Models/Blog'); // Assuming your model file is correctly imported

// @desc    Get all blogs with filtering and pagination
// @route   GET /api/blogs
// @access  Public (with admin capabilities)
exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    // Use a high default limit for admin fetch, lower for public
    const defaultLimit = req.query.status === 'all' ? 1000 : 10; 
    const limit = parseInt(req.query.limit) || defaultLimit; 
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {}; // Start with an empty query

    // If 'status=all' is NOT provided, default to 'published' for public site
    if (req.query.status !== 'all') {
      query.status = 'published';
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by tag
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }
    
    // Search - NOTE: This now only searches the 'title' field based on the default index.
    // If you need to search paragraph text, add `blogSchema.index({ 'content.text': 'text' });` to your schema.
    if (req.query.search) {
      query.$text = { $search: req.query.search }; 
    }
    
    // Featured blogs
    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }

    // Prepare the query
    const blogsQuery = Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // If 'content=true' is NOT provided (for public lists), omit the content field
    // This works correctly even though 'content' is now an array.
    if (req.query.content !== 'true') {
      blogsQuery.select('-content');
    }

    // Execute the final query
    const blogs = await blogsQuery;
    
    // Get total count matching the query (for pagination)
    const total = await Blog.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: blogs // Contains array of blogs (with or without 'content' field)
    });
  } catch (error) {
     console.error('--- GET BLOGS FAILED ---', error); // Added console log
    res.status(500).json({
      success: false,
      message: 'Server Error retrieving blogs',
      error: error.message
    });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
exports.getBlog = async (req, res) => {
  try {
    // Fetches the full blog document, including the new 'content' array structure
    const blog = await Blog.findOne({ slug: req.params.slug });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment views (no change needed)
    // Avoid incrementing views on every save, only when fetched via this route
    blog.views = (blog.views || 0) + 1;
    await blog.save({ validateBeforeSave: false }); // Skip validation just for view count save
    
    res.status(200).json({
      success: true,
      data: blog // Sends the full blog object with the 'content' array
    });
  } catch (error) {
     console.error('--- GET SINGLE BLOG FAILED ---', error); // Added console log
    res.status(500).json({
      success: false,
      message: 'Server Error retrieving blog',
      error: error.message
    });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res) => {
  try {
    // Assumes req.body is sent from the frontend with the CORRECT structure,
    // including the 'content' array matching paragraphSchema.
    // Mongoose validation will handle checking the structure based on the schema.
    
    // IMPORTANT: Ensure authorId is being set correctly, either from auth middleware
    // or passed securely in req.body. Remove hardcoded IDs in production.
    // Example: req.body.authorId = req.user.id; // If using auth middleware like Passport.js
    
    const blog = await Blog.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog // Returns the newly created blog with its content array
    });
  } catch (error) {
    console.error('--- CREATE BLOG FAILED ---', error);
    // Mongoose validation errors will be caught here
    res.status(400).json({
      success: false,
      // Provide a more specific message if it's a validation error
      message: error.name === 'ValidationError' ? 'Validation Error' : 'Error creating blog', 
      error: error.message,
      // Optionally send detailed validation errors (useful for frontend)
      errors: error.errors 
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    let blog = await Blog.findById(blogId);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Add authorization check here if needed (e.g., ensure req.user.id matches blog.authorId)

    // Assumes req.body contains the updated fields, including the potentially
    // modified 'content' array. Mongoose validation runs due to runValidators: true.
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, {
      new: true, // Return the modified document
      runValidators: true // Ensure the update respects schema rules
    });
    
    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog // Returns the updated blog with its content array
    });
  } catch (error) {
     console.error('--- UPDATE BLOG FAILED ---', error); // Added console log
    res.status(400).json({
      success: false,
      message: error.name === 'ValidationError' ? 'Validation Error' : 'Error updating blog',
      error: error.message,
      errors: error.errors
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Add authorization check here if needed

    await Blog.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: {} // Often good practice to return empty object on successful delete
    });
  } catch (error) {
     console.error('--- DELETE BLOG FAILED ---', error); // Added console log
    res.status(500).json({
      success: false,
      message: 'Server Error deleting blog',
      error: error.message
    });
  }
};

// @desc    Get blogs by category
// @route   GET /api/blogs/category/:category
// @access  Public
exports.getBlogsByCategory = async (req, res) => {
  try {
    // Added .select('-content') for optimization, as public category lists likely don't need full content
    const blogs = await Blog.find({ 
      category: req.params.category,
      status: 'published' // Only published for public category view
    })
    .sort({ createdAt: -1 })
    .select('-content'); // Omit heavy content field for list view
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs // Returns array of blogs without 'content'
    });
  } catch (error) {
     console.error('--- GET BLOGS BY CATEGORY FAILED ---', error); // Added console log
    res.status(500).json({
      success: false,
      message: 'Server Error retrieving blogs by category',
      error: error.message
    });
  }
};

// @desc    Like a blog
// @route   PUT /api/blogs/:id/like
// @access  Private (Should ideally require authentication)
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Simple increment, no change needed for schema update
    blog.likes = (blog.likes || 0) + 1;
    await blog.save({ validateBeforeSave: false }); // Skip validation just for like count save
    
    res.status(200).json({
      success: true,
      message: 'Blog liked successfully',
      likes: blog.likes // Return the new like count
    });
  } catch (error) {
     console.error('--- LIKE BLOG FAILED ---', error); // Added console log
    res.status(500).json({
      success: false,
      message: 'Server Error liking blog',
      error: error.message
    });
  }
};