import { useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect, useLayoutEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDoc, and, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, or, query, setDoc, updateDoc, where } from "firebase/firestore";

import { Wrapper } from "../components/Wrapper";
import { firebaseInit } from "../firebase/firebaseInit";
import { setCompanions } from "../redux/companionsSlice";
import { ChatInput } from "../components/ChatInput";
import { Loader } from "../components/Loader";
import { CustomChat } from "../components/CustomChat";

let x = 0;



export const ChatScreen = ({ navigation, route }) => {
	const { id: otherUserId, firstName, lastName, image } = route.params || {};
	const [messageText, setMessageText] = useState("");
	const [messages, setMessages] = useState([]);
	const [chatId, setChatId] = useState('');
	const [loading, setLoading] = useState(true);
	const { companionsData } = useSelector(state => state.companions);
	const { user } = useUser();
	const flatlistRef = useRef(null);
	const dispatch = useDispatch();
	const app = firebaseInit();
	const db = getFirestore(app);


	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitleAlign: "center",
			title: `${firstName} ${lastName}`,
		});
		
		const fetchChat = async () => {
			const q = query(collection(db, 'chats'), and(
				where("member1", "in", [`${user?.id}`, `${otherUserId}`]),			
				where("member2", "in", [`${otherUserId}`, `${user?.id}`]),			
			))
			const chatSnapshot = await getDocs(q);
			chatSnapshot.empty && setLoading(false);
			chatSnapshot.forEach(doc => {
				setChatId(doc.id);
			})
		}

		fetchChat();
	}, []);



	useEffect(() => {
		if (!chatId) return;

		const fetchMessages = async () => {
			onSnapshot(doc(db, `chats/${chatId}`), async _doc => {
				const q = query(collection(db, 'messages'), where("chatId", "==", chatId));
				const messagesSnapshot = await getDocs(q);
				const messagesArr = messagesSnapshot.docs
					.map(doc => ({messageId: doc.id, ...doc.data()}))
					.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

				setMessages(messagesArr);		
			})
		}
		fetchMessages();

	}, [chatId])


	useEffect(() => {
		if (!messages.length) return;
		setLoading(false);

		messages.forEach(async message => {
			if (message.sender !== user?.id) {
				await updateDoc(doc(db, 'messages', message.messageId), {
					wasRead: true,
				})
				--x;
				// await updateDoc(doc(db, `chats/${chatId}`), {
				// 	unreadMessages: arrayRemove(x)
				// })
			}
		})
	}, [messages.length])


	const onSend = useCallback(async () => {
		if (!messageText) return;
		++x;
		if (chatId) {
			// write message only
			await addDoc(collection(db, 'messages'), {
				chatId,
				createdAt: new Date().toISOString(),
				sender: user?.id,
				text: messageText,
				wasRead: false
			})
			await updateDoc(doc(db, `chats/${chatId}`), {
				updatedAt: new Date().toISOString(),
				lastMessage: messageText,
				updatedBy: user?.id
			})
		} else {
			// create chat, get its id, then write a message
			const chatRef = await addDoc(collection(db, 'chats'), {
				member1: `${user?.id}`, 
				member2: `${otherUserId}`,
				updatedAt: new Date().toISOString(),
				lastMessage: messageText,
				updatedBy: user?.id
			})
			setChatId(chatRef.id);

			await addDoc(collection(db, 'messages'), {
				chatId: chatRef.id,
				createdAt: new Date().toISOString(),
				sender: user?.id,
				text: messageText,
				wasRead: false
			})
		}
		
		!companionsData[otherUserId] && dispatch(setCompanions({ otherUserId, otherUserData: route.params }))
		setMessageText('');
	}, [messageText]);



	return (
		<Wrapper>
			{
				loading ? <Loader /> : (
					<>
						<CustomChat 
							user={user}
							otherUserId={otherUserId}
							image={image}
							messages={messages}
							flatlistRef={flatlistRef}
							navigation={navigation}
						/>
						<ChatInput
							value={messageText}
							onChangeText={setMessageText}
							onPress={onSend}
						/>
					</>
				)
			}
		</Wrapper>
	);
};
