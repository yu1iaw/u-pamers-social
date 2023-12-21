import { memo } from "react";
import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import tw from 'twrnc';

import theme from '../constants';



export const MessageBubble = memo(({type, createdAt, userId, userImage, messageText, navigation}) => {
    const bubbleStyle = type === 'myOwn' ? `bg-[${theme.btn}]` : type ==="system" ? `bg-stone-200` : `bg-white shadow-md`;
    const textStyle = type === 'myOwn' ? `text-white` : `text-[${theme.pr_text}]`;
    const dateFormat = new Date(createdAt).toString().slice(-18, -12);

    return (
        <View style={tw`p-2 ${type === "myOwn" ? 'self-end gap-y-1' : type === "system" ? 'self-center' : 'self-start'}`}>
            <View style={tw`flex-row gap-x-3 max-w-[60%]`}>
                {type === "notMine" && (
                    <TouchableWithoutFeedback onPress={() => navigation.navigate("Profile", { id: userId, tabs: false })}>
                        <Image source={{uri: userImage ?? 'https://shorturl.at/dADKQ'}} style={tw`w-[30px] h-[30px] rounded-full self-end`} />
                    </TouchableWithoutFeedback>
                )}
                <View style={tw`p-2 rounded-xl shadow ${bubbleStyle}`}>
                    <Text style={tw.style(`text-sm ${textStyle}`, { fontFamily: "i_medium" })}>{messageText}</Text>
                </View>
                {type === "notMine" && <Text style={tw.style(`text-xs text-right self-end -ml-1`, { fontFamily: "i", color: theme.sec_text })}>{dateFormat}</Text>}
            </View>
            {type === "myOwn" && <Text style={tw.style(`text-xs text-right`, { fontFamily: "i", color: theme.sec_text })}>{dateFormat}</Text>}
        </View>
    )
})