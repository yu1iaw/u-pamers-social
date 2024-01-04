import { useState } from "react";
import { Alert, Text, View } from "react-native";
import tw from "twrnc";
import { useSignIn } from "@clerk/clerk-expo";

import { ModalHeader } from "../components/ModalHeader";
import { PaddingTop } from "../components/PaddingTop";
import { Wrapper } from "../components/Wrapper";
import { PaperButton } from "../components/PaperButton";
import { Button } from "react-native-paper";
import { Input } from "../components/Input";
import theme from "../constants";



export const ForgotPasswordScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const { signIn, isLoaded } = useSignIn();

	const onRequestReset = async () => {
		if (!isLoaded || !email) return;

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email
            })
			navigation.navigate("ForgotPasswordStep2", { email })

        } catch(e) {
            Alert.alert(e.errors[0].message);
        }
    }

	return (
		<Wrapper>
			<PaddingTop />
			<ModalHeader title="Password reset" />
			<View style={tw`items-center gap-y-4 mt-16`}>
				<View style={tw`gap-y-2 mt-6`}>
					<Text style={tw.style(`text-center text-2xl mt-4`, { fontFamily: "i_bold", color: theme.pr_text })}>Forgot your password?</Text>
					<Text style={tw.style(`text-center text-base`, { fontFamily: "i_medium", color: theme.sec_text })}>
						No worries! Enter your account email, and we’ll send you verification code to reset.
					</Text>
				</View>
				<Input 
					placeholder="Your email" 
					value={email}
					email 
					onChangeText={(email) => setEmail(email)}
					style="w-full my-7"
				/>

				<PaperButton style="w-full" title="Reset password" filled onPress={onRequestReset} />
				<View style={tw`flex-row items-center justify-center mt-4`}>
					<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.hint })}>Already have a verification?</Text>
					<Button 
						onPress={() => navigation.navigate("ForgotPasswordStep2", { email })} 
						style={tw`-ml-2 -mr-3`} 
						labelStyle={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.sec_btn })}
					>
						Enter Code
					</Button>
				</View>
			</View>
		</Wrapper>
	);
};
