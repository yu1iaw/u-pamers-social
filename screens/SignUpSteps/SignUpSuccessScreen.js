import { Image, Text, View } from "react-native";
import tw from "twrnc";

import { ModalHeader } from "../../components/ModalHeader";
import { PaddingTop } from "../../components/PaddingTop";
import { PaperButton } from "../../components/PaperButton";
import { Wrapper } from "../../components/Wrapper";
import theme from "../../constants";



export const SignUpSuccessScreen = ({navigation}) => {
	return (
		<Wrapper>
			<PaddingTop />
			<ModalHeader title="Sign up" />
			<View style={tw`items-center gap-y-4 mt-16`}>
				<Image source={require("../../assets/images/Success.png")} />
				<View style={tw`gap-y-2 mt-6`}>
					<Text style={tw.style(`text-center text-2xl mt-4`, { fontFamily: "i_bold", color: theme.pr_text })}>Account created</Text>
					<Text style={tw.style(`text-center text-base`, { fontFamily: "i_medium", color: theme.sec_text })}>
                        Fill in your profile details to introduce yourself to other U-pamers.
                    </Text>
				</View>
				
				<PaperButton style="w-full mt-5" title="Fill in profile details" filled onPress={() => navigation.navigate("Settings")} />
				<PaperButton style="w-full" title="Go to the Catalogue" onPress={() => navigation.navigate("Home")} />
			</View>
		</Wrapper>
	);
};
