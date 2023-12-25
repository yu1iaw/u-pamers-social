import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import tw from 'twrnc';



export const Loader = () => {
	return (
		<View style={tw`flex-1 items-center justify-center`}>
			<ActivityIndicator size={49} color="#0078ff" />
		</View>
	);
};
