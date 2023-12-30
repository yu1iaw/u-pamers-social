import { useCallback, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";

import { ModalHeader } from "../../components/ModalHeader";
import { PaddingTop } from "../../components/PaddingTop";
import { PaperButton } from "../../components/PaperButton";
import { Wrapper } from "../../components/Wrapper";
import { PaperPortal } from "../../components/PaperPortal";
import { SocialMediaInput } from "../../components/SocialMediaInput";
import { firebaseInit } from "../../firebase/firebaseInit";
import { setPersonalData } from "../../redux/personalSlice";
import theme from "../../constants";



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
        if (isInputFilled) {
            try {
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

            } catch(e) {
                console.log(e);
            }
        }
        navigation.navigate("SignUpSuccess");
    }

    const onChangeText = useCallback((text, name) => {
        setSocialMedia({...socialMedia, [name]: text});

    }, [socialMedia])


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
                <View style={tw`gap-y-3 mt-5`}>
                    <SocialMediaInput 
                        name="linkedin"
                        imageSource={require("../../assets/images/linkedin.png")}
                        placeholder={"Linkedin URL (Optional)"} 
                        value={socialMedia.linkedin}
                        onChangeText={onChangeText}
                    />
                    <SocialMediaInput 
                        name="instagram"
                        imageSource={require("../../assets/images/instagram.png")}
                        placeholder={"Instagram URL (Optional)"} 
                        value={socialMedia.instagram}
                        onChangeText={onChangeText}
                    />
                    <SocialMediaInput 
                        name="telegram"
                        imageSource={require("../../assets/images/telegram.png")}
                        placeholder={"Telegram URL (Optional)"} 
                        value={socialMedia.telegram}
                        onChangeText={onChangeText}
                    />
                    <SocialMediaInput 
                        name="facebook"
                        imageSource={require("../../assets/images/facebook.png")}
                        placeholder={"Facebook URL (Optional)"} 
                        value={socialMedia.facebook}
                        onChangeText={onChangeText}
                    />
                    <SocialMediaInput 
                        name="skype"
                        imageSource={require("../../assets/images/skype.png")}
                        placeholder={"Skype URL (Optional)"} 
                        value={socialMedia.skype}
                        onChangeText={onChangeText}
                    />
                </View>
				
			</ScrollView>
			<PaperButton style="w-full mt-5" title="Create account" filled onPress={updateUserSocialMedia} />
            <Pressable onPress={() => navigation.navigate("Login")} style={tw`self-center gap-x-4 my-4`}>
                <Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.hint })}>
                    Already have an account? <Text style={tw.style({ fontFamily: "i_semi", color: theme.sec_btn })}>Login</Text>
                </Text>
            </Pressable>
		</Wrapper>
	);
};
