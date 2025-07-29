import axios from "@/service/api";
import { CreateOrderPurchaseParams, CreatePurchaseParams, UpdatePurchaseParams } from "./models";
import { PurchasableProcessParams, PurchasableProductionParams } from "./process-models";


export async function createPurchasable(params: CreatePurchaseParams): Promise<string | undefined> {
    const response = await axios.post("/purchasables/new", params);
    return response.data.error;
}


export async function processPurchasable(params: PurchasableProcessParams): Promise<string | undefined> {
    const response = await axios.post("/purchasables/process", params);
    return response.data.error;
}

export async function produceProducts(params: PurchasableProductionParams): Promise<string | undefined> {
    const response = await axios.post("/purchasables/production", params);
    return response.data.error;
}


export async function updatePurchasable(params: CreatePurchaseParams): Promise<string | undefined> {
    const response = await axios.post("/purchasables/update", params);
    return response.data.error;
}

export async function createPurchaseOrder(params: CreateOrderPurchaseParams) {
    const response = await axios.post("/purchasables/order/new", params);
    return response.data.error
}

export async function updatePurchasableOrder(params: UpdatePurchaseParams): Promise<string | undefined> {
    const response = await axios.post("/purchasables/orders/update", params);
    return response.data.error;
}


export async function deletePurchaseOrder(id: string) {
    const response = await axios.delete(`/purchasables/orders?id=${id}`);
    return response.data.error
}

export async function deletePurchasable(id: string) {
    const response = await axios.delete(`/purchasables?id=${id}`);
    return response.data.error
}