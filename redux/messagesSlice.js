import { createSlice } from "@reduxjs/toolkit";


const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        messagesData: {},
    },
    reducers: {
        setMessages: (state, action) => {
            const existingMessages = state.messagesData;
            const { chatId, messages } = action.payload;

            existingMessages[chatId] = messages;
            state.messagesData = existingMessages;

            // console.log(state.messagesData)
        }
    }
})

export const { setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;