import { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { Header } from "../../components/Header";
import theme from "../../constants";
import { Input } from "../../components/Input";
import { PaperButton } from "../../components/PaperButton";



export const ChangePasswordScreen = ({ navigation }) => {
	const [password, setPassword] = useState("");
	const { isSignedIn, user } = useUser();
	// console.log(user)

	return (
		<>
			<Header isSignedIn={isSignedIn} />
			<TouchableOpacity onPress={navigation.goBack} style={tw`flex-row gap-x-2 items-center px-4 py-4`}>
				<Ionicons name="chevron-back" size={24} color={theme.sec_btn} />
				<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_btn })}>Settings</Text>
			</TouchableOpacity>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Text style={tw.style(`text-2xl mt-4 px-4`, { fontFamily: "i_bold", color: theme.accent })}>Change password</Text>
				<View style={tw`bg-white px-3 py-7 mx-4 my-4 gap-y-3 rounded-lg shadow`}>
					<Input 
                        placeholder={"Current password"} 
                        password 
                        value={password} 
                        onChangeText={(password) => setPassword(password)} 
                    />
					<Input 
                        placeholder={"New password"} 
                        password
                        value={password} 
                        onChangeText={(password) => setPassword(password)} 
                    />
                    <Text style={tw.style(`text-xs -mt-2 mb-2 ml-1`, { fontFamily: "i", color: theme.accent })}>
                        Create a strong password that is at least 8 characters long, includes upper-case, lower-case letters, at least 1 digit and 1 special
                        character.
                    </Text>
					<Input 
                        placeholder={"Confirm new password"} 
                        password />
					<PaperButton title="Save password" filled style={`mt-5`} />
				</View>
			</ScrollView>
		</>
	);
};
