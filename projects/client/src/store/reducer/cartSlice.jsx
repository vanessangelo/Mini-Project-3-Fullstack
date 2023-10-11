import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: [] },
  reducers: {
    updateCart: (state, action) => { // get latest cart 
      state.cart = action.payload;
    },
    clearCart: (state) => { // clear 
      state.cart = [];
    },
  },
});

export const { updateCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
