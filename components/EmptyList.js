import { Image, Text, View } from 'react-native';
import tw from 'twrnc';

import theme from '../constants';



export const EmptyList = () => {
    return (
        <View style={tw`flex-1 items-center justify-center gap-y-5`}>
            <Image source={require("../assets/images/Magnifying-Glass.png")} />
            <View style={tw`items-center gap-y-2`}>
                <Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>No U-pamers found</Text>
                <Text style={tw.style(`text-base text-center mx-4`, { fontFamily: "i_medium", color: theme.sec_text })}>Try another search query or remove filters.</Text>
            </View>
        </View>
    )
}