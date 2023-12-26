import { useEffect, useRef, useState, useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";
import { Searchbar } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { useUser } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { collection, getDocs, getFirestore, or, query, where } from "firebase/firestore";

import { Header } from "../components/Header";
import { UserCard } from "../components/UserCard";
import { ScrollUpButton } from "../components/ScrollUpButton";
import { PaperPortal } from "../components/PaperPortal";
import { Banner } from "../components/Banner";
import { EmptyList } from "../components/EmptyList";
import { ErrorView } from "../components/ErrorView";
import { Loader } from "../components/Loader";
import { firebaseInit } from "../firebase/firebaseInit";
import { setCompanions } from "../redux/companionsSlice";
import { setPersonalData } from "../redux/personalSlice";
import theme from "../constants";

let initialUsers = [];
let sortedByLocation = [];
let sortedByAge = [];
let sortedByLocationAndAge = [];

// console.log(new Date().toLocaleString('en-UK', { hour12: false, weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }))



export const HomeScreen = ({ navigation, route }) => {
	const [search, setSearch] = useState('');
	const [isBannerVisible, setIsBannerVisible] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [usersList, setUsersList] = useState([]);
	const [location, setLocation] = useState();
	const [age, setAge] = useState();
	const flatListRef = useRef(null);
	const { isSignedIn, user, isLoaded } = useUser();
	const dispatch = useDispatch();


	useEffect(() => {
		setLocation(route.params?.location);
		if (!route.params?.age.fromValue || !route.params?.age.toValue) {
			return setAge(undefined);
		}
		setAge(route.params?.age);
	}, [route.params]);



	useEffect(() => {
		if (!search && !location && !age && !initialUsers.length) return;

		if (location && !age) {
			sortedByLocation = initialUsers.filter(item => {
				const isUserLocationEnabled = item.location && item.privacy?.location !== true;
				return isUserLocationEnabled && item.location?.includes(location);
			});
			setUsersList(sortedByLocation);
		}

		if (location && age) {
			sortedByLocationAndAge = initialUsers.filter(item => {
				const isUserLocationEnabled = item.location && item.privacy?.location !== true;
				const isUserAgeEnabled = item.age && item.privacy?.age !== true;
				return isUserAgeEnabled && item.age >= age.fromValue && isUserAgeEnabled && item.age <= age.toValue && isUserLocationEnabled && item.location?.includes(location);
			});
			setUsersList(sortedByLocationAndAge);
		}

		if (!location && age) {
			sortedByAge = initialUsers.filter(item => {
				const isUserAgeEnabled = item.age && item.privacy?.age !== true;
				return isUserAgeEnabled && item.age >= age.fromValue && isUserAgeEnabled && item.age <= age.toValue;
			});
			setUsersList(sortedByAge);
		}


		if (!location && !age) {
			setUsersList(initialUsers);
		}

		if (search && location && !age) {
			setUsersList(sortedByLocation.filter(item => item.firstLast.startsWith(search.toLowerCase()) || item.firstLast.split(' ').at(-1).startsWith(search.toLowerCase())));
		}

		if (search && !location && age) {
			setUsersList(sortedByAge.filter(item => item.firstLast.startsWith(search.toLowerCase()) || item.firstLast.split(' ').at(-1).startsWith(search.toLowerCase())));
		}

		if (search && location && age) {
			setUsersList(sortedByLocationAndAge.filter(item => item.firstLast.startsWith(search.toLowerCase()) || item.firstLast.split(' ').at(-1).startsWith(search.toLowerCase())));
		}

		if (search && !location && !age) {
			setUsersList(initialUsers.filter(item => item.firstLast.startsWith(search.toLowerCase()) || item.firstLast.split(' ').at(-1).startsWith(search.toLowerCase())));
		}

		if (!search && !location && !age) {
			setUsersList(initialUsers);
		}

	}, [location, age, search])



	useEffect(() => {
		if (!user?.id) return;

		const getUsers = async () => {
			try {
				const app = firebaseInit();
				const db = getFirestore(app);
				const usersRef = collection(db, `users`);
				const usersSnapshot = await getDocs(usersRef);
				const q = query(collection(db, 'chats'), or(
					where("member1", "==", `${user?.id}`),			
					where("member2", "==", `${user?.id}`),			
				))
				const chatsSnapshot = await getDocs(q);
	
				const data = [];
		
				usersSnapshot.forEach(doc => {
					if (doc.id === user?.id) {
						dispatch(setPersonalData(doc.data()))
					}
					chatsSnapshot.forEach(chat => {
						if (doc.id !== user?.id && doc.id === chat.data().member1 || doc.id !== user?.id && doc.id === chat.data().member2) {
							dispatch(setCompanions({ otherUserId: doc.id, otherUserData: doc.data() }))
						}
					})
	
					data.push({...doc.data()})
				});
				
				const users = data.filter(item => item.id !== user?.id);
				setUsersList(users);
				initialUsers = users;
			} catch (e) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		}

		getUsers();
	}, [user?.id]);



	useEffect(() => {
		if (isLoaded && !isSignedIn) {

			const getUsers = async () => {
				try {
					const app = firebaseInit();
					const db = getFirestore(app);
					const usersRef = collection(db, `users`);
					const usersSnapshot = await getDocs(usersRef);
					const data = [];
			
					usersSnapshot.forEach(doc => {
						data.push({...doc.data()})
					});
			
					setUsersList(data)
					initialUsers = data;
					setError('');
				} catch(e) {
					setError(e.message);
				} finally {
					setLoading(false);
				}
			}
			getUsers();
		}
	}, [isLoaded, isSignedIn])


		
	const handlePress = useCallback(() => {
		flatListRef.current?.scrollToIndex({ index: 0 });
	}, []);


	return (
		error ? <ErrorView /> : 
		<>
			<Header isSignedIn={isSignedIn} />
			{isBannerVisible && <Banner setIsBannerVisible={setIsBannerVisible} isSignedIn={isSignedIn} />}
			{loading ? <Loader /> : (
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
						keyExtractor={(item) => item.id}
						ListEmptyComponent={<EmptyList />}
					/>
					<PaperPortal showModal={showModal} setShowModal={setShowModal} />
					{usersList?.length > 0 && <ScrollUpButton onPress={handlePress} />}
				</>
			)}
		</>
	);
};
