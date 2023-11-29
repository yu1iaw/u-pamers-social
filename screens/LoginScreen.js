import { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { Button } from "react-native-paper";

import { Input } from "../components/Input";
import { ModalHeader } from "../components/ModalHeader";
import { PaddingTop } from "../components/PaddingTop";
import { Wrapper } from "../components/Wrapper";
import { PaperButton } from "../components/PaperButton";
import theme from "../constants";

export const LoginScreen = ({ navigation }) => {
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const { signIn, setActive, isLoaded } = useSignIn();

	const onSignInPress = async () => {
		if (!isLoaded || !emailAddress || !password) return;

		try {
			const completeSignIn = await signIn.create({
				identifier: emailAddress,
				password,
			});

			await setActive({ session: completeSignIn.createdSessionId });
            navigation.goBack();
		} catch (err) {
			alert(err.errors[0].message);
		}
	};

	return (
		<Wrapper>
			<PaddingTop />
			<ModalHeader title="Log in" />
			<ScrollView showsVerticalScrollIndicator={false} style={tw`gap-y-2 my-5`} contentContainerStyle={tw`items-center`}>
				<Image source={require("../assets/images/Logo.png")} />
				<View style={tw`items-center gap-y-2 mt-4 mb-7`}>
					<Text style={tw.style(`text-3xl`, { fontFamily: "i_bold", color: theme.pr_text })}>U-pamers</Text>
					<Text style={tw.style(`text-base text-center`, { fontFamily: "i_medium", color: theme.sec_text })}>
						Log in to expand your social network and communicate with colleagues.
					</Text>
				</View>
				<View style={tw`w-full gap-y-3`}>
					<Input 
                        placeholder={"Login"} 
                        value={emailAddress}
                        email 
                        onChangeText={(email) => setEmailAddress(email) }
                    />
					<Input 
                        placeholder={"Password"} 
                        value={password}
                        password 
                        onChangeText={password => setPassword(password)}
                    />
					<Button
						onPress={() => navigation.navigate("ForgotPassword")}
						style={tw`-mt-2 self-end`}
						labelStyle={{ fontFamily: "i_medium", fontSize: 16, color: theme.sec_btn }}>
						Forgot Password
					</Button>
					<PaperButton title="Log in" filled onPress={onSignInPress} />
					<View style={tw`flex-row items-center justify-center mt-4`}>
						<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.hint })}>Don’t have an account?</Text>
						<Button onPress={() => navigation.navigate("SignUp")} labelStyle={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.sec_btn })}>
							Sign up
						</Button>
					</View>
				</View>
			</ScrollView>
		</Wrapper>
	);
};
