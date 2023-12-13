import { configureStore } from '@reduxjs/toolkit';

import personalSlice from './personalSlice';
import companionsSlice from './companionsSlice';



export const store = configureStore({
    reducer: {
        personalInfo: personalSlice,
        companions: companionsSlice,
    }
})