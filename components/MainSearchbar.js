import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import tw from 'twrnc';
import { AntDesign } from "@expo/vector-icons";

import theme from "../constants";



export const MainSearchbar = memo(({value, onChangeText, navigation}) => {
	return (
		<View style={tw`pt-5 flex-row items-center gap-x-3`}>
			<Searchbar
				placeholder="Search by name"
				value={value}
				onChangeText={onChangeText}
				style={tw`flex-1 bg-white pr-3 border border-[#A5A8BA] rounded-lg`}
			/>
			<TouchableOpacity
				onPress={navigation.openDrawer}
				style={tw`bg-white w-[52px] h-[56px] items-center justify-center border-2 border-[${theme.btn}] rounded-lg`}>
				<AntDesign name="filter" size={24} color={theme.btn} />
			</TouchableOpacity>
		</View>
	);
});
