import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "../../../types/LoadingStatus";

export interface DeliverySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isEnabled: boolean;
}

export interface ScheduledDelivery {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  deliveryDate: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface ScheduledDeliveryState {
  deliveries: ScheduledDelivery[];
  slots: DeliverySlot[];
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
  currentOperation: string | null;
}

const initialState: ScheduledDeliveryState = {
  deliveries: [],
  slots: [],
  status: 'idle',
  error: null,
  successMessage: null,
  currentOperation: null,
};

const scheduledDeliverySlice = createSlice({
  name: 'scheduledDelivery',
  initialState,
  reducers: {
    resetDeliveryState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
      state.currentOperation = null;
    },
    setDeliverySlots: (state, action: PayloadAction<DeliverySlot[]>) => {
      state.slots = action.payload;
    },
    updateDeliverySlot: (state, action: PayloadAction<DeliverySlot>) => {
      const index = state.slots.findIndex(slot => slot.id === action.payload.id);
      if (index !== -1) {
        state.slots[index] = action.payload;
      }
    },
  },
});

export const { 
  resetDeliveryState,
  setDeliverySlots,
  updateDeliverySlot,
} = scheduledDeliverySlice.actions;

export default scheduledDeliverySlice.reducer;
