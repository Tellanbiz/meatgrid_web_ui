import { AccountCreateParams } from "./models";
import axios from "@/service/api";

export async function createAccount(params: AccountCreateParams) : Promise<string | undefined>{
    const response = await axios.post("/account/create", params);
    return response.data.error
}
