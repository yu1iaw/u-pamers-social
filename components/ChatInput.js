import { memo } from "react";
import { TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Input } from "./Input";
import { Ionicons } from "@expo/vector-icons";

import theme from "../constants";



export const ChatInput = memo(({value, onChangeText, onPress}) => {
	return (
		<View style={tw`flex-row items-center py-4`}>
			<Input value={value} onChangeText={onChangeText} style={`flex-1`} />
			<TouchableOpacity onPress={onPress} style={tw`pl-4 py-2`}>
				<Ionicons name="send" size={24} color={value ? theme.btn : theme.disabled} />
			</TouchableOpacity>
		</View>
	);
});
