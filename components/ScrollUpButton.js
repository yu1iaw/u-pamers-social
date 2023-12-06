import { memo } from "react";
import { TouchableOpacity } from "react-native";
import tw from 'twrnc';
import { Entypo } from '@expo/vector-icons';

import theme from '../constants';


export const ScrollUpButton = memo(({onPress}) => {
	return (
		<TouchableOpacity onPress={onPress} style={tw`absolute bottom-4 right-4 p-2 bg-[${theme.btn}] shadow rounded-full z-50`}>
			<Entypo name="chevron-up" size={28} color="white" />
		</TouchableOpacity>
	);
});
