# Troubleshooting Guide

## Common Issues and Solutions

### 1. PostCSS/Tailwind CSS Configuration Error

**Error:** `It looks like you're trying to use 'tailwindcss' directly as a PostCSS plugin`

**Solution:**
- Ensure `postcss.config.js` uses CommonJS syntax:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- Ensure `tailwind.config.js` uses CommonJS syntax:
```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // ... rest of config
}
```

### 2. Missing Dependencies

**Error:** Module not found errors

**Solution:**
```bash
npm install
# or if specific packages are missing:
npm install @tailwindcss/forms @tailwindcss/typography
```

### 3. API Connection Issues

**Error:** Network errors or CORS issues

**Solution:**
- Check `.env` file has correct API URL:
```
VITE_API_URL=https://localhost:7000/api
```
- Ensure backend API is running
- Verify CORS is configured on the backend

### 4. Authentication Issues

**Error:** Token-related errors or login failures

**Solution:**
- Clear localStorage: `localStorage.clear()`
- Check if JWT token is valid
- Verify backend authentication endpoints are working

### 5. Build Issues

**Error:** Build failures or missing assets

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

### 6. Route Protection Issues

**Error:** Unauthorized access or redirect loops

**Solution:**
- Check user role in localStorage
- Verify ProtectedRoute component logic
- Ensure proper role-based routing

## Environment Setup

### Required Environment Variables
```bash
VITE_API_URL=https://localhost:7000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. **Code Splitting**: Use React.lazy() for route-based code splitting
2. **Image Optimization**: Compress images and use appropriate formats
3. **Bundle Analysis**: Use `npm run build -- --analyze` to check bundle size
4. **Caching**: Implement proper caching strategies for API calls

## Getting Help

1. Check the console for detailed error messages
2. Verify network requests in browser DevTools
3. Check if backend API is responding correctly
4. Review the component tree for state management issues

## Common Development Workflow

1. Start backend API server
2. Start frontend development server: `npm run dev`
3. Open browser to `http://localhost:5173`
4. Check browser console for any errors
5. Test authentication flow
6. Verify API connections are working