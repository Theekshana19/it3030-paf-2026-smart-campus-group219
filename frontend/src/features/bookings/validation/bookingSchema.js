import { z } from 'zod';

// booking form validation rules
export const bookingSchema = z
  .object({
    resourceId: z.number({ required_error: 'Please select a resource' }),
    bookingDate: z.string().min(1, 'Booking date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    purpose: z.string().min(1, 'Purpose is required').max(500, 'Purpose is too long'),
    expectedCount: z.union([z.string(), z.number()]).optional(),
    userEmail: z.string().min(1, 'Email is required').email('Enter a valid email'),
    userName: z.string().min(1, 'Name is required').max(100),
  })
  .superRefine((data, ctx) => {
    // end time must be after start time
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['endTime'],
      });
    }
    // booking date cannot be in the past
    if (data.bookingDate) {
      const today = new Date().toISOString().slice(0, 10);
      if (data.bookingDate < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Cannot book for a past date',
          path: ['bookingDate'],
        });
      }
    }
    // validate expected count if provided
    if (data.expectedCount !== undefined && data.expectedCount !== '') {
      const n = typeof data.expectedCount === 'number' ? data.expectedCount : Number(data.expectedCount);
      if (Number.isNaN(n) || n < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expected count cannot be negative',
          path: ['expectedCount'],
        });
      }
    }
  });

/** @typedef {z.infer<typeof bookingSchema>} BookingFormValues */
