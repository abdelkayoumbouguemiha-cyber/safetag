import { z } from "zod";

export const scanRequestSchema = z.object({
  code: z.string().uuid(),
  consent_location: z.boolean(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});
