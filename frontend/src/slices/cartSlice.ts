import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.productId !== action.payload);
    },
    clearCart: (state) => { state.items = []; },
  },
});

export const { setCartItems, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
