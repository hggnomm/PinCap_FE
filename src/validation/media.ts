import { z } from 'zod';
import { PRIVACY } from '@/constants/constants';

export const createMediaSchema = z.object({
  media: z.any(), // File upload
  media_name: z
    .string()
    .min(1, 'Media name is required')
    .max(100, 'Media name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  privacy: z.enum([PRIVACY.PUBLIC, PRIVACY.PRIVATE]),
  is_comment: z.boolean().optional(),
  is_created: z.boolean().optional(),
  tags_name: z.string().optional(), // Array as string
  album_id: z.string().optional(),
});

export const updateMediaSchema = z.object({
  media_name: z
    .string()
    .min(1, 'Media name is required')
    .max(100, 'Media name must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  privacy: z.enum([PRIVACY.PRIVATE, PRIVACY.PUBLIC]).optional(),
  is_comment: z.boolean().optional(),
  tags_name: z.array(z.string()).optional(),
  album_id: z.string().optional(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment must be less than 1000 characters'),
  imageUrl: z.string().optional(),
});

export type CreateMediaFormData = z.infer<typeof createMediaSchema>;
export type UpdateMediaFormData = z.infer<typeof updateMediaSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
