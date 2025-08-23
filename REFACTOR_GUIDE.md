# Refactor Guide - PinCap Frontend

## Tổng quan

Dự án đã được refactor với các cải tiến sau:

### 1. Constants Routes (`src/constants/routes.ts`)

Quản lý tất cả routes trong ứng dụng một cách tập trung:

```typescript
import { ROUTES } from './constants/routes';

// Sử dụng
<Route path={ROUTES.LOGIN} element={<Login />} />
<Route path={ROUTES.PINCAP_HOME} element={<PinCap />} />
```

### 2. Protected Route (`src/components/ProtectedRoute/ProtectedRoute.tsx`)

Bảo vệ các route cần authentication:

```typescript
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

<ProtectedRoute>
  <YourProtectedComponent />
</ProtectedRoute>
```

### 3. React Query Hooks

#### useAuth Hook (`src/hooks/useAuth.ts`)
```typescript
import { useAuth } from './hooks';

const { 
  user, 
  isAuthenticated, 
  login, 
  logout,
  loginLoading,
  loginError 
} = useAuth();
```

#### useMedia Hook (`src/hooks/useMedia.ts`)
```typescript
import { useMedia } from './hooks';

const { 
  getMediaList, 
  getMediaById, 
  createMedia,
  updateMedia,
  deleteMedia 
} = useMedia();

// Sử dụng
const { data: mediaList, isLoading } = getMediaList(1);
```

#### useAlbum Hook (`src/hooks/useAlbum.ts`)
```typescript
import { useAlbum } from './hooks';

const { 
  getAlbumList, 
  getAlbumById, 
  createAlbum,
  updateAlbum,
  deleteAlbum 
} = useAlbum();
```

#### useUser Hook (`src/hooks/useUser.ts`)
```typescript
import { useUser } from './hooks';

const { 
  getMyProfile, 
  updateMyProfile,
  getRelationships,
  followOrBlockUser,
  unfollowOrUnblockUser,
  getUserProfile,
  searchUsers,
  findUsers,
  getReportReasons,
  reportUser
} = useUser();
```

#### useComment Hook (`src/hooks/useComment.ts`)
```typescript
import { useComment } from './hooks';

const { 
  getComments, 
  getReplies,
  createComment,
  replyComment,
  toggleCommentReaction,
  toggleReplyReaction
} = useComment();
```

#### useNotification Hook (`src/hooks/useNotification.ts`)
```typescript
import { useNotification } from './hooks';

const { 
  getMyNotifications, 
  markAsRead,
  markAllAsRead
} = useNotification();
```

### 4. Zod Validation (`src/validation/`)

#### Schemas có sẵn:
- `loginSchema` - Validation cho form đăng nhập
- `registerSchema` - Validation cho form đăng ký (với `first_name`, `last_name`, `password_confirmation`)
- `createMediaSchema` - Validation cho tạo media (với `media_name`, `privacy`, `tags_name`)
- `updateMediaSchema` - Validation cho cập nhật media
- `createAlbumSchema` - Validation cho tạo album (với `album_name`, `privacy` dạng '0'/'1')
- `updateAlbumSchema` - Validation cho cập nhật album

#### Sử dụng validation:
```typescript
import { useFormValidation } from './hooks';
import { loginSchema } from './validation';

const { validate, getFieldError, clearErrors } = useFormValidation(loginSchema);

const handleSubmit = (values: any) => {
  if (validate(values)) {
    // Form hợp lệ
    console.log('Valid data:', values);
  } else {
    // Form không hợp lệ
    console.log('Validation failed');
  }
};
```

### 5. ValidationError Component (`src/components/ValidationError/ValidationError.tsx`)

Hiển thị lỗi validation:

```typescript
import ValidationError from './components/ValidationError/ValidationError';

<ValidationError error={getFieldError('email')} />
```

## Cách sử dụng trong components

### Ví dụ với Login Form:

```typescript
import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useAuth } from '../hooks';
import { useFormValidation } from '../hooks';
import { loginSchema } from '../validation';
import ValidationError from '../components/ValidationError/ValidationError';

const LoginForm: React.FC = () => {
  const { login, loginLoading, loginError } = useAuth();
  const { validate, getFieldError } = useFormValidation(loginSchema);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (values: any) => {
    if (validate(values)) {
      login(values);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="Email">
        <Input
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          status={getFieldError('email') ? 'error' : ''}
        />
        <ValidationError error={getFieldError('email')} />
      </Form.Item>
      
      <Form.Item label="Password">
        <Input.Password
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          status={getFieldError('password') ? 'error' : ''}
        />
        <ValidationError error={getFieldError('password')} />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loginLoading}>
        Login
      </Button>
    </Form>
  );
};
```

### Ví dụ với Media List:

```typescript
import React from 'react';
import { useMedia } from '../hooks';

const MediaList: React.FC = () => {
  const { getMediaList, createMedia, createMediaLoading } = useMedia();
  const { data: mediaList, isLoading, error } = getMediaList(1);

  const handleCreateMedia = (data: any) => {
    createMedia(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {mediaList?.map(media => (
        <div key={media.id}>{media.media_name}</div>
      ))}
    </div>
  );
};
```

### Ví dụ với User Profile:

```typescript
import React from 'react';
import { useUser } from '../hooks';

const UserProfile: React.FC = () => {
  const { getMyProfile, updateMyProfile, updateMyProfileLoading } = useUser();
  const { data: profile, isLoading } = getMyProfile();

  const handleUpdateProfile = (data: any) => {
    updateMyProfile(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{profile?.firstName} {profile?.lastName}</h2>
      <p>{profile?.email}</p>
    </div>
  );
};
```

### Ví dụ với Comments:

```typescript
import React from 'react';
import { useComment } from '../hooks';

const CommentSection: React.FC<{ mediaId: string }> = ({ mediaId }) => {
  const { getComments, createComment, createCommentLoading } = useComment();
  const { data: comments, isLoading } = getComments(mediaId);

  const handleCreateComment = (data: any) => {
    createComment({ ...data, media_id: mediaId });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {comments?.data?.map(comment => (
        <div key={comment.id}>{comment.content}</div>
      ))}
    </div>
  );
};
```

## Lợi ích của refactor

1. **Tập trung hóa**: Routes được quản lý tập trung, dễ bảo trì
2. **Bảo mật**: Protected routes tự động kiểm tra authentication
3. **Performance**: React Query cache data, giảm số lượng API calls
4. **Type Safety**: Zod validation đảm bảo type safety cho forms
5. **Reusability**: Hooks có thể tái sử dụng trong nhiều components
6. **Error Handling**: Xử lý lỗi tập trung và nhất quán

## Migration Notes

- Các API calls cũ vẫn hoạt động bình thường
- Không cần thay đổi logic business
- Chỉ cần import và sử dụng hooks mới
- Validation có thể được áp dụng từng bước
