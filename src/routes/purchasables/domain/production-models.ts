export interface ProductionBatch {
    id: string;
    batch_number: string;
    production_id: string;
    bar_code_url: string;
    qr_code_url: string;
    frozen_at: string;
    chilled_at: string;
    manufactured_at: string;
    created_at: string;
    quantity: number;
    product: {
        id: string;
        image: string;
        name: string;
    };
}

export interface ProductionBatchInfo {
    id: string;
    batch_number: string;
    production_id: string;
    bar_code_url: string;
    qr_code_url: string;
    frozen_at: string;
    chilled_at: string;
    manufactured_at: string;
    created_at: string;
    output_products: {
        created_at: string;
        movement_type: string;
        product: {
            description: string;
            id: string;
            image: string;
            name: string;
            unit_type: string;
        };
        quantity: number;
        status: string;
        stock_id: string;
        storage_type: {
            id: string;
            name: string;
        };
        store: {
            id: string;
            name: string;
        };
    }[];
    output_summary: {
        total_products: number;
        total_quantity: number;
        products_list: {
            id: string;
            name: string;
            unit_type: string;
            image: string;
        }[];
    };
    input_materials: {
        created_at: string;
        movement_type: string;
        product: {
            id: number;
            name: string;
            unit_type: string;
        };
        quantity: number;
        status: string;
        stock_id: string;
        storage_type: {
            id: string;
            name: string;
        };
        store: {
            id: string;
            name: string;
        };
    }[];
}
