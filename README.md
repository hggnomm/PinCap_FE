# PinCap — Social Media Platform

A modern social media platform for sharing, organizing, and discovering visual content. Built with React, TypeScript, and a focus on user experience with AI-powered features.

---

## Screenshots

> The application features a beautiful masonry layout for media browsing, detailed media viewing with reactions and comments, album management, AI chatbot integration, and Instagram synchronization.

---

## Key Features

- **Media Sharing** — Upload images and videos with titles, descriptions, and tags
- **AI Metadata Generation** — Automatically generate titles, descriptions, and tags using Google Gemini AI
- **Masonry Gallery** — Beautiful Pinterest-style layout with infinite scroll
- **Album Management** — Create albums, invite collaborators, control privacy
- **Reactions & Comments** — Heart reactions and nested comment threads
- **AI Chatbot (Pinbot)** — Natural language search and album creation
- **Instagram Sync** — Import posts from Instagram via Facebook OAuth
- **Content Safety** — AI-powered image moderation with Google Cloud Vision
- **Draft Auto-save** — Never lose your work with automatic saving
- **User Profiles** — Follow/unfollow users, view follower counts
- **Real-time Notifications** — Stay updated with the latest activity

---

## Tech Stack

### Core Technologies

| Category   | Technology   | Version |
| ---------- | ------------ | ------- |
| Framework  | React        | 18.x    |
| Build Tool | Vite         | 4.x     |
| Language   | TypeScript   | 5.x     |
| Routing    | React Router | 6.x     |

### State Management

| Category     | Technology            | Purpose                       |
| ------------ | --------------------- | ----------------------------- |
| Global State | Redux Toolkit         | Auth, notifications, chatbot  |
| Server State | TanStack Query        | API caching, infinite queries |
| Forms        | React Hook Form + Zod | Type-safe validation          |

### UI & Styling

| Category          | Technology       | Purpose                   |
| ----------------- | ---------------- | ------------------------- |
| CSS Framework     | Tailwind CSS 4.x | Utility-first styling     |
| Component Library | Ant Design       | Pre-built UI components   |
| Dynamic Classes   | clsx             | Conditional className     |
| Animations        | Framer Motion    | Smooth transitions        |
| Styling           | LESS             | Component-specific styles |

### Integrations

| Category     | Technology          | Purpose                        |
| ------------ | ------------------- | ------------------------------ |
| HTTP Client  | Axios               | API requests with interceptors |
| File Upload  | FilePond            | Rich media uploads             |
| Image Editor | TUI Image Editor    | In-browser editing             |
| AI           | Google Gemini       | Metadata generation            |
| Vision       | Google Cloud Vision | Content moderation             |
| OAuth        | Facebook Login      | Instagram sync                 |

---

## Architecture & Design Patterns

### 1. Component-Based Architecture (3 Layers)

UI is organized into 3 distinct layers:

```
┌────────────────────────────────────────────┐
│  Pages / Containers                        │  ← Smart: fetch data, manage state
│  (pages/PinCap/, pages/Auth/)             │     Home, DetailMedia, Profile
├────────────────────────────────────────────┤
│  Feature Components                        │  ← Stateful domain components
│  (components/Header/, components/Modal/)  │     MediaViewer, Chatbot, Comment
├────────────────────────────────────────────┤
│  Base UI Primitives                       │  ← Dumb/presentational components
│  (components/base/)                        │     Button, Input, Modal primitives
└────────────────────────────────────────────┘
```

### 2. Custom Hooks Pattern (Logic Separation)

Business logic is completely separated from JSX through custom hooks:

```typescript
// useCreateMedia.ts — Encapsulates all media creation logic
export function useCreateMedia(resetForm, updateFormFields) {
  const [isLoad, setIsLoad] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  // ... all state and handlers

  const handleGenerateClick = async (formValue) => { ... };
  const handleFormChange = (formValue) => { ... };

  return { isLoad, fileList, handleGenerateClick, ... };
}
```

