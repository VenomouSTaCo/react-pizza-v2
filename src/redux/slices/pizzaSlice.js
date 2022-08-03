import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from "axios";

export const fetchPizzas = createAsyncThunk(
    'pizza/fetchPizzasStatus',
    async (params) => {
        const {sortBy, category, order, search, currentPage} = params
        const {data} = await axios.get(`https://62e373dbb54fc209b889514c.mockapi.io/items?page=${currentPage}&limit=4&category=${category}&sortBy=${sortBy}&order=${order}${search}`);
        return data;
    }
)

const initialState = {
    items: [],
    status: 'loading',
}


const pizzaSlice = createSlice({
    name: 'pizza',
    initialState,
    reducers: {
        setItems(state, action) {
            state.items = action.payload;
        },
    },
    extraReducers: {
        [fetchPizzas.pending]: (state) => {
            state.status = 'loading';
            state.items = [];
        },
        [fetchPizzas.fulfilled]: (state, action) => {
            console.log(action, 'fulfilled');
            state.items = action.payload;
            state.status = 'success';
        },
        [fetchPizzas.rejected]: (state, action) => {
            console.log(action, 'rejected');
            state.status = 'error';
            state.items = [];
        },
    },
});


export const {setItems} = pizzaSlice.actions;

export default pizzaSlice.reducer;