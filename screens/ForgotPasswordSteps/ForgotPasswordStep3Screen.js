import { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { ScrollView, Text, View } from "react-native";
import tw from 'twrnc';

import { Wrapper } from "../../components/Wrapper";
import { PaddingTop } from "../../components/PaddingTop";
import { ModalHeader } from "../../components/ModalHeader";
import theme from '../../constants';
import { Input } from "../../components/Input";
import { PaperButton } from "../../components/PaperButton";
import { ErrorMessage } from "../../components/ErrorMessage";



export const ForgotPasswordStep3Screen = ({ navigation, route }) => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState({
		password: "",
		confirmPassword: ""
	})
	const { signIn, setActive, isLoaded } = useSignIn();
	const isVerified = !password || password !== confirmPassword;


	const onReset = async () => {
		if (!isLoaded || isVerified) return;

		try {
			const result = await signIn.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code: route.params?.code,
				password,
			});

			await setActive({ session: result.createdSessionId });
			navigation.navigate("ForgotPasswordSuccess")
		} catch (e) {
			setError({...error, password: e.errors[0].message});
		}
	};

	const onChangeConfirmPasswordText = (text) => {
		if (text !== password) {
			setError({...error, confirmPassword: "Passwords don't match."});
		} else {
			setError({...error, confirmPassword: ""});
		}
		setConfirmPassword(text);
	}

	return (
		<Wrapper>
			<PaddingTop />
			<ModalHeader title="Password reset" />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={tw`items-center gap-y-4 mt-16`}>
					<View style={tw`gap-y-2 mt-6`}>
						<Text style={tw.style(`text-center text-2xl mt-4`, { fontFamily: "i_bold", color: theme.pr_text })}>Create new password</Text>
					</View>
					<View style={tw`w-full gap-y-4 my-5`}>
						<Input 
							placeholder="New password" 
							value={password} 
							error={error.password}
							password 
							onChangeText={(password) => {
								setError({...error, password: ""});
								setPassword(password);
							}} 
						/>
						{error.password ? (
							<ErrorMessage title={error.password} />
						) : (
							<Text style={tw.style(`text-xs -mt-3`, { fontFamily: "i", color: theme.accent })}>
								Create a strong password that is at least 8 characters long, includes upper-case, lower-case letters, at least 1 digit and 1 special character.
							</Text>
						)}
						<Input 
							placeholder="Confirm new password" 
							value={confirmPassword} 
							error={error.confirmPassword}
							password 
							onChangeText={onChangeConfirmPasswordText} 
						/>
						{error.confirmPassword && <ErrorMessage title={error.confirmPassword} />}
					</View>
					<PaperButton 
						disabled={isVerified}
						style="w-full" 
						title="Save password" 
						filled 
						onPress={onReset} />
				</View>
			</ScrollView>
		</Wrapper>
	);
};
