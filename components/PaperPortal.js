import { Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

import { PaperButton } from './PaperButton';
import theme from '../constants';



export const PaperPortal = ({showModal, setShowModal, signUp, setup}) => {
    const navigation = useNavigation();

	return (
		<Portal>
			<Modal
				visible={showModal}
				onDismiss={() => setShowModal(false)}
				style={tw`bg-[#4D5267]`}
				contentContainerStyle={tw`bg-white p-4 pb-8 m-5 rounded-lg`}>
				<View>
					<TouchableOpacity onPress={() => setShowModal(false)} style={tw`p-2 pr-0 self-end`}>
						<Ionicons name="close" size={28} color="gray" />
					</TouchableOpacity>
					<View style={tw`gap-y-3`}>
						<View style={tw`items-center`}>
							<Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>{signUp ? "Leaving already?" : setup ? "Unsaved changes will be lost" : "Sorry, you are not login yet"}</Text>
							<Text style={tw.style(`text-center text-base py-3 ${signUp || setup ? "w-[95%]" : 'w-[70%]'}`, { fontFamily: "i_medium", color: theme.hint })}>
								{signUp ? "You havenʼt finished sign up yet. If you leave now, latest information will be lost." : setup ? "If you leave now, all the unsaved information will be lost." : "You need to be logged in to message other users."}
							</Text>
						</View>
						<PaperButton
							title={signUp ? "Continue to sign up" : setup ? "Continue editing" : "Log in"}
							filled
							onPress={() => {
								setShowModal(false);
								navigation.navigate(signUp ? "SignUpStep3" : setup ? "ProfileDetails" : "Login");
							}}
						/>
						<PaperButton 
							title={signUp ? "Leave" : setup ? "Leave without saving" : "Cancel"} 
							onPress={signUp ? () => {
								setShowModal(false);
								navigation.navigate("Home");
							} : setup ? () => {
								// setShowModal(false);
								navigation.goBack();
							} : () => setShowModal(false)} />
					</View>
				</View>
			</Modal>
		</Portal>
	);
};
