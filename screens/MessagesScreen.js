import { useState, useEffect, useRef, useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import tw from "twrnc";
import { useUser } from "@clerk/clerk-expo";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";

import { Header } from "../components/Header";
import { Wrapper } from "../components/Wrapper";
import { ChatUserCard } from "../components/ChatUserCard";
import { ScrollUpButton } from "../components/ScrollUpButton";
import { FlatListHeader } from "../components/FlatListHeader";
import { EmptyList } from "../components/EmptyList";
import { firebaseInit } from "../firebase/firebaseInit";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { setCompanions } from "../redux/companionsSlice";

let initialChats = [];



export const MessagesScreen = () => {
	const [value, setValue] = useState("");
	const [chats, setChats] = useState([]);
	const { companionsData } = useSelector((state) => state.companions);
	const { isSignedIn, user } = useUser();
	const flatListRef = useRef(null);
	const isFocused = useIsFocused();
	const navigation = useNavigation();
	const dispatch = useDispatch();


	useEffect(() => {
		if (!isFocused) return;

		const getChats = async () => {
			const app = firebaseInit();
			const db = getFirestore(app);
			const usersRef = collection(db, `users`);
			const chatsRef = collection(db, `users/${user?.id}/chats`);
			const usersSnapshot = await getDocs(usersRef);
			const chatsSnapshot = await getDocs(chatsRef);

			const myChats = chatsSnapshot.docs
				.sort((a, b) => new Date(b.data().updatedAt) - new Date(a.data().updatedAt))
				.map((doc) => {
					// if (!companionsData[doc.id]) {
						const missingUser = usersSnapshot.docs.find((d) => d.id === doc.id);
						if (missingUser) {
							dispatch(setCompanions({ otherUserId: missingUser.id, otherUserData: missingUser.data() }));
						}
					// }
					return {id: doc.id, ...doc.data()};
				});

			setChats(myChats);
			initialChats = myChats;
		};
		getChats();
	}, [isFocused]);


    
	useEffect(() => {
		if (!value && initialChats.length) return setChats(initialChats);
		let timerId;

		if (value) {
			timerId = setTimeout(() => {
				setChats(
					initialChats.filter((chat) => {
						return companionsData[chat.id].firstName.startsWith(value) || companionsData[chat.id].lastName.startsWith(value);
					})
				);
			}, 500);
		}

		return () => {
			clearTimeout(timerId);
		};
	}, [value]);



	const handlePress = () => {
		flatListRef.current.scrollToIndex({ index: 0 });
	};


	return (
		<>
			<Header isSignedIn={isSignedIn} />
			<Wrapper>
				<FlatListHeader value={value} onChangeText={setValue} />
				<FlatList
					ListEmptyComponent={
						<EmptyList source={require("../assets/images/Box.png")} title="No messages found" subtitle="Start a new conversation with U-pamers" />
					}
					ref={(ref) => (flatListRef.current = ref)}
					showsVerticalScrollIndicator={false}
					data={chats}
					renderItem={({ item, index }) => {
						const otherUser = companionsData[item.id];
						const chatInfo = item.lastMessage;
						return (
							<ChatUserCard user={{ ...otherUser, chatInfo }} navigation={navigation} style={index == chats?.length - 1 ? "" : "border-b border-gray-300"} />
						);
					}}
				/>
				{chats?.length > 0 && <ScrollUpButton onPress={handlePress} />}
			</Wrapper>
		</>
	);
};
