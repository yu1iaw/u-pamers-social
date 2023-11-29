import { Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

import theme from '../constants';



export const ModalHeader = ({title, onPress}) => {
    const navigation = useNavigation();

    return (
        <View style={tw`flex-row justify-center items-center py-2`}>
            <Text style={tw.style(`text-base flex-1 text-center pl-9`, { fontFamily: "i_semi", color: theme.pr_text })}>{title}</Text>
            <TouchableOpacity onPress={onPress ? onPress : navigation.goBack} style={tw`p-1 rounded-full ml-auto`}>
                <Ionicons name="close" size={28} color="gray" />
            </TouchableOpacity>
        </View>
    )
}