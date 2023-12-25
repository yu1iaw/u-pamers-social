import { memo } from "react";
import { Image, Text, View } from "react-native";
import tw from 'twrnc';
import { useAuth } from "@clerk/clerk-expo";


import { PaperButton } from "./PaperButton";
import theme from '../constants';



export const ErrorView = memo(() => {
    const { signOut } = useAuth();


    return (
        <View style={tw`flex-1 items-center justify-center px-4 gap-y-5`}>
            <Image source={require("../assets/images/Error.png")} />
            <View style={tw`items-center gap-y-2`}>
                <Text style={tw.style(`text-2xl text-center`, { fontFamily: "i_bold", color: theme.pr_text })}>Ooops! Something went wrong...</Text>
                <Text style={tw.style(`text-center text-base`, { fontFamily: "i_medium", color: theme.sec_text })}>We are having some technical issues right now. Don’t worry, it’s not you - it’s us.</Text>
            </View>
            <PaperButton onPress={signOut} title="Refresh Page" style={'w-full mt-3'} filled />
        </View>
    )
})