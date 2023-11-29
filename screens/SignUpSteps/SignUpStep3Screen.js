import { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

import { ModalHeader } from "../../components/ModalHeader";
import { PaddingTop } from "../../components/PaddingTop";
import { PaperButton } from "../../components/PaperButton";
import { Wrapper } from "../../components/Wrapper";
import theme from "../../constants";
import { Input } from "../../components/Input";
import { PaperPortal } from "../../components/PaperPortal";

export const SignUpStep3Screen = ({navigation}) => {
	const [showModal, setShowModal] = useState(false);


	return (
		<Wrapper>
			<PaddingTop />
			<ModalHeader title="Sign up" onPress={() => setShowModal(true)} />
            <PaperPortal showModal={showModal} setShowModal={setShowModal} signUp />
			<View style={tw`my-5 items-center`}>
				<Image source={require("../../assets/images/Stepper-4.png")} resizeMode="contain" style={tw`w-full h-[40px]`} />
			</View>
			<ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`gap-y-3 pb-5`}
            >
                <View>
					<Text style={tw.style(`text-center text-2xl mt-4`, { fontFamily: "i_bold", color: theme.pr_text })}>Connect social medias</Text>
					<Text style={tw.style(`text-center`, { fontFamily: "i", color: theme.hint })}>(Optional)</Text>
				</View>
                <View style={tw`gap-y-3 mt-6`}>
                    <View style={tw`flex-row gap-x-2 items-center`}>
                        <Image source={require("../../assets/images/linkedin.png")} />
                        <Input placeholder={"Linkedin URL (Optional)"} style={'flex-1'} email />
                    </View>
                    <View style={tw`flex-row gap-x-2 items-center`}>
                        <Image source={require("../../assets/images/instagram.png")} />
                        <Input placeholder={"Instagram URL (Optional)"} style={'flex-1'} email />
                    </View>
                    <View style={tw`flex-row gap-x-2 items-center`}>
                        <Image source={require("../../assets/images/telegram.png")} />
                        <Input placeholder={"Telegram URL (Optional)"} style={'flex-1'} email />
                    </View>
                    <View style={tw`flex-row gap-x-2 items-center`}>
                        <Image source={require("../../assets/images/facebook.png")} />
                        <Input placeholder={"Facebook URL (Optional)"} style={'flex-1'} email />
                    </View>
                    <View style={tw`flex-row gap-x-2 items-center`}>
                        <Image source={require("../../assets/images/skype.png")} />
                        <Input placeholder={"Skype URL (Optional)"} style={'flex-1'} email />
                    </View>
                </View>
				
			</ScrollView>
			<PaperButton style="w-full mt-5" title="Create account" filled onPress={() => navigation.navigate("SignUpSuccess")} />
            <Pressable onPress={() => navigation.navigate("Login")} style={tw`self-center gap-x-4 my-4`}>
                <Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.hint })}>
                    Already have an account? <Text style={tw.style({ fontFamily: "i_semi", color: theme.sec_btn })}>Login</Text>
                </Text>
            </Pressable>
		</Wrapper>
	);
};
