import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/apis";

export const getEmployeeData = createAsyncThunk(
  "user/getEmployeeData",
  async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.get(
        `${BASE_URL}/employees/employeeProfile`,
        {
          headers,
        }
      );
      return data.employee;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getParentsApologies = createAsyncThunk(
  "user/getParentsApologies",
  async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.get(
        `${BASE_URL}/employees/aplogizesForBusSupervisor/getAplogizesForBusSupervisorByFilter`,
        {
          headers,
        }
      );
      console.log(data);
      // return data.apologizes;
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  employeeData: null,
  parentsApologies: [],
  isLoading: false,
  apologiesLoading: false,
};

export const employeeSlice = createSlice({
  name: "parent",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getEmployeeData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getEmployeeData.fulfilled, (state, action) => {
      state.employeeData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getEmployeeData.rejected, (state, action) => {
      state.isLoading = false;
    });
    /* ------------------------------ apologies ------------------------------ */
    builder.addCase(getParentsApologies.pending, (state) => {
      state.apologiesLoading = true;
    });
    builder.addCase(getParentsApologies.fulfilled, (state, action) => {
      state.parentsApologies = action.payload;
      state.apologiesLoading = false;
    });
  },
});

export default employeeSlice.reducer;
