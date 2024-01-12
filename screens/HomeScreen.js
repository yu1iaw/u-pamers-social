import { useEffect, useRef, useState, useCallback } from "react";
import { FlatList, View } from "react-native";
import tw from "twrnc";
import { useUser } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { arrayRemove, collection, getDocs, getFirestore, or, query, updateDoc, where, doc, onSnapshot } from "firebase/firestore";

import { Header } from "../components/Header";
import { UserCard } from "../components/UserCard";
import { ScrollUpButton } from "../components/ScrollUpButton";
import { PaperPortal } from "../components/PaperPortal";
import { Banner } from "../components/Banner";
import { MainSearchbar } from "../components/MainSearchbar";
import { Chip } from "../components/Chip";
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
		if (!user?.id) return;

		const app = firebaseInit();
		const db = getFirestore(app);
		const unsubscribe = onSnapshot(query(collection(db, 'auths')), (snapshot) => {
			snapshot.docChanges().forEach(async change => {
				if (change.type === "modified") {
					const {token} = change.doc.data();

					const q = query(collection(db, 'chats'), or(
						where("member1", "==", `${user?.id}`),			
						where("member2", "==", `${user?.id}`),			
						))
					const chatsSnapshot = await getDocs(q);
					const usersRef = collection(db, `users`);
					const usersSnapshot = await getDocs(usersRef);
						
					let index;
					const isUpdatedUserInChats = chatsSnapshot.docs.find(doc => doc.data().member1 === change.doc.id || doc.data().member2 === change.doc.id);
					const secondAccount = usersSnapshot.docs.find(doc => {
						if (doc.id !== change.doc.id && doc.data().pushTokens?.indexOf(token) >= 0) {
							index = doc.data().pushTokens?.indexOf(token);
							return doc;
						}
					});

					if (isUpdatedUserInChats) {
						const firstUser = usersSnapshot.docs.find(doc => doc.id === change.doc.id && doc.id !== user?.id);
						if (firstUser) {
							dispatch(setCompanions({ otherUserId: firstUser.id, otherUserData: firstUser.data() }))
						}
		
						if (secondAccount) {
							const userRef = doc(usersRef, `${secondAccount.id}`);
								await updateDoc(userRef, {
									pushTokens: arrayRemove(token)
								})
							
							const isAnotherUpdatedUserInChats = chatsSnapshot.docs.find(doc => doc.data().member1 === secondAccount.id || doc.data().member2 === secondAccount.id);
							if (isAnotherUpdatedUserInChats) {
								const secondUser = JSON.parse(JSON.stringify(secondAccount.data()));
								secondUser.pushTokens?.splice(index, 1);
								dispatch(setCompanions({ otherUserId: secondAccount.id, otherUserData: secondUser }))
							}
						} else if (!secondAccount && firstUser) {
							const usersRef = collection(db, `users`);
							const usersSnapshot = await getDocs(usersRef);

							const q = query(collection(db, 'chats'), or(
								where("member1", "==", `${user?.id}`),			
								where("member2", "==", `${user?.id}`),			
								))
							const chatsSnapshot = await getDocs(q);

							usersSnapshot.forEach(document => {
								chatsSnapshot.forEach(chat => {
									if (document.id !== user?.id && document.id === chat.data().member1 || document.id !== user?.id && document.id === chat.data().member2) {
										dispatch(setCompanions({ otherUserId: document.id, otherUserData: document.data() }))
									}
								})
							});
						}
					} else if (secondAccount) {
						const isAnotherUpdatedUserInChats = chatsSnapshot.docs.find(doc => doc.data().member1 === secondAccount.id || doc.data().member2 === secondAccount.id);
						if (isAnotherUpdatedUserInChats) {
							const secondUser = JSON.parse(JSON.stringify(secondAccount.data()));
							secondUser.pushTokens?.splice(index, 1);
							dispatch(setCompanions({ otherUserId: secondAccount.id, otherUserData: secondUser }))
						}
					}
				}
			})
		})

		return () => {
			unsubscribe();
		}
	}, [user?.id])


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
		
				usersSnapshot.forEach(document => {
					if (document.id === user?.id) {
						dispatch(setPersonalData(document.data()))
					}
					
					chatsSnapshot.forEach(chat => {
						if (document.id !== user?.id && document.id === chat.data().member1 || document.id !== user?.id && document.id === chat.data().member2) {
							dispatch(setCompanions({ otherUserId: document.id, otherUserData: document.data() }))
						}
					})

					data.push({...document.data()})
				});

				const users = data.filter(item => item.id !== user?.id);

				setUsersList(users);
				setError('');
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

	const handleLocationChipPress = useCallback(() => {
		setLocation(undefined);
	}, [])

	const handleAgeChipPress = useCallback(() => {
		setAge(undefined);
	}, [])


	return (
		error ? <ErrorView /> : 
		<>
			<Header isSignedIn={isSignedIn} />
			{isBannerVisible && <Banner setIsBannerVisible={setIsBannerVisible} isSignedIn={isSignedIn} />}
			{loading ? <Loader /> : (
				<>
					<View style={tw`bg-white pb-5 px-3 shadow`}>
						<MainSearchbar 
							value={search}
							onChangeText={setSearch}
							navigation={navigation}
						/>
						<View style={tw`flex-row w-full gap-x-3`}>
							{!!location && (	
								<Chip
									onPress={handleLocationChipPress} 
									buttonStyle={`bg-[#EBEEFF] max-w-[55%] flex-row items-center mt-4 gap-x-1 px-3 py-2 border border-[${theme.btn}] rounded-full`}
									textStyle={`text-base max-w-[90%] text-[${theme.pr_text}]`}
									fontFamily='i_medium'
									text={location}
									mainChip
								/>
							)}
							{!!age && (
								<Chip 
									onPress={handleAgeChipPress}
									buttonStyle={`bg-[#EBEEFF] max-w-[45%] flex-row items-center mt-4 gap-x-1 px-3 py-2 border border-[${theme.btn}] rounded-full`}
									textStyle={`text-base text-[${theme.pr_text}]`}
									fontFamily='i_medium'
									text={`${age.fromValue} - ${age.toValue} years`}
									mainChip
								/>
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
