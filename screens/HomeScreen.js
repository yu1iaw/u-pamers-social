import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";
import { Searchbar, ActivityIndicator } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { useUser, useAuth } from "@clerk/clerk-expo";

import { Header } from "../components/Header";
import { UserCard } from "../components/UserCard";
import { ScrollUpButton } from "../components/ScrollUpButton";
import { PaperPortal } from "../components/PaperPortal";
import { Banner } from "../components/Banner";
import { EmptyList } from "../components/EmptyList";
import theme from "../constants";
import { ErrorView } from "../components/ErrorView";
import { firebaseInit } from "../firebase/firebaseInit";
import { child, get, getDatabase, off, onValue, ref, set } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { setStoredUsers } from "../redux/storedUsersSlice";
import { setChatData } from "../redux/chatSlice";
import { setMessages } from "../redux/messagesSlice";
import { useIsFocused } from "@react-navigation/native";

let initialUsers = [];
let sortedByLocation = [];
let sortedByAge = [];
let sortedByLocationAndAge = [];



export const HomeScreen = ({ navigation, route }) => {
	const [search, setSearch] = useState('');
	const [isBannerVisible, setIsBannerVisible] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [usersList, setUsersList] = useState([]);
	const [location, setLocation] = useState();
	const [age, setAge] = useState();
	const { chatData } = useSelector(state => state.chats);
	const { storedUsers } = useSelector(state => state.users);
	const flatListRef = useRef(null);
	const { isSignedIn, user, isLoaded } = useUser();
	const isFocused = useIsFocused();
	const dispatch = useDispatch();



	useEffect(() => {
		setLocation(route.params?.location);
		if (!route.params?.age.fromValue || !route.params?.age.toValue) {
			return setAge(undefined);
		}
		setAge(route.params?.age);
	}, [route.params]);



	useEffect(() => {
		let timerId;

		if (location && !age) {
			sortedByLocation = initialUsers.filter(item => item.city === location || item.country === location);
			setUsersList(sortedByLocation);
		}

		if (location && age) {
			sortedByLocationAndAge = initialUsers.filter(item => item.age >= age.fromValue && item.age <= age.toValue && (item.city === location || item.country === location));
			setUsersList(sortedByLocationAndAge);
		}

		if (!location && age) {
			sortedByAge = initialUsers.filter(item => item.age >= age.fromValue && item.age <= age.toValue);
			setUsersList(sortedByAge);
		}


		if (!location && !age) {
			setUsersList(initialUsers);
		}

		if (search && location && !age) {
			timerId = setTimeout(() => {
				setUsersList(sortedByLocation.filter(item => item.firstName.startsWith(search) || item.lastName.startsWith(search)));
			}, 500)
		}

		if (search && !location && age) {
			timerId = setTimeout(() => {
				setUsersList(sortedByAge.filter(item => item.firstName.startsWith(search) || item.lastName.startsWith(search)));
			}, 500)
		}

		if (search && location && age) {
			timerId = setTimeout(() => {
				setUsersList(sortedByLocationAndAge.filter(item => item.firstName.startsWith(search) || item.lastName.startsWith(search)));
			}, 500)
		}

		if (search && !location && !age) {
			timerId = setTimeout(() => {
				setUsersList(initialUsers.filter(item => item.firstName.startsWith(search) || item.lastName.startsWith(search)));
			}, 500)
		}

		if (!search && !location && !age) {
			setUsersList(initialUsers);
		}



		return () => {
			clearTimeout(timerId);
		}

	}, [location, age, search])



	useEffect(() => {
		if (!user?.id) return;

		const app = firebaseInit();
        const dbRef = ref(getDatabase(app));
        const userChatRef = child(dbRef, `userChats/${user?.id}`);
        const refs = [userChatRef];

        onValue(userChatRef, querySnapshot => {
            const chatIdsData = querySnapshot.val() || {};
            const chatIds = Object.values(chatIdsData);

            const chatData = {};
            let chatsFoundCount = 0;

            for (let i = 0; i < chatIds.length; i++) {
                const chatId = chatIds[i];
                const chatRef = child(dbRef, `chats/${chatId}`);
                refs.push(chatRef);

                onValue(chatRef, chatSnapshot => {
                    chatsFoundCount++;
                    const data = chatSnapshot.val();
    

                    if (data) {
                        data.key = chatSnapshot.key;

                        data.users.forEach(userId => {
                            if (storedUsers[userId]) return;

                            const userRef = child(dbRef, `users/${userId}`);
                            get(userRef)
                                .then(userSnapshot => {
                                    const userSnap = userSnapshot.val();
                                    dispatch(setStoredUsers({ user: userSnap }))
                                })

                            refs.push(userRef)
                        })
                        chatData[chatSnapshot.key] = data;
                    }

                    if (chatsFoundCount >= chatIds.length) {
                        dispatch(setChatData({ chatData }))
                    }
                })

                const messagesRef = child(dbRef, `messages/${chatId}`);
                refs.push(messagesRef);

                onValue(messagesRef, messagesSnapshot => {
                    const messages = messagesSnapshot.val();
                    dispatch(setMessages({ chatId, messages }))
                    
                })
            }

        })

		return () => {
			refs.forEach(ref => off(ref))
		}
		
	}, [user?.id]);


	useEffect(() => {
		if (!user?.id) return;

		const getUsersList = async () => {
			try {
				const app = firebaseInit();
				const dbRef = ref(getDatabase(app));
				const usersRef = child(dbRef, `users`);
	
				onValue(usersRef, snapshot => {
					const usersObj = snapshot.val();
					delete usersObj[user?.id];
					const chats = Object.values(chatData);
					const usersData = Object.values(usersObj);

					const users = usersData.map((user) => {
						const filteredChat = chats.filter(chat => chat.users.includes(user.userId));
						if (filteredChat.length) {
							user.chatId = filteredChat[0].key;
						}
						return user;
					})

					setUsersList(users);
					initialUsers = users;
					setLoading(false);
				})
			} catch (e) {
				console.log(e);
				setError(e.message);
				setLoading(false);
			}
		};

		getUsersList();
	}, [user?.id, chatData])


	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			const getUsers = async () => {
				const app = firebaseInit();
				const dbRef = ref(getDatabase(app));
				const usersRef = child(dbRef, `users`);
				const usersSnapshot = await get(usersRef);
				const res = usersSnapshot.val();
				const users = Object.values(res);
				setUsersList(users);
				initialUsers = users;
				setLoading(false);
			}
	
			getUsers();
		}
	}, [isLoaded, isSignedIn])
		


	const handlePress = async () => {
		flatListRef.current.scrollToIndex({ index: 0 });
	};


	return (
		error ? <ErrorView /> : 
		<>
			<Header isSignedIn={isSignedIn} />
			{isBannerVisible && <Banner setIsBannerVisible={setIsBannerVisible} isSignedIn={isSignedIn} />}
			{loading ? (
				<View style={tw`flex-1 items-center justify-center`}>
					<ActivityIndicator size={49} color="#0078ff" />
				</View>
			) : (
				<>
					<View style={tw`bg-white pb-5 px-3 shadow`}>
						<View style={tw`pt-5 flex-row items-center gap-x-3`}>
							<Searchbar 
								placeholder="Search by name" 
								value={search}
								onChangeText={setSearch}
								style={tw`flex-1 bg-white pr-3 border border-[#A5A8BA] rounded-lg`} 
							/>
							<TouchableOpacity
								onPress={() => navigation.openDrawer()}
								style={tw`bg-white w-[52px] h-[56px] items-center justify-center border-2 border-[${theme.btn}] rounded-lg`}>
								<AntDesign name="filter" size={24} color={theme.btn} />
							</TouchableOpacity>
						</View>
						<View style={tw`flex-row w-full gap-x-3`}>
							{!!location && (	
								<TouchableOpacity 
									onPress={() => setLocation(undefined)}
									style={tw`bg-[#EBEEFF] max-w-[55%] flex-row items-center mt-4 gap-x-1 px-3 py-2 border border-[${theme.btn}] rounded-full`}
								>
									<Text numberOfLines={1} style={tw.style(`text-base max-w-[90%]`, { fontFamily: "i_medium", color: theme.pr_text })}>{location}</Text>
									<AntDesign name="close" size={18} color={theme.pr_text} style={tw`pt-0.5`} />
								</TouchableOpacity>
							)}
							{!!age && (
								<TouchableOpacity 
									onPress={() => setAge(undefined)}
									style={tw`bg-[#EBEEFF] max-w-[45%] flex-row items-center mt-4 gap-x-1 px-3 py-2 border border-[${theme.btn}] rounded-full`}
								>
									<Text numberOfLines={1} style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.pr_text })}>{age.fromValue} - {age.toValue} years</Text>
									<AntDesign name="close" size={18} color={theme.pr_text} style={tw`pt-0.5`} />
								</TouchableOpacity>
							)}
						</View>
					</View>
					<FlatList
						ref={(ref) => (flatListRef.current = ref)}
						contentContainerStyle={tw`gap-y-3 px-2 py-3`}
						showsVerticalScrollIndicator={false}
						initialNumToRender={20}
						maxToRenderPerBatch={20}
						updateCellsBatchingPeriod={20}
						getItemLayout={(data, index) => ({ length: 120, offset: 120 * index, index })}
						data={usersList}
						renderItem={({ item, index }) => {
							return <UserCard user={item} isSignedIn={isSignedIn} onPress={setShowModal} />}
						}
						keyExtractor={(item) => item.userId}
						ListEmptyComponent={<EmptyList />}
					/>
					<PaperPortal showModal={showModal} setShowModal={setShowModal} />
					{usersList?.length > 0 && <ScrollUpButton onPress={handlePress} />}
				</>
			)}
		</>
	);
};
