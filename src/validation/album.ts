import { z } from 'zod';

export const createAlbumSchema = z.object({
  album_name: z
    .string()
    .min(1, 'Album name is required')
    .max(100, 'Album name must be less than 100 characters'),
  privacy: z.enum(['0', '1']), // 0 for private, 1 for public
});

export const updateAlbumSchema = z.object({
  album_name: z
    .string()
    .min(1, 'Album name is required')
    .max(100, 'Album name must be less than 100 characters')
    .optional(),
  image_cover: z.string().url('Must be a valid URL').optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  privacy: z.enum(['0', '1']).optional(), // 0 for private, 1 for public
});

export type CreateAlbumFormData = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumFormData = z.infer<typeof updateAlbumSchema>;
