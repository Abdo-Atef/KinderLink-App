import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import parentSlice from './parentSlice'
import employeeSlice from './employeeSlice'

export const store = configureStore({
  reducer: {
    user:userSlice,
    parentProfile:parentSlice,
    employee:employeeSlice,
  },
})