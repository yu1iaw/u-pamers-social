import { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { useDispatch } from "react-redux";

import { ModalHeader } from "../../components/ModalHeader";
import { PaddingTop } from "../../components/PaddingTop";
import { PaperButton } from "../../components/PaperButton";
import { Wrapper } from "../../components/Wrapper";
import theme from "../../constants";
import { Input } from "../../components/Input";
import { PaperPortal } from "../../components/PaperPortal";
import { firebaseInit } from "../../firebase/firebaseInit";
import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { setPersonalData } from "../../redux/personalSlice";



export const SignUpStep3Screen = ({navigation}) => {
	const [showModal, setShowModal] = useState(false);
    const [socialMedia, setSocialMedia] = useState({
        linkedin: "",
        instagram: "",
        telegram: "",
        facebook: "",
        skype: ""
    });
    const dispatch = useDispatch();
    const { user } = useUser();

    const isInputFilled = socialMedia.linkedin || socialMedia.instagram || socialMedia.telegram || socialMedia.facebook || socialMedia.skype;


    const updateUserSocialMedia = async () => {
        const app = firebaseInit();
        const db = getFirestore(app);
        const userRef =  doc(collection(db, 'users'), `${user?.id}`);
        const personalSocialMedia = {
            socialMedia: [
                { linkedin: socialMedia.linkedin },
                { instagram: socialMedia.instagram },
                { telegram: socialMedia.telegram },
                { facebook: socialMedia.facebook },
                { skype: socialMedia.skype },
            ]
        }
        
        await updateDoc(userRef, personalSocialMedia);
        dispatch(setPersonalData(personalSocialMedia));
        navigation.navigate("SignUpSuccess");
    }

    const onChangeText = (text, name) => {
        setSocialMedia({...socialMedia, [name]: text});

    }


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
                        <Input 
                            placeholder={"Linkedin URL (Optional)"} 
                            value={socialMedia.linkedin}
                            onChangeText={(text) => onChangeText(text, 'linkedin')}
                            style={'flex-1'} 
                            email 
                        />
                    </View>
                    <View style={tw`flex-row gap-x-2 items-center`}>
                        <Image source={require("../../assets/images/instagram.png")} />
                        <Input 
                            placeholder={"Instagram URL (Optional)"} 
                            value={socialMedia.instagram}
                            onChangeText={(text) => onChangeText(text, 'instagram')}
                            style={'flex-1'} 
                            email 
                        />
                    </View>
                    <View style={tw`flex-row gap-x-2 items-center`}>
                        <Image source={require("../../assets/images/telegram.png")} />
                        <Input 
                            placeholder={"Telegram URL (Optional)"} 
                            value={socialMedia.telegram}
                            onChangeText={(text) => onChangeText(text, 'telegram')}
                            style={'flex-1'} 
                            email 
                        />
                    </View>
                    <View style={tw`flex-row gap-x-2 items-center`}>
                        <Image source={require("../../assets/images/facebook.png")} />
                        <Input 
                            placeholder={"Facebook URL (Optional)"} 
                            value={socialMedia.facebook}
                            onChangeText={(text) => onChangeText(text, 'facebook')}
                            style={'flex-1'} 
                            email 
                        />
                    </View>
                    <View style={tw`flex-row gap-x-2 items-center`}>
                        <Image source={require("../../assets/images/skype.png")} />
                        <Input 
                            placeholder={"Skype URL (Optional)"} 
                            value={socialMedia.skype}
                            onChangeText={(text) => onChangeText(text, 'skype')}
                            style={'flex-1'} 
                            email 
                        />
                    </View>
                </View>
				
			</ScrollView>
			<PaperButton style="w-full mt-5" title="Create account" filled onPress={isInputFilled ? updateUserSocialMedia : () => navigation.navigate("SignUpSuccess")} />
            <Pressable onPress={() => navigation.navigate("Login")} style={tw`self-center gap-x-4 my-4`}>
                <Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.hint })}>
                    Already have an account? <Text style={tw.style({ fontFamily: "i_semi", color: theme.sec_btn })}>Login</Text>
                </Text>
            </Pressable>
		</Wrapper>
	);
};
