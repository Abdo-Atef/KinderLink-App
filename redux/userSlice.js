import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const loadUserToken = createAsyncThunk('user/loadUserToken', async () => {
  const token = await AsyncStorage.getItem('userToken')
  return token
})

const initialState = {
  userToken: null,
}


export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.userToken = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserToken.fulfilled, (state, action) => {
      state.userToken = action.payload
    })
  },
})

// Action creators are generated for each case reducer function
export const { setUserToken } = userSlice.actions

export default userSlice.reducer