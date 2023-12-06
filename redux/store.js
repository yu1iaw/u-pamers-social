import { configureStore } from '@reduxjs/toolkit';

import chatSlice from './chatSlice';
import messagesSlice from './messagesSlice';
import storedUsersSlice from './storedUsersSlice';



export const store = configureStore({
    reducer: {
        chats: chatSlice,
        users: storedUsersSlice,
        messages: messagesSlice
    }
})