import { z } from "zod";

// A bracelet code must be a valid UUID v4 — this matches how
// children_bracelets.id is generated in the database.
export const braceletCodeSchema = z.string().uuid();
