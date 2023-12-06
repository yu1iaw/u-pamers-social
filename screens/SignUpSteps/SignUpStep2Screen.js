import { useUser } from "@clerk/clerk-expo";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons';
import tw from "twrnc";
import * as ImagePicker from 'expo-image-picker';

import { ModalHeader } from "../../components/ModalHeader";
import { PaddingTop } from "../../components/PaddingTop";
import { PaperButton } from "../../components/PaperButton";
import { Wrapper } from "../../components/Wrapper";
import theme from "../../constants";
import { child, getDatabase, ref, update } from "firebase/database";
import { firebaseInit } from "../../firebase/firebaseInit";
import { useEffect } from "react";

export const SignUpStep2Screen = ({navigation}) => {
	const { isSignedIn, user, isLoaded } = useUser();

	const onCaptureImage = async () => {
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
	};

	useEffect(() => {
		if (!user?.hasImage) return;

		const updateUser = async () => {
			const app = firebaseInit();
			const dbRef = ref(getDatabase(app));
			const childRef = child(dbRef, `users/${user?.id}`);
			await update(childRef, {
				image: user?.imageUrl
			})

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
