import { CreateBannerRequest } from "./CreateBannerRequest";

export interface UpdateBannerRequest extends Partial<CreateBannerRequest> {
    id: string;
}