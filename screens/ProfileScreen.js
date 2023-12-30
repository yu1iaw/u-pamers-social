import { useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";

import { Banner } from "../components/Banner";
import { Header } from "../components/Header";
import { PaperButton } from "../components/PaperButton";
import { chipIcons, socials } from "../data";
import { openURL } from "../utils/openUrl";
import { Chip } from "../components/Chip";
import { ProfilePhoto } from "../components/ProfilePhoto";
import theme from "../constants";



export const ProfileScreen = ({ navigation, route }) => {
	const [isBannerVisible, setIsBannerVisible] = useState(true);
	const { personalData } = useSelector((state) => state.personalInfo);
	const { companionsData } = useSelector(state => state.companions);
	const { tabs, firstName, lastName, age, location, image, aboutMe, socialMedia, interests, privacy, id } = route.params;
	const { isSignedIn, user } = useUser();
	const isMyInfoExist = Object.keys(personalData)?.length && user.id === personalData.id;
	const companion = companionsData[id];
	const imageSource = image ?? companion?.image;

	

	const onEditButtonPress = useCallback(() => {
		navigation.navigate("Settings");
	}, [])


	const onMessageButtonPress = useCallback(() => {
		const { tabs, ...rest } = route.params;
		const { id, firstName, lastName, image } = companion || {};
		navigation.navigate("Chat", companion ? { id, firstName, lastName, image } : { ...rest});
	}, [])
	

	const myAge = isMyInfoExist && personalData.age ? `, ${personalData.age}` : "";
	const myLocation = isMyInfoExist && personalData.location ? personalData.location : "";
	const media = tabs ? personalData.socialMedia ?? [] : companion ? companion?.socialMedia ?? [] : socialMedia ?? [];
	const chips = tabs ? personalData.interests ?? [] : companion ? companion?.interests ?? [] : interests ?? [];
	
	const isPropsUserInfoDisabled = (!aboutMe && !interests?.length) || privacy?.description || privacy?.privateAccount;
	const isCompanionInfoDisabled = !companion?.aboutMe && !companion?.interests?.length || companion?.privacy?.description || companion?.privacy?.privateAccount;
	const isMyInfoDisabled = !personalData.aboutMe && !personalData.interests?.length;


	return (
		<>
			<Header isSignedIn={isSignedIn} />
			{tabs && isBannerVisible && <Banner setIsBannerVisible={setIsBannerVisible} isSignedIn={isSignedIn} />}
			<TouchableOpacity onPress={() => navigation.navigate("Home")} style={tw`flex-row gap-x-2 items-center p-4`}>
				<Ionicons name="chevron-back" size={24} color={theme.sec_btn} />
				<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_btn })}>Catalogue</Text>
			</TouchableOpacity>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Text style={tw.style(`text-2xl m-4 mb-0`, { fontFamily: "i_bold", color: theme.accent })}>My profile</Text>
				<View style={tw`bg-white m-4 rounded-xl shadow`}>
					<View style={tw`h-[56px] bg-[#9AA0FE] rounded-t-xl`} />
					<View style={tw`items-center px-4`}>
						<ProfilePhoto 
							tabs={tabs}
							user={user}
							imageSource={imageSource}
						/>
						<Text style={tw.style(`text-2xl capitalize`, { fontFamily: "i_bold", color: theme.pr_text })}>
							{tabs ? `${user?.fullName}${myAge}` : companion ? `${companion?.firstName} ${companion?.lastName}${companion?.age && companion?.privacy?.age !== true ? `, ${companion?.age}` : ""}` : `${firstName} ${lastName}${age && privacy?.age !== true ? `, ${age}` : ""}`}
						</Text>
						<Text style={tw.style(`text-sm`, { fontFamily: "i_medium", color: theme.sec_text })}>
							{tabs ? myLocation : companion ? companion?.location && companion?.privacy?.location !== true ? companion?.location : "" : location && privacy?.location !== true ? location : ""}
						</Text>
						<View style={tw`flex-row gap-x-2 mt-2`}>
							{media.length > 0 &&
								media.map((item, i) => {
									for (let key in item) {
										if (item[key]) {
											return (
												<TouchableOpacity onPress={() => openURL(item[key])} key={i}>
													<Image source={socials[key]} />
												</TouchableOpacity>
											);
										}
									}
								})}
						</View>
						{tabs ? (
							<PaperButton style="w-full my-8" title="Edit Profile" onPress={onEditButtonPress} />
						) : (
							<PaperButton
								style="w-full my-8"
								title="Message"
								filled
								onPress={onMessageButtonPress}
							/>
						)}
						{!tabs && isPropsUserInfoDisabled && isCompanionInfoDisabled || tabs && isMyInfoDisabled ? (
							<>
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
							</>
						) : (
							<View style={tw`self-start gap-y-5 mt-2 mb-5`}>
								{(tabs ? !!personalData.aboutMe : companion ? !!companion?.aboutMe : !!aboutMe) && (
									<View style={tw`gap-y-3`}>
										<Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>About me</Text>
										<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.pr_text })}>{tabs ? personalData.aboutMe : companion ? companion?.aboutMe : aboutMe}</Text>
									</View>
								)}
								{(tabs ? !!personalData.interests?.length : companion ? !!companion?.interests?.length : !!interests?.length) && (
									<View style={tw`gap-y-4`}>
										<Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>Interests</Text>
										<View style={tw`flex-row flex-wrap gap-3`}>
											{chips.length > 0 &&
												chips.map((chip, index) => (
													<Chip
														key={index}
														buttonStyle={`flex-row items-center gap-x-2 p-1 pr-4 border rounded-full bg-[#EBEEFF] border-[#6168E4]`}
														textStyle={`text-base text-[${theme.pr_text}]`}
														fontFamily="i_medium"
														text={chip}
														imageSource={chipIcons[index]}
														profileChip
													/>
												))}
										</View>
									</View>
								)}
							</View>
						)}
					</View>
				</View>
			</ScrollView>
		</>
	);
};
