# Frontend Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation & Running

```bash
# Navigate to the project
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start
```

The application will be available at `http://localhost:3000`

## 📚 API Configuration

Update `.env.local` with your API endpoint:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🎯 Key Features Implemented

### 1. **Authentication System**
- ✅ Login with email/password
- ✅ Registration with password strength validation
- ✅ JWT token management (access & refresh)
- ✅ Protected routes with automatic redirection
- ✅ Auto-logout on token expiry
- ✅ User session persistence

### 2. **Order Management**
- ✅ Browse orders with pagination
- ✅ Filter by category, price range, and search
- ✅ Sort by price, name, and date
- ✅ Create orders with quantity and notes
- ✅ Status badges (pending, completed, cancelled)
- ✅ Product images and descriptions

### 3. **URL State Management**
- ✅ Filters sync with URL query parameters
- ✅ Shareable links preserve filter state
- ✅ Back/forward navigation works correctly
- ✅ Bookmarkable search results

### 4. **User Experience**
- ✅ Responsive mobile-first design
- ✅ Loading skeletons for data fetching
- ✅ Error boundaries and handling
- ✅ Success notifications
- ✅ Optimistic UI updates
- ✅ Smooth animations and transitions

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/             # Auth route group
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   └── layout.tsx      # Auth layout
│   │   ├── (protected)/        # Protected route group
│   │   │   ├── order/          # Order listing page
│   │   │   └── layout.tsx      # Protected layout
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── LoginForm.tsx       # Login form
│   │   ├── RegisterForm.tsx    # Registration form
│   │   ├── FilterPanel.tsx     # Filter controls
│   │   ├── OrderCard.tsx       # Order card component
│   │   ├── Pagination.tsx      # Pagination
│   │   ├── Skeleton.tsx        # Loading skeletons
│   │   └── ProtectedLayout.tsx # Protected wrapper
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Auth mutations (login, register, logout)
│   │   ├── useOrder.ts         # Order queries
│   │   └── useFilters.ts       # Filter state & URL sync
│   │
│   ├── lib/                    # Utilities and helpers
│   │   ├── api.ts              # API client with axios
│   │   ├── store.ts            # Zustand stores
│   │   └── types.ts            # TypeScript interfaces
│   │
│   └── providers/              # React providers
│       ├── QueryProvider.tsx   # React Query setup
│       └── AuthProvider.tsx    # Auth context
│
├── public/                     # Static files
├── .env.local                 # Environment variables
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind CSS config
├── postcss.config.js          # PostCSS config
└── next.config.js             # Next.js config
```

## 🔐 Authentication Flow

### Login Process
1. User enters credentials on `/login`
2. Credentials validated with server
3. API returns `accessToken` and `refreshToken`
4. Tokens stored in localStorage
5. User redirected to `/order`

### Protected Routes
- All routes under `(protected)` require authentication
- Unauthenticated users redirected to `/login`
- Auth check on layout mount
- Loading state shown during verification

### Token Refresh
- Interceptor checks for 401 responses
- Automatically refreshes token before retry
- Handles token expiry gracefully
- Clears tokens on refresh failure

## 📊 Data Flow

### Order Listing
```
useFilters hook
  ├─ Category, price, sort, page
  ├─ Sync with URL params
  └─ Trigger useOrders

useOrders hook
  ├─ React Query (caching)
  ├─ Fetch from API
  ├─ Handle errors
  └─ Update UI

OrderCard components
  ├─ Display order data
  ├─ Handle create order
  └─ Optimistic updates
```

### Form Handling
```
React Hook Form
  ├─ Form state management
  ├─ Zod validation
  └─ Error display

Login/Register forms
  ├─ Validate input
  ├─ Call mutation
  └─ Handle response
```

## 🛠️ Development Tools

### ESLint
```bash
npm run lint
```

### Build
```bash
npm run build
```

### Development with hot reload
```bash
npm run dev
```

## 📦 Dependencies

### Core
- `next@14` - React framework
- `react@18` - UI library
- `typescript` - Type safety

### Data & State Management
- `@tanstack/react-query` - Server state
- `zustand` - Client state
- `axios` - HTTP client

### Forms & Validation
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@hookform/resolvers` - Integration

### Styling
- `tailwindcss` - Utility CSS
- `postcss` - CSS processing

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Tailwind CSS
- Configured in `tailwind.config.ts`
- Custom colors and components
- Dark mode ready

### TypeScript
- Strict mode enabled
- Path aliases: `@/*` → `src/*`
- Incremental compilation

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Components
- Flexible grid layouts
- Touch-optimized buttons
- Stacked navigation on mobile
- Sidebar on desktop

## 🚀 Performance

### Optimizations
- Code splitting
- Image optimization
- CSS-in-JS optimization
- API request debouncing
- React Query caching
- Lazy route loading

### Metrics
- First Load JS shared: ~87.3 kB
- Route sizes: 175 B - 9.39 kB
- Static pre-rendering

## 🐛 Troubleshooting

### Build Errors

**Module not found errors**
- Ensure all files exist in correct paths
- Check path aliases in `tsconfig.json`
- Verify import statements match file names

**Type errors**
- Run `npm run lint` for type checking
- Check `tsconfig.json` strict mode
- Verify interface implementations

### Runtime Issues

**API not responding**
- Verify API is running
- Check `.env.local` API URL
- Review browser network tab
- Check CORS settings on backend

**Filters not persisting**
- Check URL query parameters
- Verify `useFilters` hook execution
- Check browser localStorage
- Review URL sync logic

**Authentication failing**
- Verify credentials are correct
- Check API response format
- Review token storage
- Check interceptor logic

## 📖 API Expected Format

### Authentication Response
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string"
  }
}
```

### Orders Response
```json
{
  "data": [
    {
      "id": "string",
      "productName": "string",
      "category": "string",
      "price": number,
      "image": "string (optional)",
      "description": "string (optional)",
      "createdAt": "ISO date string",
      "status": "pending | completed | cancelled"
    }
  ],
  "total": number,
  "page": number,
  "pageSize": number,
  "hasNextPage": boolean
}
```

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Setup for Production
```env
NEXT_PUBLIC_API_URL=https://api.yourprodomain.com/api
NODE_ENV=production
```

## 📝 Code Examples

### Using Auth Hook
```typescript
import { useAuth } from '@/providers/AuthProvider';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return (
    <div>
      <p>Welcome, {user?.fullName}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### Using Filters
```typescript
import { useFilters } from '@/hooks/useFilters';
import { useOrders } from '@/hooks/useOrder';

export function OrderList() {
  const { category, setCategory } = useFilters();
  const { data, isLoading } = useOrders();
  
  return (
    <>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="Electronics">Electronics</option>
      </select>
      
      {isLoading ? <p>Loading...</p> : <OrderGrid orders={data.data} />}
    </>
  );
}
```

## 📞 Support

For issues or questions:
1. Check GitHub issues
2. Review documentation
3. Check browser console errors
4. Verify API connection

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run `npm run lint`
4. Run `npm run build`
5. Create pull request

---

Made with ❤️ by the OrderApp team
