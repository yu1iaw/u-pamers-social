import { Image, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { MaterialCommunityIcons } from '@expo/vector-icons';
 
import theme from '../constants';
import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';


const socials = [require('../assets/images/instagram.png'), require('../assets/images/linkedin.png'), require('../assets/images/telegram.png'), require('../assets/images/facebook.png')]


export const UserCard = memo(({user, isSignedIn, onPress}) => {
const navigation = useNavigation();

    return (
        <View style={tw`bg-white p-3 gap-x-3 rounded-xl flex-row items-start justify-between shadow-md`}>
            <View style={tw`flex-1 flex-row gap-x-4`}>
                <View>
                    <Image source={{uri: user?.image}} style={tw`w-[50px] h-[70px] rounded-full -mt-2`}/>
                </View>
                <View style={tw`flex-1 gap-y-3`}>
                    <Text numberOfLines={2} style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>{user?.firstName} {user?.lastName}, {user?.age}</Text>
                    <Text style={tw.style(`text-sm -mt-3`, { fontFamily: "i_medium" })}>{user?.address?.city ?? ':)'}, {user?.address?.state}</Text>
                    <View style={tw`flex-row gap-x-2`}>
                        { socials.map((item, i) => (
                            <TouchableOpacity key={i}>
                                <Image source={item} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={isSignedIn ? () => navigation.navigate("Chat") : () => onPress(true)} style={tw`p-2 bg-[${theme.btn}] rounded-lg`}>
                <MaterialCommunityIcons name="message-text-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
})