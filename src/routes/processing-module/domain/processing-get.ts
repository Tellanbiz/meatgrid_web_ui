import {  AvailableProductItem, ProductBatch } from "./data";
import axios from "@/service/api";
import { StorageType } from "@/store/features/storages/storageTypes";
import { Store } from "@/store/features/stores/storeTypes";

export async function getBatches(): Promise<ProductBatch[]> {
    const response = await axios.get("/stocks/batches");
    return response.data as ProductBatch[];
}

export async function getAvailableProductItems(): Promise<AvailableProductItem[]> {
    const response = await axios.get("/products/all");
    return response.data as AvailableProductItem[];
}

export async function getStorageTypes(): Promise<StorageType[]> {
    const response = await axios.get("/storagetypes");
    return response.data as StorageType[];
}

export async function getWarehouses(): Promise<Store[]> {
    const response = await axios.get("/stores");
    return response.data as Store[];
}
