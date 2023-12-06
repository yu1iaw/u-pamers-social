import { memo } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

import theme from '../constants';


export const Banner = memo(({setIsBannerVisible, isSignedIn}) => {
    const navigation = useNavigation();

	return (
		<View style={tw`bg-white flex-row justify-between items-start py-4 border-b-2 border-[#0078FF]`}>
			<View style={tw`flex-row flex-1 gap-x-3 px-3`}>
				<AntDesign name="infocirlce" size={26} color={"#0078FF"} />
				<View>
					<Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.pr_text })}>
						Wanna {isSignedIn ? "stand out?" : "connect with U-pamers?"}
					</Text>
					<Pressable onPress={() => navigation.navigate(isSignedIn ? "Settings" : "Login")}>
						<Text style={tw.style(`text-sm`, { fontFamily: "i_medium", color: theme.sec_text })}>
							{isSignedIn ? "Help others connect with you faster by " : "Start your journey with "}
							<Text style={tw.style({ fontFamily: "i_semi", color: theme.sec_btn })}>{isSignedIn ? "adding more profile details" : "login"}</Text>.
						</Text>
					</Pressable>
				</View>
			</View>
			<TouchableOpacity style={tw`px-3 -mt-1`} onPress={() => setIsBannerVisible(false)}>
				<Ionicons name="close" size={30} color="gray" />
			</TouchableOpacity>
		</View>
	);
});
