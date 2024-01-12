import { useState, useEffect, useRef, useCallback } from "react";
import { FlatList } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs, getFirestore, or, query, where } from "firebase/firestore";

import { Header } from "../components/Header";
import { Wrapper } from "../components/Wrapper";
import { ChatUserCard } from "../components/ChatUserCard";
import { ScrollUpButton } from "../components/ScrollUpButton";
import { FlatListHeader } from "../components/FlatListHeader";
import { EmptyList } from "../components/EmptyList";
import { firebaseInit } from "../firebase/firebaseInit";
import { setCompanions } from "../redux/companionsSlice";
import { Loader } from '../components/Loader';

let initialChats = [];



export const MessagesScreen = ({navigation}) => {
	const [value, setValue] = useState("");
	const [chats, setChats] = useState([]);
	const [loading, setLoading] = useState(true);
	const { companionsData } = useSelector((state) => state.companions);
	const { isSignedIn, user } = useUser();
	const flatListRef = useRef(null);
	const isFocused = useIsFocused();
	const dispatch = useDispatch();	


	useEffect(() => {
		if (!isFocused) return;

		const getChats = async () => {
			const app = firebaseInit();
			const db = getFirestore(app);
			const usersRef = collection(db, `users`);
			const usersSnapshot = await getDocs(usersRef);

			const q = query(collection(db, 'chats'), or(
				where("member1", "==", `${user?.id}`),			
				where("member2", "==", `${user?.id}`),			
			))
			const chatsSnapshot = await getDocs(q);

			const myChats = await Promise.all(chatsSnapshot.docs
				.sort((a, b) => new Date(b.data().updatedAt) - new Date(a.data().updatedAt))
				.map(async document => {
					const messagesSnapshot = await getDoc(doc(db, 'messages', document.id));
					const unreadMessages = messagesSnapshot.data().conversation.filter(message => message.sender !== user?.id && message.wasRead === false);
					
					const missingUser = usersSnapshot.docs.find(doc => doc.id !== user?.id && doc.id === document.data().member1 || doc.id !== user?.id && doc.id === document.data().member2);
	
					if (missingUser && !chats.length) {
						dispatch(setCompanions({ otherUserId: missingUser.id, otherUserData: missingUser.data() }));
					}
					return {...document.data(), companion: missingUser.id, unreadMessages: unreadMessages.length};
				}))
				setChats(myChats);
				initialChats = myChats;
				setLoading(false);
		};
		getChats();
	}, [isFocused]);


    
	useEffect(() => {
		if (!value && initialChats.length) {
			setLoading(false);
			return setChats(initialChats);
		};
		let timerId;

		if (value) {
			timerId = setTimeout(() => {
				setChats(
					initialChats.filter((chat) => {
						return companionsData[chat.companion].firstLast.startsWith(value.toLowerCase()) || companionsData[chat.companion].firstLast?.split(' ')?.at(-1).startsWith(value.toLowerCase());
					})
				);
			}, 500);
		}

		return () => {
			clearTimeout(timerId);
		};
	}, [value]);



	const handlePress = useCallback(() => {
		flatListRef.current?.scrollToIndex({ index: 0 });
	}, []);


	return (
		<>
			<Header isSignedIn={isSignedIn} />
			<Wrapper>
				{
					loading ? <Loader /> : (
						<>
							<FlatListHeader value={value} onChangeText={setValue} />
							<FlatList
								ListEmptyComponent={
									<EmptyList source={require("../assets/images/Box.png")} title="No messages found" subtitle="Start a new conversation with U-pamers" />
								}
								ref={(ref) => (flatListRef.current = ref)}
								showsVerticalScrollIndicator={false}
								data={chats}
								keyExtractor={chat => chat.updatedAt}
								renderItem={({ item, index }) => {
									const { id, firstName, lastName, image } = companionsData[item.companion];
									const chatInfo = item.lastMessage;
									const unreadMessages = item.unreadMessages;
									const updatedAt = item.updatedAt;
									return (
										<ChatUserCard 
											userId={id}
											firstName={firstName}
											lastName={lastName}
											image={image}
											chatInfo={chatInfo} 
											chatUpdatedAt={updatedAt}
											unreadMessagesIndicator={unreadMessages} 
											navigation={navigation} 
											style={index == chats?.length - 1 ? "" : "border-b border-gray-300"} 
										/>
									);
								}}
							/>
							{chats?.length > 0 && <ScrollUpButton onPress={handlePress} />}

						</>
					)
				}
			</Wrapper>
		</>
	);
};
