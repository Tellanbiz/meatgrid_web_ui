import { z } from "zod";

export const updateStockSchema = z.object({
    quantity: z
        .number({ required_error: "Quantity is required" })
});

export type UpdateStockSchema = z.infer<typeof updateStockSchema>;
