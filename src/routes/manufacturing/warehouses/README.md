# Warehouses Module

This module handles warehouse management functionality within the manufacturing section.

## Directory Structure

```
warehouses/
├── components/     # Reusable UI components
├── services/      # API and business logic
├── types/         # TypeScript definitions
└── utils/         # Utility functions
```

## Components

- `WarehouseList.tsx`: List view of warehouses
- `WarehouseForm.tsx`: Form for creating/editing warehouses
- `WarehouseDetails.tsx`: Detailed view of a warehouse
- `StorageCapacity.tsx`: Storage capacity visualization

## Services

- `warehouse-service.ts`: API calls for warehouse operations
- `storage-service.ts`: Storage-related operations

## Types

- `Warehouse.ts`: Warehouse interface
- `StorageCapacity.ts`: Storage capacity types
- `WarehouseLocation.ts`: Location information types

## Utils

- `capacity-calculator.ts`: Storage capacity calculations
- `location-utils.ts`: Location-related helper functions

## Usage

1. Import components from the components directory
2. Use services for data operations
3. Follow the established patterns for state management

## Best Practices

1. Keep components small and focused
2. Use TypeScript types from the types directory
3. Implement proper error handling in services
4. Follow the established naming conventions
5. Document complex business logic
