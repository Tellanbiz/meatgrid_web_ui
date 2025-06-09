import { Stock, StockUpdate, StockTransfer } from '../types';

export const calculateNewQuantity = (currentQuantity: number, update: StockUpdate): number => {
    switch (update.type) {
        case 'add':
            return currentQuantity + update.quantity;
        case 'remove':
            return Math.max(0, currentQuantity - update.quantity);
        case 'set':
            return update.quantity;
        default:
            return currentQuantity;
    }
};

export const validateStockTransfer = (transfer: StockTransfer, availableStock: Stock[]): boolean => {
    const sourceStock = availableStock.find(
        stock => stock.location === transfer.fromLocation && stock.productId === transfer.productId
    );

    return sourceStock !== undefined && sourceStock.quantity >= transfer.quantity;
};

export const formatStockQuantity = (quantity: number, unit: string): string => {
    return `${quantity.toLocaleString()} ${unit}`;
};

export const getStockStatus = (quantity: number, minThreshold: number): 'low' | 'normal' | 'high' => {
    if (quantity <= minThreshold) return 'low';
    if (quantity >= minThreshold * 3) return 'high';
    return 'normal';
}; 