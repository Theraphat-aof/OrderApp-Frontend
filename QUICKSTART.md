# 🚀 Quick Start Guide - OrderApp Frontend

## ⚡ 5-Minute Setup

### 1. Navigate to Project
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Browser
Visit: **http://localhost:3000**

---

## 🎯 What You Can Do

### On Home Page
- Click "Sign In" to login
- Click "Create Account" to register

### Test Account
If your backend has seed data:
- Email: `test@example.com`
- Password: `password123`

### Test Registration
- Fill in all fields
- Password must be 8+ characters
- Password strength is shown
- Must agree to terms
- After registration, you're redirected to login

### After Login
- See your username in navbar
- Access `/order` page
- Browse orders with filters
- Create new orders
- Use all filters and sorts

---

## 📁 Project Files

**Key Files to Know:**

| File | Purpose |
|------|---------|
| `.env.local` | API configuration |
| `package.json` | Dependencies and scripts |
| `src/app/` | Page routes |
| `src/components/` | React components |
| `src/hooks/` | Custom hooks |
| `src/lib/api.ts` | API client |

---

## 🔧 Available Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Can't Connect to API
- Verify API is running at configured URL
- Check `.env.local` has correct API URL
- Restart development server

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## 🎓 Learn the Structure

```
frontend/
├── src/
│   ├── app/          ← Pages and routes
│   ├── components/   ← Reusable components
│   ├── hooks/        ← Custom React hooks
│   ├── lib/          ← Utilities and API client
│   └── providers/    ← Context providers
├── package.json      ← Dependencies
├── tsconfig.json     ← TypeScript config
└── .env.local        ← Your local config
```

---

## 🔑 Key Features

✅ **Authentication**
- Login & Register
- Protected routes
- Token management

✅ **Orders**
- Browse with filters
- Search products
- Sort by multiple options
- Create orders
- Pagination

✅ **Responsive**
- Mobile friendly
- Tablet optimized
- Desktop full-featured

---

## 📚 More Information

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **Complete Checklist**: See `CHECKLIST.md`
- **Environment Setup**: See `ENV_SETUP.md`
- **Main Documentation**: See `README.md`

---

## 💡 Quick Tips

### Hot Reload Works
Edit any file and the browser automatically refreshes - no need to restart server!

### Check Console
Open browser DevTools (F12) and check Console tab for any errors.

### Network Tab
Check Network tab to see API requests and responses.

### Local Storage
Check Application → Storage → Local Storage to see saved tokens.

---

## 🚀 Next Steps

1. **Explore the Code**
   - Open `src/app/page.tsx` to see home page
   - Open `src/components/LoginForm.tsx` to see login form
   - Open `src/hooks/useAuth.ts` to see authentication logic

2. **Test the Features**
   - Register a new account
   - Login with the account
   - Browse and filter orders
   - Create an order

3. **Customize**
   - Change colors in Tailwind config
   - Add new filters
   - Modify API endpoints
   - Add new pages

---

## 📞 Need Help?

### Check These Files First
1. Console errors (F12)
2. Network tab (API calls)
3. README.md
4. SETUP_GUIDE.md

### Common Issues

**"Cannot find module"**
- Restart dev server: `npm run dev`
- Clear cache: `rm -rf .next`

**"Failed to fetch orders"**
- Check API URL in `.env.local`
- Verify backend is running
- Check Network tab for URL

**"Login not working"**
- Check credentials are correct
- Verify API is running
- Check Network tab for response

---

## 🎉 Ready to Go!

You now have a fully functional OrderApp frontend running locally!

**Enjoy coding! 🚀**

---

Questions? Check the documentation files or the inline code comments.
