import { memo, useEffect, useRef, useMemo } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { socials } from "../data";
import theme from "../constants";



export const UserCard = memo(({ user, isSignedIn, onPress }) => {
	const { companionsData } = useSelector(state => state.companions);
	const companion = companionsData[user?.id];

	const imageSource = user?.image ?? "https://shorturl.at/dADKQ";
	const Container = isSignedIn ? Pressable : View;
	const navigation = useNavigation();

	const firstName = companion ? companion?.firstName : user?.firstName;
	const lastName = companion ? companion?.lastName : user?.lastName;

	const privacyLocation = companion && companion?.location && companion?.privacy?.location !== true;
	const locContent = privacyLocation ? companion?.location : companion && !privacyLocation ? '' : user?.location;

	const ageCondition = companion?.age && companion?.privacy?.age !== true;
	const privacyAge = companion && ageCondition;
	const ageContent = privacyAge ? `, ${companion?.age}` : companion && !privacyAge  ? '' : user?.age && user?.privacy?.age !== true ? `, ${user?.age}` : '';

	const media = companion ? companion?.socialMedia ?? [] : user?.socialMedia ?? [];

	const onMessagePress = () => {
		navigation.navigate("Chat", companion ?? { ...user });
	};

	return (
		<View style={tw`bg-white p-3 gap-x-3 rounded-xl flex-row items-start justify-between shadow-md`}>
			<Container onPress={() => navigation.navigate("Profile", companion ? {...companion, tabs: false} : { ...user, tabs: false })} style={tw`flex-1 flex-row gap-x-4`}>
				<View style={tw`justify-start`}>
					<Image source={{ uri: companion ? companion?.image : imageSource }} style={tw`w-[50px] h-[50px] rounded-full bg-gray-200`} />
				</View>
				<View style={tw`flex-1 gap-y-3`}>
					<Text numberOfLines={2} style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>
						{firstName} {lastName}
						{ ageContent }
					</Text>
					{privacyLocation || user?.location && user?.privacy?.location !== true ? (
						<Text numberOfLines={1} style={tw.style(`text-sm -mt-3`, { fontFamily: "i_medium" })}>
							{locContent}
						</Text>
					) : null}
					<View style={tw`flex-row gap-x-2`}>
						{media.length > 0 &&
							media.map((item, i) => {
								for (let key in item) {
									if (item[key]) {
										return (
											<TouchableOpacity key={i}>
												<Image source={socials[key]} />
											</TouchableOpacity>
										)
									}
								}
							})
						}
					</View>
				</View>
			</Container>
			<TouchableOpacity onPress={isSignedIn ? onMessagePress : () => onPress(true)} style={tw`p-2 bg-[${theme.btn}] rounded-lg`}>
				<MaterialCommunityIcons name="message-text-outline" size={24} color="white" />
			</TouchableOpacity>
		</View>
	);
});
