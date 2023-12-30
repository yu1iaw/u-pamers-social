import { memo } from "react";
import { Image, View } from "react-native";
import tw from 'twrnc';

import { Input } from "./Input";


export const SocialMediaInput = memo(({name, imageSource, placeholder, value, onChangeText}) => {

    const handleOnChangeText = (text) => {
        onChangeText(text, name);
    }

	return (
		<View style={tw`flex-row gap-x-2 items-center`}>
			<Image source={imageSource} />
			<Input
				placeholder={placeholder}
				value={value}
				onChangeText={handleOnChangeText}
				style={"flex-1"}
				email
			/>
		</View>
	);
});
