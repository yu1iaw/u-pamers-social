import { child, getDatabase, push, ref, update } from "firebase/database";

import { firebaseInit } from "./firebaseInit";


const app = firebaseInit();
const dbRef = ref(getDatabase(app));



export const createChat = async (loggedInUserId, chatData) => {
    const newChatData = {
        ...chatData,
        createdBy: loggedInUserId,
        updatedBy: loggedInUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const newChat = await push(child(dbRef, 'chats'), newChatData);

    const chatUsers = newChatData.users;
    for (let i = 0; i < chatUsers.length; i++) {
        const userId = chatUsers[i];
        await push(child(dbRef, `userChats/${userId}`), newChat.key)
    };

    return newChat.key
}

export const createMessage = async (chatId, senderId, messageText) => {
    const messagesRef = child(dbRef, `messages/${chatId}`);

    const message = {
        sentBy: senderId,
        createdAt: new Date().toISOString(),
        text: messageText
    };

    await push(messagesRef, message);

    const chatRef = child(dbRef, `chats/${chatId}`);
    await update(chatRef, {
        updatedBy: senderId,
        updatedAt: new Date().toISOString(),
        latestMessageText: messageText
    })
}