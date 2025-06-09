export interface Stock {
    id: string;
    productId: string;
    quantity: number;
    location: string;
    lastUpdated: Date;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    unit: string;
}

export interface StockUpdate {
    stockId: string;
    quantity: number;
    type: 'add' | 'remove' | 'set';
    reason: string;
}

export interface StockTransfer {
    fromLocation: string;
    toLocation: string;
    productId: string;
    quantity: number;
    reason: string;
}

export interface StockProcess {
    stockId: string;
    processType: string;
    quantity: number;
    notes?: string;
}

export type StockOperation = 'restock' | 'transfer' | 'process' | 'update'; 