### 3. React Query for Server State

TanStack Query manages all API data with caching and pagination:

```typescript
// useMedia.ts — Media query hooks
const getMediaList = (page = 1) => {
  return useQuery({
    queryKey: ["medias", "all", page],
    queryFn: () => media.getAllMedias({ page }),
    staleTime: 5 * 60 * 1000,
  });
};

const createMediaMutation = useMutation({
  mutationFn: (data) => media.createMedia(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["medias"] });
  },
});
```

### 4. Redux Toolkit for Global State

Redux manages authentication, notifications, and chatbot state:

```typescript
// store/authSlice.ts
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.id = tokenInfo?.id || "";
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.isAuthenticated = false;
    },
  },
});

// store/notificationSlice.ts — Async thunks for API calls
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async ({ page, perPage }, { rejectWithValue }) => {
    const response = await notificationAPI.getMyNotifications(page, perPage);
    return response;
  },
);
```

### 5. Axios Interceptor Pattern

Centralized request/response handling:

```typescript
// apiClient.ts
const apiClient = axios.create({ baseURL: baseUrl });

// Request: Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(error);
  },
);
```

### 6. Protected Route Pattern

Authentication guard component:

```typescript
// ProtectedRoute.tsx
const ProtectedRoute: React.FC<{ children }> = ({ children }) => {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) return null;
  if (!user) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} />;

  return <>{children}</>;
};
```

### 7. Context Pattern for Toast Notifications

Global toast providers for media and album operations:

```typescript
// MediaToastContext.tsx
export const MediaToastProvider: React.FC<{ children }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mediaData, setMediaData] = useState<MediaData | null>(null);

  const showToast = (data: MediaData, action: "create" | "update") => {
    setMediaData(data);
    setAction(action);
    setIsVisible(true);
  };

  return (
    <MediaToastContext.Provider value={{ showToast, isVisible, mediaData }}>
      {children}
    </MediaToastContext.Provider>
  );
};
```

### 8. Lazy Loading Pattern

Code splitting for better performance:

```typescript
// App.tsx
const MediaToastContainer = lazy(
  () => import("./components/MediaSuccessToast/MediaToastContainer")
);

const AlbumToastContainer = lazy(
  () => import("./components/AlbumSuccessToast/AlbumToastContainer")
);

// Usage with Suspense
<Suspense fallback={null}>
  <MediaToastContainer />
  <AlbumToastContainer />
</Suspense>
```

### 9. Infinite Query for Pagination

Efficient infinite scrolling implementation:

```typescript
// ViewPinComponent.tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["medias", "all"],
  queryFn: ({ pageParam }) => getAllMedias({ page: pageParam }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    if (lastPage.current_page < lastPage.last_page) {
      return lastPage.current_page + 1;
    }
    return undefined;
  },
});
```

---

## Project Structure

