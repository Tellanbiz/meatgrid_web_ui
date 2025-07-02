import { z } from "zod";
import axios from "@/service/api";

export const updateStockSchema = z.object({
    quantity: z
        .number({ required_error: "Quantity is required" })
});

export type UpdateStockSchema = z.infer<typeof updateStockSchema>;

export async function deleteStock(id: string): Promise<boolean> {
    const response = await axios.delete(`/stocks/delete?id=${id}`);
    return response.data.error == null;
}
