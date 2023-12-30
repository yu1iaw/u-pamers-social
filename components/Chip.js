import { memo } from "react";
import { Image, Text, TouchableOpacity, Pressable, View } from "react-native";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";

import theme from "../constants";



export const Chip = memo(({ buttonStyle, textStyle, fontFamily, text, iconName, iconSize, imageSource, onPress, mainChip, profileChip, profileDetailsChip }) => {
    const Container = profileChip ? Pressable : TouchableOpacity;

	return (
		<Container onPress={onPress} style={tw`${buttonStyle ?? ""}`}>
			{(profileChip || profileDetailsChip) && (
				<View style={tw`bg-[#363A7E] w-[32px] h-[32px] justify-center items-center rounded-full overflow-hidden`}>
					<Image source={imageSource} />
				</View>
			)}
			<Text 
                numberOfLines={mainChip ? 1 : 0} 
                style={tw.style(`${textStyle ?? ""}`, fontFamily ? { fontFamily } : {})}
            >
				{text}
			</Text>
			{!profileChip && <AntDesign name={iconName ?? "close"} size={iconSize ?? 18} color={theme.pr_text} style={tw`pt-0.5`} />}
		</Container>
	);
});
