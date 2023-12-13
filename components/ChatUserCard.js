import { useUser } from "@clerk/clerk-expo";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';

import theme from '../constants';



export const ChatUserCard = ({user, navigation, style}) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Chat", { ...user, chatId: user.key })} style={tw`flex-row justify-between py-3 ${style ?? ''}`}>
            <View style={tw`max-w-[180px] flex-row items-center gap-x-3`}>
                <View>
                    <Image source={{uri: user.image ?? "https://shorturl.at/dADKQ"}} style={tw`w-[50px] h-[50px] rounded-full bg-gray-200`} />
                </View>
                <View>
                    <Text numberOfLines={1} style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.pr_text })}>{user.firstName} {user.lastName}</Text>
                    <Text numberOfLines={1} style={tw.style(`text-xs`, { fontFamily: "i", color: theme.sec_text })}>{user.chatInfo}</Text>
                </View>
            </View>
            <View style={tw`items-end gap-y-1`}>
                <Text style={tw.style(`text-xs`, { fontFamily: "i", color: theme.sec_text })}>8m ago</Text>
                <View style={tw`w-[20px] h-[20px] justify-center items-center bg-[#E6674E] rounded-full`}>
                    <Text style={tw.style(`text-xs text-white`, { fontFamily: "i_bold"})}>6</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}