import { memo, useEffect, useRef } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { socials } from "../data";
import theme from "../constants";
import { firebaseInit } from "../firebase/firebaseInit";
import { child, get, getDatabase, ref } from "firebase/database";

export const UserCard = memo(({ user, isSignedIn, onPress }) => {
	const imageSource = user?.image ?? "https://shorturl.at/dADKQ";
	const Container = isSignedIn ? Pressable : View;
	const navigation = useNavigation();

	const onMessagePress = () => {
		navigation.navigate("Chat", { ...user });
	};

	return (
		<View style={tw`bg-white p-3 gap-x-3 rounded-xl flex-row items-start justify-between shadow-md`}>
			<Container onPress={() => navigation.navigate("Profile", { ...user, tabs: false })} style={tw`flex-1 flex-row gap-x-4`}>
				<View style={tw`justify-start`}>
					<Image source={{ uri: imageSource }} style={tw`w-[50px] h-[50px] rounded-full bg-gray-200`} />
				</View>
				<View style={tw`flex-1 gap-y-3`}>
					<Text numberOfLines={2} style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>
						{user?.firstName} {user?.lastName}
						{user?.age && user?.privacy?.age !== false ? `, ${user?.age}` : ""}
					</Text>
					{(user?.city && user?.country) || (user?.location && user?.privacy?.location !== false) ? (
						<Text style={tw.style(`text-sm -mt-3`, { fontFamily: "i_medium" })}>
							{user?.city}, {user?.country}
						</Text>
					) : null}
					<View style={tw`flex-row gap-x-2`}>
						{user?.socialMedia?.length > 0 &&
							user?.socialMedia.map((item, i) => (
								<TouchableOpacity key={i}>
									<Image source={socials[item]} />
								</TouchableOpacity>
							))}
					</View>
				</View>
			</Container>
			<TouchableOpacity onPress={isSignedIn ? onMessagePress : () => onPress(true)} style={tw`p-2 bg-[${theme.btn}] rounded-lg`}>
				<MaterialCommunityIcons name="message-text-outline" size={24} color="white" />
			</TouchableOpacity>
		</View>
	);
});
