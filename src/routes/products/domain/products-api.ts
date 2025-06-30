import axios from "@/service/api";

export async function deleteProduct(id: string): Promise<string | undefined> {
    const response = await axios.delete(`/products?id=${id}`);
    return response.data.error
}