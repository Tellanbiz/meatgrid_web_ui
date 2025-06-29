import axios from "@/service/api";

export async function resetStaffCode(user_id: string,store_id: string) : Promise<string | undefined>{
    const response = await axios.post("/staff/reset", {user_id,store_id});
    return response.data.error
}


export async function deleteStaff(user_id: string) : Promise<string | undefined>{
    const response = await axios.post("/staff/delete", {user_id});
    return response.data.error
}
