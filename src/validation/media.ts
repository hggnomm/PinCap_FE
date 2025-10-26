import { z } from "zod";

import { PRIVACY, MEDIA_TYPES } from "@/constants/constants";

export const createMediaSchema = z.object({
  id: z.string().optional(),
  media: z.union([z.instanceof(File), z.array(z.instanceof(File))]).optional(), // Single file or array of files
  media_name: z
    .string()
    .min(1, "Media name is required")
    .max(100, "Media name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")), // Allow empty string
  privacy: z.enum([PRIVACY.PUBLIC, PRIVACY.PRIVATE]),
  mediaOwner_id: z.string().optional(),
  is_comment: z.number().default(1), // Backend expects 1/0 instead of true/false
  is_created: z.boolean().default(false), // Based on Media type: boolean
  tags_name: z.array(z.string()).optional(),
  album_id: z.string().optional(),
  type: z.enum([MEDIA_TYPES.IMAGE, MEDIA_TYPES.VIDEO]).optional(), // Based on constants
});

export const updateMediaSchema = z.object({
  id: z.string(), // Required for updates
  media_name: z
    .string()
    .min(1, "Media name is required")
    .max(100, "Media name must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")), // Allow empty string
  privacy: z.enum([PRIVACY.PRIVATE, PRIVACY.PUBLIC]).optional(),
  is_comment: z.number().optional(),
  is_created: z.boolean().optional(),
  tags_name: z.array(z.string()).optional(),
  album_id: z.string().optional(),
  type: z.enum([MEDIA_TYPES.IMAGE, MEDIA_TYPES.VIDEO]).optional(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(1000, "Comment must be less than 1000 characters"),
  imageUrl: z.string().optional(),
});

export type CreateMediaFormData = z.infer<typeof createMediaSchema>;
export type UpdateMediaFormData = z.infer<typeof updateMediaSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type MediaType = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];
