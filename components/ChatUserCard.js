import { useNavigation } from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';

import theme from '../constants';



export const ChatUserCard = ({user, style}) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={tw`flex-row justify-between py-3 ${style ?? ''}`}>
            <View style={tw`max-w-[180px] flex-row gap-x-3`}>
                <View>
                    <Image source={user.image} />
                </View>
                <View>
                    <Text numberOfLines={1} style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.pr_text })}>{user.name}</Text>
                    <Text numberOfLines={1} style={tw.style(`text-xs`, { fontFamily: "i", color: theme.sec_text })}>{user.lastMessage}</Text>
                </View>
            </View>
            <View style={tw`items-end gap-y-1`}>
                <Text style={tw.style(`text-xs`, { fontFamily: "i", color: theme.sec_text })}>{user.lastMessageTime}</Text>
                <View style={tw`w-[20px] h-[20px] justify-center items-center bg-[#E6674E] rounded-full`}>
                    <Text style={tw.style(`text-xs text-white`, { fontFamily: "i_bold"})}>{user.messageIndicator}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}