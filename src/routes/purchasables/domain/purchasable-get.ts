import axios from "@/service/api";
import { Purchasable, PurchasableOrder, PurchasableStock } from "./models";
import { ProductionBatch, ProductionBatchInfo } from "./production-models";

export async function getPurchasables(store_id?: string, name?: string): Promise<Purchasable[]> {
    const params = new URLSearchParams();
    if (store_id) params.append('store_id', store_id);
    if (name) params.append('name', name);

    const response = await axios.get(`/purchasables${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data as Purchasable[];
}

/** so the date should be as dd-mm-yyyy */
export async function getPurchasableOrders(startDate: string, endDate: string): Promise<PurchasableOrder[]> {
    const response = await axios.get(`/purchasables/orders?start_date=${startDate}&end_date=${endDate}`);
    return response.data as PurchasableOrder[];
}

export async function getPurchasableStocks(): Promise<PurchasableStock[]> {
    const response = await axios.get<PurchasableStock[]>(`/purchasables/stocks`);
    return response.data;
}

export async function getProductionBatches(): Promise<ProductionBatch[]> {
    const response = await axios.get<ProductionBatch[]>(`/purchasables/batches`);
    return response.data;
}

export async function getProductionBatchInfo(batchID: string): Promise<ProductionBatchInfo> {
    const response = await axios.get<ProductionBatchInfo>(`/purchasables/batches/info?id=${batchID}`);
    return response.data;
}

