import { IPwStoreData } from "../../../interfaces/responses";
import { ItemPreviewStore } from "../ItemPreviewStore";

export const defColor = 'ffc';

export interface PreviewRenderProps {
    data: IPwStoreData;
    store: ItemPreviewStore;
}
