import { CreateTagRequest } from "./CreateTagRequest";

export interface UpdateTagRequest extends CreateTagRequest {
  id: string;
}
