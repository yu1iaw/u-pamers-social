import { memo, useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

import theme from "../constants";



export const ChatUserCard = memo(({ userId: id, firstName, lastName, image, chatInfo, chatUpdatedAt, chatUpdatedBy, unreadMessagesIndicator, navigation, style }) => {

	const getFormattedDate = useMemo(() => {
		const ms = new Date() - new Date(chatUpdatedAt);

		const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
		const days = Math.floor(ms / (1000 * 60 * 60 * 24) % 365);
		const hours = Math.floor(ms / (1000 * 60 * 60) % 24);
		const minutes = Math.floor(ms / (1000 * 60) % 60);
		const seconds = Math.floor(ms / 1000 % 60);

		const arr = [
			{ 0: `${years}y` },
			{ 1: `${days}d` },
			{ 2: `${hours}h` },
			{ 3: `${minutes}m` },
			{ 4: `${seconds}sec` },
		];

		const index = arr.findIndex((item, i) => !item[i].startsWith('0'));
		return arr[index][index];

	}, [chatUpdatedAt])


	return (
		<TouchableOpacity
			onPress={() => navigation.navigate("Chat", { id, firstName, lastName, image })}
			style={tw`flex-row justify-between py-3 ${style ?? ""}`}>
			<View style={tw`max-w-[180px] flex-row items-center gap-x-3`}>
				<View>
					<Image source={{ uri: image ?? "https://shorturl.at/dADKQ" }} style={tw`w-[50px] h-[50px] rounded-full bg-gray-200`} />
				</View>
				<View>
					<Text numberOfLines={1} style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.pr_text })}>
						{firstName} {lastName}
					</Text>
					<Text numberOfLines={1} style={tw.style(`text-xs`, { fontFamily: "i", color: theme.sec_text })}>
						{ chatUpdatedBy !== id && `You: `}{ chatInfo }
					</Text>
				</View>
			</View>
			<View style={tw`items-end gap-y-1`}>
				<Text style={tw.style(`text-xs`, { fontFamily: "i", color: theme.sec_text })}>{getFormattedDate} ago</Text>
				{unreadMessagesIndicator > 0 && (
					<View style={tw`w-[20px] h-[20px] justify-center items-center bg-[#E6674E] rounded-full`}>
						<Text style={tw.style(`text-xs text-white`, { fontFamily: "i_bold" })}>{unreadMessagesIndicator}</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
});
