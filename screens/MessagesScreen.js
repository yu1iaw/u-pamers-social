import { useState, useEffect, useRef, useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import tw from 'twrnc';
import { useUser } from "@clerk/clerk-expo";
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";

import { Header } from "../components/Header";
import { Wrapper } from "../components/Wrapper";
import { ChatUserCard } from "../components/ChatUserCard";
import { ScrollUpButton } from "../components/ScrollUpButton";
import { FlatListHeader } from "../components/FlatListHeader";
import { EmptyList } from "../components/EmptyList";



export const MessagesScreen = () => {
    const [value, setValue] = useState('');
    const [chats, setChats] = useState([]);
    const userChats = Object.values(useSelector(state => state.chats.chatData)).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const { storedUsers } = useSelector(state => state.users);
    const { isSignedIn, user } = useUser();
    const flatListRef = useRef(null);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const exceptMe = useMemo(() => ({...storedUsers}), [storedUsers]);
    delete exceptMe[user?.id];

 

    useEffect(() => {
        if (isFocused) {
            setChats(userChats)
        }
    }, [isFocused])


    useEffect(() => {
        if (!value) return setChats(userChats);

        const timerId = setTimeout(() => {
            setChats(userChats.filter((chat) => {
                const dude = chat.users.find(item => item !== user?.id);
                return exceptMe[dude].firstName.startsWith(value) || exceptMe[dude].lastName.startsWith(value);
            }))
        }, 500);

        return () => {
            clearTimeout(timerId);
        }
    }, [value])
  

    const handlePress = () => {
        flatListRef.current.scrollToIndex({ index: 0 })
    }


    return (
        <>
            <Header isSignedIn={isSignedIn} />
            <Wrapper>
                <FlatListHeader value={value} onChangeText={setValue} />
                <FlatList
                    ListEmptyComponent={
                        <EmptyList 
                            source={require("../assets/images/Box.png")} 
                            title="No messages found"
                            subtitle="Start a new conversation with U-pamers"
                        />
                    }
                    ref={(ref) => flatListRef.current = ref}
                    showsVerticalScrollIndicator={false}
                    data={chats}
                    renderItem={({item, index}) => {
                        const dude = item.users.find(uid => uid !== user?.id);
                        if (!dude) return;

                        const otherUser = storedUsers[dude];
                        return <ChatUserCard user={{...otherUser, key: item.key, latestMessage: item.latestMessageText}} navigation={navigation} style={index == userChats.length - 1 ? '' : 'border-b border-gray-300'} />
                    }} 
                />
                {chats.length > 0 && <ScrollUpButton onPress={handlePress} />}

            </Wrapper>
        </>
    )
}