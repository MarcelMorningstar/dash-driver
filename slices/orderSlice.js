import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderToken: null,
  orderInformation: null,
  customerInformation: null,
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderToken: (state, action) => {
      state.orderToken = action.payload;
    },
    setOrderInformation: (state, action) => {
      state.orderInformation = action.payload;
    },
    setCustomerInformation: (state, action) => {
      state.customerInformation = action.payload;
    },
  }
})

export const { setOrderToken, setOrderInformation, setCustomerInformation } = orderSlice.actions

export const selectOrderToken = (state) => state.order.orderToken
export const selectOrderInformation = (state) => state.order.orderInformation
export const selectCustomerInformation = (state) => state.order.customerInformation

export default orderSlice.reducer