```
PinCap_FE/
├── src/
│   ├── main.tsx                    ← React root: Redux + Query providers
│   ├── App.tsx                     ← Router + Protected routes + Layout
│   ├── global.css                  ← Tailwind imports + CSS variables
│   │
│   ├── api/                       ← Axios API functions
│   │   ├── apiClient.ts           ← Axios instance + interceptors
│   │   ├── auth.ts                ← Login, register, profile
│   │   ├── media.ts               ← Media CRUD, reactions
│   │   ├── album.ts               ← Album management
│   │   ├── users.ts               ← User profiles, follow
│   │   ├── comments.ts            ← Comment operations
│   │   ├── notifications.ts       ← Notification API
│   │   ├── chat.ts                ← Chatbot API
│   │   ├── instagram.ts           ← Instagram sync
│   │   ├── ai.ts                  ← AI generation
│   │   └── vision.ts              ← Content moderation
│   │
│   ├── react-query/               ← TanStack Query hooks
│   │   ├── useAuth.ts             ← Authentication queries/mutations
│   │   ├── useMedia.ts            ← Media queries/mutations
│   │   ├── useAlbum.ts            ← Album queries/mutations
│   │   ├── useUser.ts             ← User queries/mutations
│   │   ├── useComment.ts          ← Comment hooks
│   │   ├── useNotification.ts      ← Notification hooks
│   │   ├── useSearchMedia.ts      ← Search hooks
│   │   └── index.ts               ← Barrel exports
│   │
│   ├── store/                      ← Redux Toolkit store
│   │   ├── store.ts               ← configureStore + types
│   │   ├── authSlice.ts           ← User authentication state
│   │   ├── chatSlice.ts           ← Chatbot messages + async thunks
│   │   └── notificationSlice.ts   ← Notifications + async thunks
│   │
│   ├── hooks/                      ← Custom React hooks
│   │   ├── useCreateMedia.ts      ← Media creation logic + draft save
│   │   ├── useFormValidation.ts   ← Zod validation hook
│   │   ├── useSearch.ts           ← Search functionality
│   │   ├── useInitializeNotifications.ts
│   │   └── index.ts
│   │
│   ├── components/                  ← Reusable UI components
│   │   ├── Header/                 ← App header with search
│   │   ├── Sidebar/                ← Navigation sidebar
│   │   ├── ProtectedRoute/         ← Auth guard
│   │   ├── Notification/           ← Notification dropdown
│   │   ├── Chatbot/                ← AI chatbot + provider
│   │   ├── Modal/                  ← Modal dialogs
│   │   │   ├── media/              ← Media modals
│   │   │   └── album/              ← Album modals
│   │   ├── ViewPin/                ← Masonry gallery component
│   │   ├── MediaViewer/            ← Media display
│   │   ├── ImageEditor/            ← TUI Image Editor wrapper
│   │   ├── CarouselHeader/         ← Banner carousel
│   │   ├── AlbumDropdown/          ← Album selection
│   │   ├── FollowButton/           ← Follow/unfollow button
│   │   └── Loading/                ← Loading spinner
│   │
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Common/
│   │   │   ├── Home.tsx           ← Landing page
│   │   │   ├── NotFound.tsx
│   │   │   └── Forbidden.tsx
│   │   ├── PinCap/
│   │   │   ├── PinCap.tsx         ← Main feed (masonry gallery)
│   │   │   ├── CreateMedia/        ← Media upload + AI generation
│   │   │   ├── DetailMedia/        ← Single media view + comments
│   │   │   ├── MyMedia/            ← User's media list
│   │   │   ├── MyAlbum/            ← User's albums
│   │   │   ├── DetailAlbum/        ← Album detail view
│   │   │   ├── Profile/            ← Own profile
│   │   │   ├── UserProfile/        ← Other user's profile
│   │   │   ├── EditProfile/        ← Profile editing
│   │   │   ├── Search/             ← Search page
│   │   │   └── Instagram/          ← Instagram sync
│   │   └── AITools/
│   │       └── Images/             ← AI image generation
│   │
│   ├── contexts/                    ← React Context providers
│   │   ├── MediaToastContext.tsx   ← Media toast notifications
│   │   └── AlbumToastContext.tsx   ← Album toast notifications
│   │
│   ├── constants/
│   │   ├── routes.ts              ← Route constants
│   │   ├── env.ts                 ← Environment config
│   │   └── ...
│   │
│   ├── types/
│   │   ├── type.ts                ← Shared types
│   │   ├── Auth/                  ← Auth types
│   │   ├── User/                  ← User types
│   │   └── Media/                 ← Media types
│   │
│   ├── utils/
│   │   ├── utils.ts               ← Utility functions
│   │   ├── format.ts              ← Date/number formatting
│   │   └── ...
│   │
│   ├── validation/
│   │   ├── auth.ts                ← Login/register schemas
│   │   ├── media.ts               ← Media form schemas
│   │   └── album.ts               ← Album schemas
│   │
│   └── assets/
│       ├── icons/                 ← SVG icons
│       ├── img/                    ← Images
│       └── ...
│
├── vite.config.js                 ← Vite configuration
├── tailwind.config.js             ← Tailwind configuration
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

| Tool    | Version |
| ------- | ------- |
| Node.js | >= 18   |
| npm     | >= 9    |

### Environment Variables

Create a `.env` file based on the environment configuration:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Key Features Implementation

### Media Creation with AI

The `useCreateMedia` hook handles the complete media creation flow:

1. **File Upload** — FilePond with image preview
2. **Auto-save** — Debounced draft saving (1 second delay)
3. **AI Generation** — Google Gemini for metadata
4. **Content Safety** — Google Vision API moderation
5. **Form Validation** — Zod schemas

```typescript
const {
  isLoad,
  fileList,
  tags,
  handleGenerateClick,
  handleFormChange,
  draftId,
} = useCreateMedia(
  () => form.resetFields(), // Reset callback
  (values) => form.setFieldsValue(values), // Update callback
);
```

### Infinite Scroll Gallery

The `ViewPinComponent` uses infinite queries for smooth scrolling:

```typescript
<MediaList
  queryKey={["medias", "all"]}
  queryFn={(pageParam) => getAllMedias({ page: pageParam })}
  isEditMedia={false}
  refetchOnMount="always"
  staleTime={0}
