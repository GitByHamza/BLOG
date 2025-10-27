// const mongoose = require('mongoose');
// const slugify = require('slugify');

// const blogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Blog title is required'],
//     trim: true,
//     maxlength: [200, 'Title cannot be more than 200 characters']
//   },
//   slug: {
//     type: String,
//     unique: true
//   },
//   content: {
//     type: String,
//     required: [true, 'Blog content is required'],
//     minlength: [100, 'Content should be at least 100 characters']
//   },
//   excerpt: {
//     type: String,
//     maxlength: [300, 'Excerpt cannot be more than 300 characters']
//   },
//   category: {
//     type: String,
//     required: [true, 'Category is required'],
//     enum: [
//       'Islam',
//       'Religion',
//       'Technology',
//       'Travel',
//       'Food',
//       'Lifestyle',
//       'Health',
//       'Business',
//       'Entertainment',
//       'Education',
//       'Sports',
//       'Other'
//     ]
//   },
//   tags: [{
//     type: String,
//     trim: true
//   }],
//   // 5 image fields as requested
//   mainImage: {
//     type: String,
//     required: [true, 'Main image is required']
//   },
//   image1: {
//     type: String
//   },
//   image2: {
//     type: String
//   },
//   image3: {
//     type: String
//   },
//   image4: {
//     type: String
//   },
//   author: {
//     type: String,
//     required: [true, 'Author name is required'],
//     trim: true
//   },
//   authorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['draft', 'published'],
//     default: 'draft'
//   },
//   featured: {
//     type: Boolean,
//     default: false
//   },
//   readTime: {
//     type: Number,
//     min: 1
//   },
//   views: {
//     type: Number,
//     default: 0
//   },
//   likes: {
//     type: Number,
//     default: 0
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Create slug from title before saving
// blogSchema.pre('save', function(next) {
//   if (this.isModified('title')) {
//     this.slug = slugify(this.title, {
//       lower: true,
//       strict: true,
//       remove: /[*+~.()'"!:@]/g
//     });
//   }
  
//   // Calculate read time (approx 200 words per minute)
//   if (this.isModified('content')) {
//     const wordCount = this.content.split(/\s+/).length;
//     this.readTime = Math.ceil(wordCount / 200);
//   }
  
//   // Create excerpt from content
//   if (this.isModified('content') && !this.excerpt) {
//     this.excerpt = this.content.substring(0, 150) + '...';
//   }
  
//   next();
// });

// // Index for better performance
// blogSchema.index({ title: 'text', content: 'text' });
// blogSchema.index({ category: 1, status: 1 });
// blogSchema.index({ createdAt: -1 });

// module.exports = mongoose.model('Blog', blogSchema);

const mongoose = require('mongoose');
const slugify = require('slugify');

// Define the sub-schema for a single content paragraph
const paragraphSchema = new mongoose.Schema({
  header: {
    type: String,
    trim: true,
    maxlength: [200, 'Paragraph header cannot be more than 200 characters']
  },
  text: {
    type: String,
    required: [true, 'Paragraph text is required'],
    // You might adjust minlength based on typical paragraph size
    minlength: [20, 'Paragraph text should be at least 20 characters'] 
  },
  imageA: { // Optional: First image URL for this paragraph
    type: String,
    trim: true,
    default: '' // Default to empty string
  },
  imageB: { // Optional: Second image URL for this paragraph
    type: String,
    trim: true,
    default: '' // Default to empty string
  }
}, { _id: false }); // We don't need individual _id for each paragraph within the blog

// Main Blog Schema using the paragraph sub-schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  // --- CONTENT FIELD CHANGED ---
  content: {
    type: [paragraphSchema], // Now an array of paragraph objects
    required: true,
    // Ensure there's at least one paragraph
    validate: [v => Array.isArray(v) && v.length > 0, 'Blog must have at least one content paragraph']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
    // Note: Auto-generation might be less reliable now, consider making it manual
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Islam', 'Religion', 'Technology', 'Travel', 'Food', 'Lifestyle',
      'Health', 'Business', 'Entertainment', 'Education', 'Sports', 'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  mainImage: { // Keep the main featured image
    type: String,
    required: [true, 'Main image is required']
  },
  // --- image1, image2, image3, image4 ARE REMOVED ---
  // Images are now part of the 'content' array objects
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  readTime: { // Will be calculated automatically
    type: Number,
    min: 1
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- UPDATED PRE-SAVE HOOK ---
blogSchema.pre('save', function(next) {
  // Generate slug from title
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }
  
  // Calculate read time based on the new content structure
  if (this.isModified('content')) {
    let totalWordCount = 0;
    this.content.forEach(paragraph => {
      if (paragraph.text) {
        totalWordCount += paragraph.text.split(/\s+/).filter(Boolean).length;
      }
    });
    // Ensure readTime is at least 1 if there's content
    this.readTime = Math.max(1, Math.ceil(totalWordCount / 200)); 
  }
  
  // Auto-generate excerpt from the first paragraph's text (if excerpt is empty)
  // Consider making excerpt a manual field in your admin panel for better control
  if (this.isModified('content') && !this.excerpt && this.content.length > 0 && this.content[0].text) {
    this.excerpt = this.content[0].text.substring(0, 150) + (this.content[0].text.length > 150 ? '...' : '');
  }
  
  next();
});

// Index for better performance
blogSchema.index({ title: 'text' });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ createdAt: -1 });
// The slug index is automatically created by 'unique: true' above

module.exports = mongoose.model('Blog', blogSchema);