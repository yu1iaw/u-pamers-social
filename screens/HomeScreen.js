import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";
import { Searchbar, ActivityIndicator } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { useUser, useAuth } from "@clerk/clerk-expo";

import { Header } from "../components/Header";
import { UserCard } from "../components/UserCard";
import { ScrollUpButton } from "./ScrollUpButton";
import { PaperPortal } from "../components/PaperPortal";
import { Banner } from "../components/Banner";
import { EmptyList } from "../components/EmptyList";
import theme from "../constants";
import { ErrorView } from "../components/ErrorView";

export const HomeScreen = ({ navigation }) => {
	const [isBannerVisible, setIsBannerVisible] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [usersList, setUsersList] = useState([]);
	const flatListRef = useRef(null);
	const { isSignedIn, user, isLoaded } = useUser();
	const { signOut } = useAuth();
	// console.log(user?.fullName)

	// useEffect(() => {
	// 	if (!user) return;

	// 	const updateUser = async () => {
	// 		await user.update({
	// 		  firstName: "John",
	// 		  lastName: "Doe",
	// 		});
	// 	  };
	// 	  updateUser();
	// }, [isLoaded])

	// useEffect(() => {
	// 	if (isLoaded) signOut();
	// }, [isLoaded])

	useEffect(() => {
		const getUsersList = async () => {
			setLoading(true);
			try {
				const usersData = await fetch("https://dummyjson.com/users?limit=0&select=firstName,lastName,age,image,address");
				const users = await usersData.json();
				setUsersList(users.users);
			} catch (e) {
				console.log(e);
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		getUsersList();
	}, []);


	const handlePress = async () => {
		flatListRef.current.scrollToIndex({ index: 0 });
		// user.reload();
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
					<View style={tw`bg-white py-5 px-3 flex-row items-center gap-x-3 shadow`}>
						<Searchbar placeholder="Search by name" style={tw`flex-1 bg-white pr-3 border border-[#A5A8BA] rounded-lg`} />
						<TouchableOpacity
							onPress={() => navigation.openDrawer()}
							style={tw`bg-white w-[52px] h-[56px] items-center justify-center border-2 border-[${theme.btn}] rounded-lg`}>
							<AntDesign name="filter" size={24} color={theme.btn} />
						</TouchableOpacity>
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
						renderItem={({ item }) => <UserCard user={item} isSignedIn={isSignedIn} onPress={setShowModal} />}
						keyExtractor={(item) => item.id}
						ListEmptyComponent={EmptyList}
					/>
					<PaperPortal showModal={showModal} setShowModal={setShowModal} />
					{usersList.length > 0 && <ScrollUpButton onPress={handlePress} />}
				</>
			)}
		</>
	);
};
