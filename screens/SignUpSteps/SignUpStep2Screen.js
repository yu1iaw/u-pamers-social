import { useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons';
import tw from "twrnc";
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";

import { ModalHeader } from "../../components/ModalHeader";
import { PaddingTop } from "../../components/PaddingTop";
import { PaperButton } from "../../components/PaperButton";
import { Wrapper } from "../../components/Wrapper";
import { firebaseInit } from "../../firebase/firebaseInit";
import { setPersonalData } from "../../redux/personalSlice";
import theme from "../../constants";



export const SignUpStep2Screen = ({navigation}) => {
	const { user } = useUser();
	const dispatch = useDispatch();

	const onCaptureImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				quality: 0.75,
				base64: true,
			});
	
			if (!result.canceled) {
				const base64 = `data:image/png;base64,${result.assets[0].base64}`;
				user?.setProfileImage({
					file: base64,
				});
			}
		} catch(e) {
			console.log(e);
		}
	};

	useEffect(() => {
		const updateUser = async () => {
			try {
				const app = firebaseInit();
				const db = getFirestore(app);
				const userRef = doc(collection(db, 'users'), `${user?.id}`);
				const personalImage = {
					image: !user?.hasImage ? "https://shorturl.at/dADKQ" :  user?.imageUrl
				};
	
				await updateDoc(userRef, personalImage);
				dispatch(setPersonalData(personalImage));
			} catch(e) {
				console.log(e);
			}
		}
		updateUser();
	}, [user?.hasImage, user?.imageUrl])


	return (
		<Wrapper>
			<PaddingTop />
			<ModalHeader title="Sign up" />
			<View style={tw`my-5 items-center`}>
				<Image source={require("../../assets/images/Stepper-3.png")} resizeMode="contain" style={tw`w-full h-[40px]`} />
			</View>
			<View style={tw`items-center gap-y-4`}>
				<View>
					<Text style={tw.style(`text-center text-2xl mt-4`, { fontFamily: "i_bold", color: theme.pr_text })}>Upload profile picture</Text>
					<Text style={tw.style(`text-center`, { fontFamily: "i", color: theme.hint })}>(Optional)</Text>
				</View>
				<TouchableOpacity style={tw`bg-[${theme.border}] p-2 rounded-full`} onPress={onCaptureImage}>
					<Image source={{ uri: user?.imageUrl }} style={tw`w-[150px] h-[150px] rounded-full`} />
					<View style={tw`absolute bottom-0 right-2 bg-[${theme.btn}] p-2 rounded-lg`}>
						<Feather name="edit-2" size={24} color="white" />
					</View>
				</TouchableOpacity>
				<PaperButton style="w-full mt-5" title="Continue" filled onPress={() => navigation.navigate("SignUpStep3")} />
			</View>
		</Wrapper>
	);
};
