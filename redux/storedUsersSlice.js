import { createSlice } from "@reduxjs/toolkit";

const storedUsersSlice = createSlice({
    name: "users",
    initialState: {
        storedUsers: {}
    },
    reducers: {
        setStoredUsers: (state, action) => {
            const newUser = action.payload.user;
            const existingUsers = state.storedUsers;

            existingUsers[newUser.userId] = newUser;

            state.storedUsers = existingUsers;
            // console.log(state.storedUsers)
        }
    }
})

export const { setStoredUsers } = storedUsersSlice.actions;
export default storedUsersSlice.reducer;