# OrderApp Frontend

A modern, full-featured Next.js 14 frontend application for order management and browsing with authentication, filtering, sorting, and responsive design.

## 🎯 Features

### Authentication & Security
- ✅ Login page with email/password authentication
- ✅ Register page with password strength indicator
- ✅ Protected routes with automatic redirection
- ✅ User session management with JWT tokens
- ✅ Auto-refresh token before expiry
- ✅ Secure token storage in localStorage
- ✅ User info display in navbar
- ✅ Logout functionality

### Order Management
- ✅ Order listing with pagination
- ✅ Advanced filtering (category, price range, search)
- ✅ Multiple sort options (price, name, newest)
- ✅ URL state synchronization (shareable links)
- ✅ Create order with quantity and notes
- ✅ Optimistic UI updates
- ✅ Order status display

### UI/UX
- ✅ Responsive design (mobile-first approach)
- ✅ Professional `lucide-react` iconography
- ✅ Beautiful notifications with `sweetalert2`
- ✅ Smart Thai Address Auto-complete
- ✅ Dark mode ready
- ✅ Skeleton loading states
- ✅ Error handling and display
- ✅ Success notifications
- ✅ Smooth transitions and animations
- ✅ Accessible form components

### Technical
- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ React Query for data fetching
- ✅ Zustand for state management
- ✅ React Hook Form for form handling
- ✅ Zod for validation
- ✅ Tailwind CSS for styling
- ✅ Axios for HTTP requests

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   ├── register/
│   │   │   └── page.tsx           # Register page
│   │   └── layout.tsx             # Auth layout
│   ├── (protected)/
│   │   ├── order/
│   │   │   └── page.tsx           # Order listing page
│   │   └── layout.tsx             # Protected layout with auth check
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── components/
│   ├── Navbar.tsx                 # Navigation bar
│   ├── LoginForm.tsx              # Login form
│   ├── RegisterForm.tsx           # Registration form
│   ├── FilterPanel.tsx            # Filter controls
│   ├── OrderCard.tsx              # Order card component
│   ├── Pagination.tsx             # Pagination controls
│   ├── Skeleton.tsx               # Loading skeletons
│   └── ProtectedLayout.tsx        # Protected layout wrapper
├── hooks/
│   ├── useAuth.ts                 # Auth mutations
│   ├── useOrder.ts                # Order data fetching
│   └── useFilters.ts              # Filter state management & URL sync
├── lib/
│   ├── types.ts                   # TypeScript interfaces
│   ├── api.ts                     # API client with interceptors
│   └── store.ts                   # Zustand stores
├── providers/
│   ├── QueryProvider.tsx          # React Query provider
│   └── AuthProvider.tsx           # Auth context provider
└── styles/
    └── globals.css                # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## 🔐 Authentication Flow

### Login Flow
1. User enters email and password
2. Credentials sent to API
3. API returns access token and refresh token
4. Tokens stored in localStorage
5. User redirected to `/order` page

### Protected Routes
- Any unauthenticated access to `/order` redirects to `/login`
- Auth check happens on layout mount
- Loading state shown during auth verification
- Automatic token refresh on 401 responses

### Logout
- Tokens cleared from localStorage
- User redirected to `/login`
- Auth state reset

## 📊 Data Fetching

### Order Listing
- Fetches paginated list of orders
- Filter parameters: category, minPrice, maxPrice, search
- Sort options: newest, price-asc, price-desc, name-asc, name-desc
- Page size: 12 items per page
- Uses React Query with caching

### URL State Synchronization
- Filter state automatically syncs with URL query parameters
- Back/forward navigation works correctly
- Shareable links preserve filter state
- Initial load reads URL params and applies them

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Mobile-first** responsive design
- **Breakpoints**:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- **Color Scheme**: Blue-based with neutral backgrounds
- **Custom animations**: Smooth transitions and skeleton loading

## 🛠️ API Endpoints Expected

The frontend expects the following API endpoints:

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token

### Orders
- `GET /orders` - Get paginated orders with filters
- `POST /orders` - Create new order
- `GET /orders/:id` - Get single order

## 🔄 State Management

### Zustand Stores
- `useAuthStore` - Authentication state (user, isAuthenticated, isLoading)
- `useFilterStore` - Filter state (category, price, sort, page, search)

### React Query
- Caches order data
- Automatic refetch on filter changes
- Stale time: 5 minutes
- Garbage collection: 10 minutes

## ⚙️ Configuration

### API Configuration
Change API base URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-api-url/api
```

### React Query Settings
Edit defaults in `src/providers/QueryProvider.tsx`:
- `staleTime`: How long data is fresh
- `gcTime`: Garbage collection time
- `retry`: Number of retry attempts

## 🐛 Troubleshooting

### Login not working
- Check API is running and accessible at configured URL
- Verify credentials are correct
- Check browser console for error messages

### Orders not loading
- Ensure user is authenticated
- Check API response in network tab
- Verify API_URL environment variable

### Filters not persisting
- Check URL query parameters
- Verify useFilters hook is being called
- Check browser localStorage

## 📱 Responsive Design

- **Mobile**: Single column layout, touch-optimized buttons
- **Tablet**: Two-column layout with filters on side
- **Desktop**: Full three-column layout with sticky filters

## 🚀 Performance Optimizations

- Code splitting with dynamic imports
- Image optimization with Next.js Image component
- CSS-in-JS optimization
- API request debouncing
- React Query cache management
- Lazy loading pagination

## 📚 Dependencies

- **next**: ^14.0.0
- **react**: ^18.2.0
- **@tanstack/react-query**: For data fetching
- **axios**: For HTTP requests
- **zustand**: For state management
- **react-hook-form**: For form handling
- **zod**: For validation
- **tailwindcss**: For styling

## 🔐 Security Best Practices

- ✅ HTTPOnly cookie support (ready for backend)
- ✅ Token refresh before expiry
- ✅ Automatic logout on token expiry
- ✅ Protected routes with auth checks
- ✅ Input validation and sanitization
- ✅ CORS handling via API
- ✅ No sensitive data in localStorage

## 📝 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## 📄 License

This project is part of the OrderApp application suite.

## 📞 Support

For issues or questions, please check:
- GitHub issues
- Documentation in /docs folder
- Code comments for implementation details

---

Made with ❤️ for order management
