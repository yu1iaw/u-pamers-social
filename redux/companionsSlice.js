import { createSlice } from "@reduxjs/toolkit";

const companionsSlice = createSlice({
    name: "companions",
    initialState: {
        companionsData: {}
    },
    reducers: {
        setCompanions: (state, action) => {
            const { otherUserId, otherUserData } = action.payload;

            const newCompanion = {...state.companionsData[otherUserId], ...otherUserData};
            const newState = {...state.companionsData};
            newState[otherUserId] = newCompanion;

            state.companionsData = newState;

            // console.log(state.companionsData)
        }
    }
})

export const { setCompanions } = companionsSlice.actions;
export default companionsSlice.reducer;

