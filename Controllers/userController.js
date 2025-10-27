const User = require('../Models/User');
const Blog = require('../Models/Blog');

// ✅ Get current logged-in user
exports.getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
};

// ✅ Like or Unlike a blog
exports.likeBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user._id;

    const isLiked = req.user.likes.includes(blogId);
    let user, blog;

    if (isLiked) {
      user = await User.findByIdAndUpdate(userId, { $pull: { likes: blogId } }, { new: true });
      blog = await Blog.findByIdAndUpdate(blogId, { $inc: { likes: -1 } }, { new: true });
    } else {
      user = await User.findByIdAndUpdate(userId, { $push: { likes: blogId } }, { new: true });
      blog = await Blog.findByIdAndUpdate(blogId, { $inc: { likes: 1 } }, { new: true });
    }

    res.status(200).json({
      status: 'success',
      data: {
        userLikes: user.likes,
        blogLikes: blog.likes,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ✅ Save or Unsave a blog
exports.saveBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user._id;
    const isSaved = req.user.savedBlogs.includes(blogId);

    const update = isSaved ? { $pull: { savedBlogs: blogId } } : { $push: { savedBlogs: blogId } };
    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    res.status(200).json({
      status: 'success',
      data: { savedBlogs: user.savedBlogs },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ✅ Admin - Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
