# Stocks Module

This module handles all stock-related functionality in the manufacturing section of the application.

## Directory Structure

```
stocks/
├── components/         # Reusable UI components specific to stocks
├── pages/             # Page components for different stock operations
├── services/          # API and business logic services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions and helpers
```

## Components

- `StocksTable.tsx`: Main table component for displaying stock information
- `UpdateStockDialog.tsx`: Dialog for updating stock quantities
- `ProductItem.tsx`: Component for displaying individual product items

## Pages

- `StocksPage.tsx`: Main stocks overview page
- `RestockPage.tsx`: Page for restocking products
- `ProcessProductsPage.tsx`: Page for processing products
- `SelectProductsPage.tsx`: Page for selecting products
- `TransferStockPage.tsx`: Page for transferring stock between locations

## Services

- `stock-helpers.ts`: Helper functions for stock operations
- `models.ts`: Data models and interfaces

## Usage

Each page component should:

1. Import necessary components from the components directory
2. Use services for data operations
3. Follow the established patterns for state management and data flow

## Best Practices

1. Keep components small and focused on a single responsibility
2. Use TypeScript types from the types directory
3. Implement proper error handling in services
4. Follow the established naming conventions
5. Document complex business logic
