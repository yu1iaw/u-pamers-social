import { useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect, useLayoutEffect, useState, useRef } from "react";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { Wrapper } from "../components/Wrapper";
import { Input } from '../components/Input';
import { createChat, createMessage } from "../firebase/chatActions";
import { MessageBubble } from "../components/MessageBubble";
import theme from "../constants";



export const ChatScreen = ({ navigation, route }) => {
	const { userId: otherUserId, firstName, lastName, age, address, image } = route.params || {};
	const [messageText, setMessageText] = useState("");
	const [messages, setMessages] = useState([]);
	const [chatId, setChatId] = useState(route.params?.chatId);
	const { user } = useUser();
	const { messagesData } = useSelector((state) => state.messages);
	const flatlistRef = useRef(null);


	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitleAlign: "center",
			title: `${firstName} ${lastName}`,
		});
		
	}, []);


	useEffect(() => {
			if (!chatId) return;

			const chatMessages = Object.entries(messagesData[chatId]).reduce((acc, [key, message]) => {
				acc.push({
					key,
					...message,
				});
				return acc;
			}, []);
			setMessages(chatMessages);
	}, [messagesData])


	const onSend = useCallback(async () => {
		if (!messageText) return;

		try {
			let id = chatId;
			if (!id) {
				const chatData = {
					users: [user?.id, otherUserId],
				};
				id = await createChat(user?.id, chatData);
				setChatId(id);
			}
			await createMessage(id, user?.id, messageText);
		} catch (e) {
			console.log(e);
		}
		setMessageText('');
	}, [messageText, chatId]);

	

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
							const isMyOwn = item.sentBy === user?.id;
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
