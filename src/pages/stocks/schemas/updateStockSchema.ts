import { z } from "zod";

export const updateStockSchema = z.object({
  quantity: z
    .number({ required_error: "Quantity is required" })
    .min(1, { message: "Quantity must be greater than 0" }),
});

export type UpdateStockSchema = z.infer<typeof updateStockSchema>;
