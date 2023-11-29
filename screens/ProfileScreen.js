import { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Ionicons, Feather } from '@expo/vector-icons';

import { Banner } from "../components/Banner";
import { Header } from "../components/Header";
import { Wrapper } from "../components/Wrapper";
import theme from '../constants';
import { PaperButton } from "../components/PaperButton";
import { Button } from "react-native-paper";


const socials = [require('../assets/images/instagram.png'), require('../assets/images/linkedin.png'), require('../assets/images/telegram.png'), require('../assets/images/facebook.png'), require('../assets/images/skype.png')]


export const ProfileScreen = ({navigation}) => {
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const { isSignedIn, user } = useUser();

    return (
        <>
            <Header isSignedIn={isSignedIn} />
            {isBannerVisible && <Banner setIsBannerVisible={setIsBannerVisible} isSignedIn={isSignedIn} />}
            <Wrapper>
                <TouchableOpacity onPress={navigation.goBack} style={tw`flex-row gap-x-2 items-center py-4`}>
                    <Ionicons name="chevron-back" size={24} color={theme.sec_btn}/>
                    <Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_btn })}>Catalogue</Text>
                </TouchableOpacity>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={tw.style(`text-2xl my-4`, { fontFamily: "i_bold", color: theme.accent })}>My profile</Text>
                    <View style={tw`h-[56px] bg-[#9AA0FE] rounded-t-xl`}/>
                    <View style={tw`items-center`}>
                        <Pressable style={({pressed}) => tw.style(`bg-gray-500 rounded-full -mt-10 mb-5`, pressed && { opacity: 0.8 })}>
                            <Image source={{uri: user?.imageUrl}} style={tw`w-[96px] h-[96px] rounded-full`} />
                            <View style={tw`absolute bottom-0 right-0 bg-[${theme.btn}] p-2 rounded-lg`}>
                                <Feather name="edit-2" size={16} color="white" />
                            </View>
                        </Pressable>
                        <Text style={tw.style(`text-2xl capitalize`, { fontFamily: "i_bold", color: theme.pr_text })}>{user?.fullName}</Text>
                        <Text style={tw.style(`text-sm capitalize`, { fontFamily: "i_medium", color: theme.sec_text })}>Country, City</Text>
                        <View style={tw`flex-row gap-x-2 mt-2`}>
                            {socials.map((item, i) => (
                                <TouchableOpacity key={i}>
                                    <Image source={item} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <PaperButton style="w-full my-8" title="Edit Profile" onPress={() => navigation.navigate("Settings")} />
                        <Image source={require('../assets/images/Box.png')} />
                        <View style={tw`items-center my-8`}>
                            <Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>No details yet</Text>
                            <View style={tw`flex-row items-center justify-center`}>
                                <Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_text })}>Edit profile to provide more</Text>
                                <Button onPress={() => navigation.navigate("Settings")} style={tw`-ml-2 -mr-2`} labelStyle={tw.style(`text-base`, { fontFamily: "i_semi", color: "#0066CC" })}>
                                    details 
                                </Button>
                            </View>
                        </View>
                    </View>
                </ScrollView>


            </Wrapper>
        </>
    )
}