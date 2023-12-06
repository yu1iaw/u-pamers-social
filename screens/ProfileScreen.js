import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import { firebaseInit } from "../firebase/firebaseInit";
import { child, getDatabase, ref, update } from "firebase/database";

import { Banner } from "../components/Banner";
import { Header } from "../components/Header";
import { Wrapper } from "../components/Wrapper";
import { PaperButton } from "../components/PaperButton";
import { socials } from "../data";
import theme from "../constants";



export const ProfileScreen = ({ navigation, route }) => {
	const [isBannerVisible, setIsBannerVisible] = useState(true);
	const { tabs, firstName, lastName, city, country, image, socialMedia, userId, chatId } = route.params;
	const { isSignedIn, user } = useUser();
	const Container = tabs ? TouchableOpacity : View;
    const imageSource = image ?? 'https://shorturl.at/dADKQ';


	useEffect(() => {
		const updateUser = async () => {
			const app = firebaseInit();
			const dbRef = ref(getDatabase(app));
			const childRef = child(dbRef, `users/${user?.id}`);
			await update(childRef, {
				image: user?.imageUrl
			})

		}
		updateUser();
	}, [user?.imageUrl])


	useEffect(() => {
		const updateUser = async () => {
			const app = firebaseInit();
			const dbRef = ref(getDatabase(app));
			const childRef = child(dbRef, `users/${user?.id}`);
	
			await update(childRef, {
				firstName: user?.firstName,
				lastName: user?.lastName
			})
		}

		updateUser();
	}, [user?.firstName, user?.lastName])


	const onCaptureImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 0.75,
			base64: true,
		});

		if (!result.canceled) {
			const base64 = `data:image/png;base64,${result.assets[0].base64}`;
			user?.setProfileImage({
				file: base64,
			});
		}
	};

	return (
		<>
			<Header isSignedIn={isSignedIn} />
			{tabs && isBannerVisible && <Banner setIsBannerVisible={setIsBannerVisible} isSignedIn={isSignedIn} />}
			<Wrapper>
				<TouchableOpacity onPress={navigation.goBack} style={tw`flex-row gap-x-2 items-center py-4`}>
					<Ionicons name="chevron-back" size={24} color={theme.sec_btn} />
					<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_btn })}>Catalogue</Text>
				</TouchableOpacity>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text style={tw.style(`text-2xl my-4`, { fontFamily: "i_bold", color: theme.accent })}>My profile</Text>
					<View style={tw`h-[56px] bg-[#9AA0FE] rounded-t-xl`} />
					<View style={tw`items-center`}>
						<Container onPress={onCaptureImage} style={tw.style(`bg-white rounded-full shadow -mt-10 mb-5`)}>
							<Image source={{ uri: tabs ? user?.imageUrl : imageSource }} style={tw`w-[96px] h-[96px] rounded-full`} />
							{tabs && (
								<View style={tw`absolute bottom-0 right-0 bg-[${theme.btn}] p-2 rounded-lg`}>
									<Feather name="edit-2" size={16} color="white" />
								</View>
							)}
						</Container>
						<Text style={tw.style(`text-2xl capitalize`, { fontFamily: "i_bold", color: theme.pr_text })}>
							{tabs ? user?.fullName : `${firstName} ${lastName}`}
						</Text>
						<Text style={tw.style(`text-sm capitalize`, { fontFamily: "i_medium", color: theme.sec_text })}>
							{tabs ? "Country, City" : `${country}, ${city}`}
						</Text>
						<View style={tw`flex-row gap-x-2 mt-2`}>
							{socialMedia?.length > 0 &&
								socialMedia.map((item, i) => (
									<TouchableOpacity key={i}>
										<Image source={socials[item]} />
									</TouchableOpacity>
								))}
						</View>
						{tabs ? (
							<PaperButton style="w-full my-8" title="Edit Profile" onPress={() => navigation.navigate("Settings")} />
						) : (
							<PaperButton style="w-full my-8" title="Message" filled onPress={() => navigation.navigate("Chat", { firstName, lastName, image, userId, chatId })} />
						)}
						<Image source={require("../assets/images/Box.png")} />
						<View style={tw`items-center my-8`}>
							<Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>No details yet</Text>
							<View style={tw`flex-row items-center justify-center`}>
								<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_text })}>
									{tabs ? "Edit profile to provide more" : "This user has not provided details"}
								</Text>
								{tabs && (
									<Button
										onPress={() => navigation.navigate("Settings")}
										style={tw`-ml-2 -mr-2`}
										labelStyle={tw.style(`text-base`, { fontFamily: "i_semi", color: "#0066CC" })}>
										details
									</Button>
								)}
							</View>
						</View>
					</View>
				</ScrollView>
			</Wrapper>
		</>
	);
};
