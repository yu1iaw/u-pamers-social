import { Text, TouchableOpacity } from "react-native";
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

import theme from '../constants';



export const SettingsSection = ({direction, title, navigation}) => {
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate(direction)}
			style={tw`bg-white flex-row items-center justify-between p-3 rounded-lg shadow`}>
			<Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.pr_text })}>{title}</Text>
			<Ionicons name="chevron-forward" size={24} color={theme.pr_text} />
		</TouchableOpacity>
	);
};
