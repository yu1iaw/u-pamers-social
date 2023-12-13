import { createSlice } from "@reduxjs/toolkit";


const personalSlice = createSlice({
    name: "personalInfo",
    initialState: {
        personalData: {}
    },
    reducers: {
        setPersonalData: (state, action) => {
            const newObj = {...state.personalData, ...action.payload};
            if (!state.personalData.privacy || !action.payload.privacy) {
                state.personalData = newObj;
                // console.log(state.personalData)
                return;
            }
            const nestedObj = {...state.personalData.privacy, ...action.payload.privacy};
            newObj.privacy = nestedObj;
            state.personalData = newObj;
            // console.log(state.personalData);
        }
    }
})

export const { setPersonalData } = personalSlice.actions;
export default personalSlice.reducer;