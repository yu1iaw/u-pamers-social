import { Text, View } from "react-native";
import tw from "twrnc";
import { FontAwesome } from '@expo/vector-icons';

import theme from '../constants';



export const ErrorMessage = ({title}) => {
	return (
		<View style={tw`flex-row items-center gap-x-1 ml-1 -mt-2`}>
			<FontAwesome name="exclamation-triangle" size={16} color={theme.error} />
			<Text style={tw.style(`text-xs`, {fontFamily: "i", color: theme.error})}>{title}</Text>
		</View>
	);
};
