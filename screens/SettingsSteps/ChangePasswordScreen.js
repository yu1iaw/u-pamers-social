import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { PaperButton } from "../../components/PaperButton";
import { ErrorMessage } from "../../components/ErrorMessage";
import theme from "../../constants";



export const ChangePasswordScreen = ({ navigation }) => {
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState({
		password: "",
		newPassword: "",
		confirmPassword: ""
	})
	const { isLoaded, isSignedIn, user } = useUser();

	const isNotVerified = !password || !newPassword || newPassword !== confirmPassword || error.password || error.newPassword || error.confirmPassword;
	

	const updateClerkPassword = async () => {
		if (!isLoaded || isNotVerified) return;

		try {
			await user?.updatePassword({
				currentPassword: password,
				newPassword,
			})
			alert("Password has changed successfully!");
			navigation.navigate("Settings");
			
		} catch(e) {
			if (e.errors[0].message.includes('Passwords validation failed.')) {
				return setError({...error, password: e.errors[0].message});
			}
			setError({...error, newPassword: e.errors[0].message})
		} 
	} 


	useEffect(() => {
		if (!newPassword || !confirmPassword) return;

		if (newPassword !== confirmPassword) {
			setError({...error, confirmPassword: "Passwords don't match." });
		} else {
			setError({...error, confirmPassword: ""});
		}
	}, [newPassword, confirmPassword])
	

	
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
						error={error.password}
                        value={password} 
                        onChangeText={(password) => {
							setError({...error, password: ""});
							setPassword(password);
						}} 
                    />
					{error.password && <ErrorMessage title={error.password} />}
					<Input 
                        placeholder={"New password"} 
                        password
                        value={newPassword} 
						error={error.newPassword}
                        onChangeText={(password) => {
							setError({...error, newPassword: ""});
							setNewPassword(password);
						}} 
                    />
					{error.newPassword ? <ErrorMessage title={error.newPassword} /> : (
						<Text style={tw.style(`text-xs -mt-2 mb-2 ml-1`, { fontFamily: "i", color: theme.accent })}>
							Create a strong password that is at least 8 characters long, includes upper-case, lower-case letters, at least 1 digit and 1 special
							character.
						</Text>
					)}
					<Input 
                        placeholder={"Confirm new password"} 
                        password 
						error={error.confirmPassword}
						value={confirmPassword}
						onChangeText={(password) => {
							setError({...error, confirmPassword: ""});
							setConfirmPassword(password);
						}}
					/>
					{error.confirmPassword && <ErrorMessage title={error.confirmPassword} />}

					<PaperButton 
						disabled={isNotVerified} 
						title="Save password" 
						filled 
						style={`mt-5`} 
						onPress={updateClerkPassword}
					/>
				</View>
			</ScrollView>
		</>
	);
};
