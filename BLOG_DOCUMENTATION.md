# FOMA Blog System - Complete Documentation

## Overview

The FOMA Blog is a modern, professional, multi-language DevOps learning platform with the following features:

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Multi-Language Support**: English and French translations
- **Dynamic Filtering**: Category-based post filtering
- **Search Functionality**: Real-time blog post search
- **Professional UI**: Black background with cyan/teal accent color (#64ffda)
- **Modern Typography**: Google Fonts (Poppins + Open Sans)
- **Smooth Animations**: Hover effects and transitions throughout

---

## File Structure

```
/website/
├── blog.html                      # Main blog listing page
├── blog/
│   ├── post.html                  # Blog post template (Docker)
│   └── kubernetes.html            # Sample blog post (Kubernetes)
├── css/
│   ├── styles.css                 # Main website styles
│   ├── blog.css                   # Blog page styles
│   └── blog-post.css              # Single blog post styles
├── js/
│   ├── main.js                    # Header loading and main functionality
│   ├── translations.js            # Translations object and blog post data
│   └── blog.js                    # Blog-specific functionality
├── components/
│   └── header.html                # Reusable header component
├── images/
│   ├── logo.png                   # Site logo
│   ├── aboutfoma.png.png          # About page image
│   └── devops.jpg                 # Sample blog post image
```

---

## Key Features

### 1. Home Page (`index.html`)
- Hero section with call-to-action
- Feature highlights
- Footer with social links
- Navigation header

### 2. Blog Hub (`blog.html`)
**Components:**
- **Hero Section**: Title and search bar
- **Category Filters**: 8 categories (Docker, Kubernetes, Terraform, CI/CD, Cloud, Linux, DevSecOps, All)
- **Blog Grid**: Responsive card layout
- **Load More**: Pagination without page reload
- **Search**: Real-time filtering

**Features:**
- Posts per page: 6 (configurable in `blog.js`)
- Dynamic category filtering
- Real-time search across titles and descriptions
- Hover animations and visual feedback

### 3. Blog Post Page (`blog/post.html`)
**Sections:**
- Header with category, title, metadata
- Featured image
- Content sections (Introduction, Problem, Solution, Step-by-Step Guide, Best Practices, Conclusion)
- Code blocks with syntax highlighting support
- Call-to-action section
- Back to blog button

**Styling:**
- Professional typography
- Code block styling with cyan border
- Responsive layout for all devices

### 4. Multi-Language Support
**Supported Languages:**
- English (en)
- French (fr)

**Translation System:**
```javascript
// translations.js contains:
const translations = {
    en: { /* English text */ },
    fr: { /* French text */ }
};
```

**Usage:**
```html
<!-- In HTML -->
<h1 data-lang="blog_hero_title">Title here</h1>

<!-- In JavaScript -->
element.textContent = translations[currentLang]['blog_hero_title'];
```

**Language Switching:**
- Click EN/FR buttons in header
- Language preference saved in localStorage
- Persists across page reloads

---

## Blog Posts Data Structure

### Location: `js/translations.js`

```javascript
const blogPosts = [
    {
        id: 1,
        title: { en: "English Title", fr: "French Title" },
        description: { en: "...", fr: "..." },
        category: "docker",           // Must match filter categories
        date: "2026-04-01",          // Format: YYYY-MM-DD
        author: "FOMA",
        image: "images/devops.jpg",
        featured: true               // Featured on home page
    },
    // ... more posts
];
```

### Adding New Blog Posts

1. **Add to `translations.js`**:
   ```javascript
   {
       id: 9,
       title: {
           en: "Your Blog Post Title",
           fr: "Votre Titre d'Article"
       },
       description: {
           en: "Short description...",
           fr: "Brève description..."
       },
       category: "terraform", // docker, kubernetes, terraform, cicd, cloud, linux, devsecops
       date: "2026-04-15",
       author: "FOMA",
       image: "images/your-image.jpg",
       featured: false
   }
   ```

2. **Create Blog Post HTML** in `/blog/` directory:
   - Copy `post.html` or `kubernetes.html` as template
   - Update content and metadata
   - Use same structure for consistency

3. **Update translations** for the new post content

---

## JavaScript Functionality

### `main.js` - Core Functions
```javascript
// Load header with language support
setLanguage(lang)              // Change language globally
applyTranslations()            // Apply translations to DOM
setupLanguageSwitcher()        // Setup language buttons
```

### `blog.js` - Blog-Specific Functions
```javascript
loadBlogPosts()                // Load and display posts
filterPostsByCategory(posts, category)  // Filter by category
performSearch()                // Search posts in real-time
loadMorePosts()                // Pagination
createPostCard(post)           // Generate post card HTML
formatDate(dateString)         // Format date based on language
```

### `translations.js` - Data
```javascript
translations                   // Translation object
blogPosts                      // Blog posts array
```

---

## Styling System

### Color Scheme
- **Primary Background**: `#000` (Black)
- **Secondary Background**: `#1a1a1a`, `#2d2d2d` (Dark Gray)
- **Accent Color**: `#64ffda` (Cyan/Teal)
- **Text**: White/Light Gray
- **Borders**: `#333` (Dark Gray)

### Typography
- **Headlines**: Poppins (600, 700 weights)
- **Body Text**: Open Sans (300-600 weights)
- **Code**: Courier New (monospace)

### Responsive Breakpoints
```css
/* Tablet */
@media (max-width: 768px) { ... }

/* Mobile */
@media (max-width: 480px) { ... }
```

---

## Configuration

### Posts Per Page
In `blog.js`, change:
```javascript
const postsPerPage = 6; // Adjust this value
```

### Default Language
In `main.js`, change:
```javascript
let currentLang = localStorage.getItem('preferredLanguage') || "en";
// Change "en" to "fr" for French default
```

### Categories
Add/remove categories in `blog.html`:
```html
<button class="category-btn" data-category="your-category">Category Name</button>
```

And add corresponding filter in `blog.js` if needed.

---

## Usage Instructions

### For Users
1. **View Blog**: Navigate to `/blog.html`
2. **Filter by Category**: Click category buttons
3. **Search Posts**: Type in search bar, press Enter
4. **Load More**: Click "Load More Posts" button
5. **Read Full Article**: Click "Read More" button on any post
6. **Switch Language**: Click EN/FR in header

### For Developers

#### Adding a New Blog Post
1. Add to `blogPosts` array in `translations.js`
2. Create new HTML file in `/blog/` folder
3. Update translations in `translations.js` if needed

#### Customizing Colors
Edit `/css/blog.css` and `/css/blog-post.css`:
```css
/* Change accent color */
border-color: #64ffda;  /* Change to your color */
background: #64ffda;
color: #64ffda;
```

#### Modifying Layout
- Blog grid columns: Edit `grid-template-columns` in `blog.css`
- Card size: Edit `minmax()` value in `posts-container`
- Header height: Edit `padding` values

---

## LocalStorage Features

The blog system uses `localStorage` to persist:
- **User Language Preference**: `preferredLanguage`

Example:
```javascript
// Save language preference
localStorage.setItem('preferredLanguage', 'en');

// Retrieve on page load
const savedLang = localStorage.getItem('preferredLanguage') || 'en';
```

---

## Best Practices

### Content
- Keep descriptions concise (2-3 sentences)
- Use consistent formatting across posts
- Include step-by-step guides for technical posts
- Add code examples with proper syntax

### Performance
- Optimize images before uploading
- Use lazy loading for images (optional enhancement)
- Limit posts displayed per page (currently 6)

### SEO
- Use descriptive titles
- Include relevant keywords in descriptions
- Use proper heading hierarchy (h1, h2, h3)
- Add alt text to images

### Accessibility
- Ensure sufficient color contrast
- Use semantic HTML elements
- Provide language options
- Support keyboard navigation

---

## Troubleshooting

### Posts Not Appearing
1. Check `blogPosts` array in `translations.js`
2. Verify `blog.html` is loading correctly
3. Check browser console for JavaScript errors
4. Ensure image paths are correct

### Search Not Working
1. Check `searchInput` and `searchBtn` IDs in HTML
2. Verify `performSearch()` function is called
3. Check browser console for errors

### Language Not Changing
1. Check language buttons are present in header
2. Verify `setLanguage()` function is defined
3. Check `translations` object has all required keys
4. Clear browser cache and localStorage

### Styling Issues
1. Verify CSS files are linked in HTML
2. Check for CSS conflicts
3. Clear browser cache
4. Use browser DevTools to inspect elements

---

## Future Enhancements

Consider adding:
- [ ] Comment system
- [ ] Author profiles
- [ ] Categories sidebar
- [ ] Related posts
- [ ] Social sharing buttons
- [ ] Reading time estimates (already in template)
- [ ] Tags in addition to categories
- [ ] Archive/timeline view
- [ ] RSS feed
- [ ] Admin panel for managing posts

---

## Support & Maintenance

### Regular Tasks
- Add new blog posts monthly
- Update translations
- Monitor for broken links
- Keep images optimized
- Update featured posts

### Monitoring
- Check browser console for errors
- Test in multiple browsers
- Verify mobile responsiveness
- Test language switching

---

## License & Credits

**FOMA - Foundation of Mastering Automation**
- Modern DevOps Learning Platform
- Built with HTML5, CSS3, JavaScript (Vanilla)
- Uses Google Fonts (Poppins, Open Sans)
- Designed for educational purposes

---

**Last Updated**: April 3, 2026
**Version**: 1.0
