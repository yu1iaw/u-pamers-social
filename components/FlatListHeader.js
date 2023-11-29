import { Text, View } from "react-native";
import { Searchbar } from "react-native-paper";
import tw from 'twrnc';

import theme from '../constants';



export const FlatListHeader = () => {
	return (
		<View style={tw`mb-5`}>
			<Text style={tw.style(`text-2xl mb-4`, { fontFamily: "i_bold", color: theme.accent })}>Messages</Text>
			<Searchbar placeholder="Search by name" style={tw`bg-white pr-3 border border-[#A5A8BA] rounded-lg`} />
		</View>
	);
};