/>
```

### AI Chatbot (Pinbot)

The chatbot uses Redux for message state and async thunks for API calls:

```typescript
// Send message
dispatch(
  sendMessageToBot({
    message: "Find images of cats",
    suggested_media_ids: [],
    file_url: null,
  }),
);

// Handle responses
const aiMessage: Message = {
  sender: "ai",
  text: response.answer,
  media: response.media,
  intent: response.intent,
  album: response.album,
};
```

### Real-time Notifications

Notifications use async thunks with pagination:

```typescript
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async ({ page, perPage }, { rejectWithValue }) => {
    const response = await notificationAPI.getMyNotifications(page, perPage);
    return response;
  },
);
```

---

## API Integration

### Request Flow

```
Component
    ↓
React Query Hook (useMedia, useAuth, etc.)
    ↓
API Function (src/api/*.ts)
    ↓
apiClient (Axios instance with interceptors)
    ↓
Backend API
```

### Authentication

JWT tokens are stored in localStorage and automatically attached to requests:

```typescript
// Login stores token
localStorage.setItem("token", response.token);

// All subsequent requests include
Authorization: Bearer<token>;
```

### Error Handling

401 errors trigger automatic logout and redirect:

```typescript
if (error.response?.status === 401) {
  localStorage.removeItem("token");
  window.location.href = ROUTES.LOGIN;
}
```

---

## Routing

Routes are centralized in `src/constants/routes.ts`:

```typescript
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PINCAP_HOME: "/home",
  CREATE_MEDIA: "/create-media",
  MEDIA_DETAIL: "/media/:id",
  MY_ALBUM: "/album",
  ALBUM_DETAIL: "/album/:id",
  PROFILE: "/profile",
  EDIT_PROFILE: "/profile/edit",
  SEARCH: "/search",
  INSTAGRAM_SYNC: "/instagram/sync",
};
```

---

## Styling Guidelines

The project follows a hybrid styling approach:

1. **Tailwind CSS** — Primary utility classes with `clsx` for conditional styles
2. **Ant Design** — Component library for complex UI
3. **LESS** — Component-specific styles in `.less` files
4. **CSS Variables** — Theme customization

Brand colors use Tailwind scale:

- Primary: `rose-600` (#a25772)
- Secondary: `pink-600` (#d42364)
- Accent: `pink-400` (#ec4899)

---

## Development Commands

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run lint`     | Run ESLint               |
| `npm run lint:fix` | Fix ESLint errors        |
| `npm run format`   | Format code with ESLint  |

---

## License

This project is for educational purposes.
