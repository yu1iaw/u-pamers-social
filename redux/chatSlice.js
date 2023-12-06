import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name: "chats",
    initialState: {
        chatData: {},
    },
    reducers: {
        setChatData: (state, action) => {
            state.chatData = action.payload.chatData;
            // console.log(state.chatData)
        }
    }
})

export const { setChatData } = chatSlice.actions;
export default chatSlice.reducer;