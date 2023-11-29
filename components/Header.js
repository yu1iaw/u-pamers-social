import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

import { PaddingTop } from "./PaddingTop";
import theme from '../constants';



export const Header = ({isSignedIn}) => {
	const { user } = useUser();
	const navigation = useNavigation();

	return (
		<>
			<PaddingTop />
			<View style={tw`bg-[#363a7e] flex-row justify-between items-center px-4 py-5`}>
				<Pressable onPress={() => navigation.navigate("Home")}>
					<Image source={require("../assets/images/Logo1.png")} />
				</Pressable>
				{isSignedIn ? (
					<View style={tw`flex-row gap-x-6 items-center`}>
						<TouchableOpacity onPress={() => navigation.navigate("Messages")}>
							<MaterialCommunityIcons name="message-text-outline" size={24} color="white" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate("Profile")} style={tw`bg-[${theme.border}] p-px rounded-full`}>
							<Image source={{uri: user?.imageUrl}} style={tw`w-7 h-7 rounded-full`} />
						</TouchableOpacity>
					</View>
				) : (
                    <TouchableOpacity onPress={() => navigation.navigate("Login")} style={tw`bg-[#6168E4] py-[10px] px-4 rounded-lg`}>
                        <Text style={tw`text-white`}>Log In</Text>
                    </TouchableOpacity>
                )}
			</View>
		</>
	);
};
