import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/apis";

export const getProfileData = createAsyncThunk(
  "user/getProfileData",
  async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.get(`${BASE_URL}/childeren/getProfile`, {
        headers,
      });
      // console.log(data);
      return data.child;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getMyApologies = createAsyncThunk(
  "user/getMyApologies",
  async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.get(`${BASE_URL}/childeren/aplogizes/getAllApologizesForParent`, {
        headers,
      });
      // console.log(data);
      return data.apologizes;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllMeals = createAsyncThunk(
  "user/getAllMeals",
  async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.get(`${BASE_URL}/childeren/meals/getAllMealsOrGetByFilterForParent`, {
        headers,
      });
      // console.log(data);
      return data.meals;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getMyMeals = createAsyncThunk(
  "user/getMyMeals",
  async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const headers = {
      token: userToken,
    };
    try {
      const { data } = await axios.get(`${BASE_URL}/childeren/meals/getProfileMealsOfChildToParent`, {
        headers,
      });
      console.log(data.childProfileWithMeals.meals);
      return data.childProfileWithMeals.meals;
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  childData: null,
  myApologies:null,
  allMeals:null,
  myMeals:null,
  isLoading: false,
  apologiesLoading:false,
};

export const parentSlice = createSlice({
  name: "parent",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getProfileData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProfileData.fulfilled, (state, action) => {
      state.childData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getProfileData.rejected, (state, action) => {
      state.isLoading = false;
    });
    /* ------------------------------ apologies ------------------------------ */
    builder.addCase(getMyApologies.pending, (state) => {
      state.apologiesLoading = true;
    });
    builder.addCase(getMyApologies.fulfilled, (state, action) => {
      state.myApologies = action.payload;
      state.apologiesLoading = false;
    });
    /* ------------------------------All available meals ------------------------------ */
    builder.addCase(getAllMeals.fulfilled, (state, action) => {
      state.allMeals = action.payload;
    });
    /* ------------------------------my meals ------------------------------ */
    builder.addCase(getMyMeals.fulfilled, (state, action) => {
      state.myMeals = action.payload;
    });
  },
});

export default parentSlice.reducer;
