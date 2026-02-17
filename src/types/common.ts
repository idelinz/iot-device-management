import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Id');
export const getByIdSchema = {
  params: z.object({
    id: objectIdSchema,
  }),
};
