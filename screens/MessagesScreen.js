import { useRef } from "react";
import { FlatList, Text, View } from "react-native";
import tw from 'twrnc';
import { useUser } from "@clerk/clerk-expo";

import { Header } from "../components/Header";
import { Wrapper } from "../components/Wrapper";
import { messagesData } from "../data";
import { ChatUserCard } from "../components/ChatUserCard";
import { ScrollUpButton } from "./ScrollUpButton";
import theme from '../constants';
import { FlatListHeader } from "../components/FlatListHeader";



export const MessagesScreen = () => {
    const { isSignedIn, user, isLoaded } = useUser();
    const flatListRef = useRef(null);

    const handlePress = () => {
        flatListRef.current.scrollToIndex({ index: 0 })
    }

    return (
        <>
            <Header isSignedIn={isSignedIn} />
            <Wrapper>
                <FlatList
                    ListHeaderComponent={() => <FlatListHeader />}
                    ref={(ref) => flatListRef.current = ref}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`pt-5`}
                    data={messagesData}
                    renderItem={({item, index}) => <ChatUserCard user={item} style={index == messagesData.length - 1 ? '' : 'border-b border-gray-300'} />} 
                />
                <ScrollUpButton onPress={handlePress} />

            </Wrapper>
        </>
    )
}