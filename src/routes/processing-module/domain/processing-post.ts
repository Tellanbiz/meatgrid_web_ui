import { ProcessingParams } from "./data";
import axios from "@/service/api";

export async function createBatch(params: ProcessingParams): Promise<string | undefined> {
    const response = await axios.post("/stocks/process", params);
    return response.data.error;
}
