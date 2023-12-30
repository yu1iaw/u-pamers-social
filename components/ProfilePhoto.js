import { memo, useEffect, useRef } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";

import { firebaseInit } from "../firebase/firebaseInit";
import { setPersonalData } from "../redux/personalSlice";
import theme from '../constants';




export const ProfilePhoto = memo(({tabs, user, imageSource}) => {
	const Container = tabs ? TouchableOpacity : View;
    const imageRef = useRef(user?.imageUrl);
    const dispatch = useDispatch();


    useEffect(() => {
		const updateUser = async () => {
			const personalImage = {
				image: user?.imageUrl,
			};
			try {
				const app = firebaseInit();
				const db = getFirestore(app);
				const userRef = doc(collection(db, "users"), `${user?.id}`);
				await updateDoc(userRef, personalImage);
				imageRef.current !== user?.imageUrl && dispatch(setPersonalData(personalImage));
			} catch(e) {
				console.log(e);
			}
		};

		updateUser();
	}, [user?.imageUrl]);


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
				await user?.setProfileImage({
					file: base64,
				});
			}
		} catch(e) {
			console.log(e);
		}
	};


	return (
        <Container onPress={onCaptureImage} style={tw.style(`bg-white rounded-full shadow -mt-10 mb-5`)}>
            <Image source={{ uri: tabs ? user?.imageUrl : imageSource }} style={tw`w-[96px] h-[96px] rounded-full`} />
            {tabs && (
                <View style={tw`absolute bottom-0 right-0 bg-[${theme.btn}] p-2 rounded-lg`}>
                    <Feather name="edit-2" size={16} color="white" />
                </View>
            )}
        </Container>
	);
});
