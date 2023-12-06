import { Image, Text, View } from 'react-native';
import tw from 'twrnc';

import theme from '../constants';



export const EmptyList = ({source, title, subtitle}) => {
    const imageSource = source ?? require("../assets/images/Magnifying-Glass.png");
    const textTitle = title ?? 'No U-pamers found';
    const textSubtitle = subtitle ?? 'Try another search query or remove filters.';


    return (
        <View style={tw`flex-1 items-center justify-center gap-y-5`}>
            <Image source={imageSource} />
            <View style={tw`items-center gap-y-2`}>
                <Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>{textTitle}</Text>
                <Text style={tw.style(`text-base text-center mx-4`, { fontFamily: "i_medium", color: theme.sec_text })}>{textSubtitle}</Text>
            </View>
        </View>
    )
}