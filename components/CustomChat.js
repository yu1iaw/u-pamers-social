import { memo } from "react";
import { FlatList, View } from "react-native";
import tw from 'twrnc';
import { FlashList } from "@shopify/flash-list";

import { MessageBubble } from "./MessageBubble";




export const CustomChat = memo(({messages, flatlistRef, user, otherUserId, image, navigation}) => {

    const renderFlatListItem = ({item, index}) => {
		const isMyOwn = item.sender === user?.id;
		const type = isMyOwn ? "myOwn" : "notMine";
		const { createdAt, text } = item || {};
		let systemText;

		const dates = messages.map(m => m.createdAt?.slice(0, 10));
		const indexes = dates.map(date => messages.findIndex(m => m.createdAt?.includes(date)));

		if (index === indexes[index]) {
			const d = item.createdAt;
			const ms = new Date() - new Date(d);

			const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
			const days = Math.floor(ms / (1000 * 60 * 60 * 24) % 365);
			const hours = Math.floor(ms / (1000 * 60 * 60) % 24);
	
			const arr = [
				{ 0: `${years}y` },
				{ 1: `${days}d` },
				{ 2: `${hours}h` },
			];
	
			const i = arr.findIndex((item, i) => !item[i].startsWith('0'));

			const localDate = new Date(d).toLocaleDateString('en-UK', { hour12: false, weekday: "long", year: "numeric", month: "long", day: "numeric" });
			const splitLocalDate = localDate.split(', ');

			if (i === 0) {
				systemText = splitLocalDate[1];
			} else if (i === 1) {
				if (days > 7) {
					const doubleS = splitLocalDate[1].split(' ');
					systemText = `${doubleS[0]} ${doubleS[1]}`
				} else {
					systemText = splitLocalDate[0];
				}
			} else if (new Date().getDate() - new Date(d).getDate() !== 0) {
				systemText = 'yesterday';
			} else {
				systemText = 'today';
			}
			
			return (
				<>
					<MessageBubble type="system" messageText={systemText} />
					<MessageBubble
						type={type} 
						userId={otherUserId} 
						userImage={image} 
						createdAt={createdAt} 
						messageText={text} 
						navigation={navigation}
					/>
				</>
			)
		}

		return (
			<MessageBubble 
				type={type} 
				userId={otherUserId} 
				userImage={image} 
				createdAt={createdAt} 
				messageText={text} 
				navigation={navigation}
			/>
		)
	}



	return (
		<View style={tw`flex-1`}>
			{!messages.length ? (
				<MessageBubble type={"system"} messageText="Write your first message" />
			) : (
				<FlatList
					ref={(ref) => (flatlistRef.current = ref)}
					data={messages}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={tw`pt-1`}
					onContentSizeChange={() => flatlistRef.current?.scrollToEnd({ animated: false })}
					onLayout={() => flatlistRef.current?.scrollToEnd({ animated: false })}
					renderItem={renderFlatListItem}
					// estimatedItemSize={68}
					keyExtractor={m => m.messageId}
				/>
			)}
		</View>
	);
});
