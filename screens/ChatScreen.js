import { useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect, useLayoutEffect, useState, useRef } from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addDoc, collection, doc, getDocs, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";


import { Wrapper } from "../components/Wrapper";
import { Input } from '../components/Input';
import { createChat, createMessage } from "../firebase/chatActions";
import { MessageBubble } from "../components/MessageBubble";
import theme from "../constants";
import { firebaseInit } from "../firebase/firebaseInit";
import { setCompanions } from "../redux/companionsSlice";



export const ChatScreen = ({ navigation, route }) => {
	const { id: otherUserId, firstName, lastName, image } = route.params || {};
	const [messageText, setMessageText] = useState("");
	const [messages, setMessages] = useState([]);
	const { companionsData } = useSelector(state => state.companions);
	const { user } = useUser();
	const flatlistRef = useRef(null);
	const dispatch = useDispatch();

	// console.log(route.params)


	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitleAlign: "center",
			title: `${firstName} ${lastName}`,
		});
		
	}, []);



	useEffect(() => {
		if (messageText) return;

		const app = firebaseInit();
		const db = getFirestore(app);
		onSnapshot(doc(db, `users/${user?.id}/chats/${otherUserId}`), async doc => {
			const myMessagesRef = collection(db, `users/${user?.id}/chats/${otherUserId}/messages`);
			const yourMessagesRef = collection(db, `users/${otherUserId}/chats/${user?.id}/messages`);
			const snapshot = await getDocs(myMessagesRef);
			const yourSnapshot = await getDocs(yourMessagesRef);
			const response = await Promise.all([snapshot, yourSnapshot]);
			const messagesArr = [];
			response.forEach(docs => docs.forEach((doc) => {
				messagesArr.push(doc.data())
			}))

			setMessages(messagesArr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
		})

	}, [messageText])


	const onSend = useCallback(async () => {
		if (!messageText) return;

		const app = firebaseInit();
		const db = getFirestore(app);
		const chatRef = doc(db, `users/${user?.id}/chats/${otherUserId}`);
		const yourChatRef = doc(db, `users/${otherUserId}/chats/${user?.id}`);
		await setDoc(chatRef, { updatedAt: new Date().toISOString(), lastMessage: messageText });
		await setDoc(yourChatRef, { updatedAt: new Date().toISOString(), lastMessage: messageText });

		const messagesRef = await addDoc(collection(db, `users/${user?.id}/chats/${otherUserId}/messages`), {
			createdAt: new Date().toISOString(),
			sender: user?.id,
			text: messageText
		})
		// console.log(messagesRef.id)
		
		!companionsData[otherUserId] && dispatch(setCompanions({ otherUserId, otherUserData: route.params }))
		setMessageText('');
	}, [messageText]);

	

	return (
		<Wrapper>
			<View style={tw`flex-1`}>
				{!messages.length ? (
					<MessageBubble type={"system"} message={{text: "Write your first message"}} />
				) : (
					<FlatList 
						ref={ref => flatlistRef.current = ref}
						data={messages}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={tw`pt-1 pb-3`}
						onContentSizeChange={() => flatlistRef.current.scrollToEnd({ animated: false })}
						onLayout={() => flatlistRef.current.scrollToEnd({ animated: false })}
						renderItem={({item}) => {
							const isMyOwn = item.sender === user?.id;
							const type = isMyOwn ? "myOwn" : "notMine";
							return <MessageBubble type={type} message={{...item, image}} />
						}}
					/>
				)}
			</View>
			<View style={tw`flex-row items-center py-4`}>
				<Input 
					value={messageText}
					onChangeText={(txt) => setMessageText(txt)}
					style={`flex-1`} 
				/>
				<TouchableOpacity onPress={onSend} style={tw`pl-4 py-2`}>
					<Ionicons name="send" size={24} color={messageText ? theme.btn : theme.disabled} />
				</TouchableOpacity>
			</View>
		</Wrapper>
	);
};
