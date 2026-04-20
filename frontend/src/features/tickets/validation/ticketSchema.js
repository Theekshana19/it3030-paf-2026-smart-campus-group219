import { z } from 'zod';

// this schema validates the ticket creation and edit forms
// it makes sure all required fields are filled in correctly
export const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  category: z.enum([
    'ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT',
    'FURNITURE', 'HVAC', 'CLEANING', 'OTHER',
  ], { required_error: 'Please select a category' }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    required_error: 'Please select a priority level',
  }),
  resourceId: z.union([z.number(), z.string()]).optional().nullable(),
  locationDesc: z.string().min(1, 'Location description is required').max(200),
  description: z.string()
    .min(10, 'Description must be at least 10 characters long')
    .max(2000, 'Description is too long'),
  reporterEmail: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  reporterName: z.string().min(1, 'Name is required').max(100),
  contactPhone: z.string().max(20).optional(),
  contactMethod: z.string().optional(),
});

/** @typedef {z.infer<typeof ticketSchema>} TicketFormValues */
