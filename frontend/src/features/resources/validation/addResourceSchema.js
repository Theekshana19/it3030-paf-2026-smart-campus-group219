import { z } from 'zod';

const resourceTypeEnum = z.enum(['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']);
const statusEnum = z.enum(['ACTIVE', 'OUT_OF_SERVICE']);

export const addResourceSchema = z
  .object({
    resourceName: z.string().min(1, 'Resource name is required'),
    resourceCode: z.string().min(1, 'Resource code is required'),
    resourceType: resourceTypeEnum,
    equipmentSubtype: z.string().optional(),
    description: z.string().optional(),
    capacity: z.union([z.string(), z.number()]).optional(),
    building: z.string().min(1, 'Building name is required'),
    floor: z.string().optional(),
    roomOrAreaIdentifier: z.string().optional(),
    defaultAvailableFrom: z.string().min(1, 'From time is required'),
    defaultAvailableTo: z.string().min(1, 'To time is required'),
    workingDays: z.array(z.string()).min(1, 'Select at least one working day'),
    status: statusEnum,
  })
  .superRefine((data, ctx) => {
    if (data.capacity !== undefined && data.capacity !== '') {
      const n = typeof data.capacity === 'number' ? data.capacity : Number(data.capacity);
      if (Number.isNaN(n) || n < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Capacity cannot be negative',
          path: ['capacity'],
        });
      }
    }
    const from = data.defaultAvailableFrom?.slice(0, 5);
    const to = data.defaultAvailableTo?.slice(0, 5);
    if (from && to && from >= to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'From time must be before to time',
        path: ['defaultAvailableTo'],
      });
    }
    if (data.resourceType === 'EQUIPMENT' && !data.equipmentSubtype?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Equipment subtype is required for equipment resources',
        path: ['equipmentSubtype'],
      });
    }
  });

/** @typedef {z.infer<typeof addResourceSchema>} AddResourceFormValues */
