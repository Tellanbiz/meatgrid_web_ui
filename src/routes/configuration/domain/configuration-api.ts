import axios from "@/service/api";
import { Configuration } from "./models";

export async function updateConfiguration(free_delivery: boolean) : Promise<string | undefined>{
    const response = await axios.post("/configuration/update", {free_delivery});
    return response.data.error
}
export async function fetchAccounts(): Promise<Configuration> {
    const response = await axios.get<Configuration>("/configuration");
    return response.data;
}
