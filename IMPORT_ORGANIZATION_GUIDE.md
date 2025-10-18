# Import Organization Guide

## Tổng quan

Dự án đã được cấu hình để tự động sắp xếp và tối ưu hóa imports khi save file (Ctrl + S).

## Cấu hình đã được thiết lập

### 1. ESLint Configuration

- **File**: `.eslintrc.cjs`
- **Plugins**:
  - `eslint-plugin-import`: Sắp xếp imports
  - `eslint-plugin-unused-imports`: Loại bỏ imports không sử dụng
  - `@typescript-eslint/eslint-plugin`: TypeScript support

### 2. VS Code Settings

- **File**: `.vscode/settings.json`
- **Tính năng**: Auto-fix on save cho TypeScript/JavaScript files

### 3. Import Order Rules

Imports sẽ được sắp xếp theo thứ tự:

1. **React** (ưu tiên đầu tiên)
2. **External packages** (npm packages)
3. **Internal modules** (sử dụng @/ alias)
4. **Parent/Sibling imports** (relative imports)

## Cách sử dụng

### Tự động (Khuyến nghị)

1. Mở file TypeScript/JavaScript
2. Nhấn **Ctrl + S** để save
3. Imports sẽ được tự động sắp xếp và tối ưu hóa

### Thủ công

```bash
# Fix imports cho toàn bộ dự án
npm run lint:fix

# Hoặc chỉ kiểm tra
npm run lint
```

## Ví dụ

### Trước khi save:

```typescript
import { useState, useEffect } from "react";
import { useAuth } from "@/react-query/useAuth";
import { useUser } from "@/react-query/useUser";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import Loading from "@/components/loading/Loading";
import { Mail, Phone, User, MapPin, Calendar, Star } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import FollowButton from "@/components/FollowButton";
import BackButton from "@/components/backButton/BackButton";
import React from "react";
import axios from "axios";
import { Button } from "antd";
```

### Sau khi save (Ctrl + S):

```typescript
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "antd";

import { useAuth } from "@/react-query/useAuth";
```

## Lợi ích

1. **Tự động loại bỏ unused imports**: Không cần import những thứ không sử dụng
2. **Sắp xếp imports theo thứ tự logic**: React → External → Internal
3. **Alphabetical sorting**: Trong mỗi nhóm imports được sắp xếp A-Z
4. **Consistent formatting**: Tất cả team members có cùng style
5. **Giảm conflicts**: Ít conflicts khi merge code

## Lưu ý

- Đảm bảo VS Code đã cài đặt extension **ESLint**
- Nếu không tự động fix, kiểm tra VS Code settings
- Có thể chạy `npm run lint:fix` để fix toàn bộ dự án một lần

## Troubleshooting

### Nếu imports không được sắp xếp:

1. Kiểm tra VS Code có extension ESLint
2. Restart VS Code
3. Chạy `npm run lint:fix` thủ công

### Nếu có lỗi TypeScript:

1. Kiểm tra `tsconfig.json` có include file đang edit
2. Restart TypeScript server trong VS Code (Ctrl + Shift + P → "TypeScript: Restart TS Server")
