import { useCallback } from "react";

import { Chip } from "./Chip";


export const ChipsWrapper = ({onPress, buttonStyle, textStyle, text, fontFamily, imageSource, iconName, selectedChips}) => {
    const handlePress = useCallback(() => onPress(), [selectedChips]);

	return (
		<Chip
			onPress={handlePress}
			buttonStyle={buttonStyle}
			textStyle={textStyle}
			fontFamily={fontFamily}
			text={text}
			imageSource={imageSource}
			iconName={iconName}
			profileDetailsChip
		/>
	);
};
