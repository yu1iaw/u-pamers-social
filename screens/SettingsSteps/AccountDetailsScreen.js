import { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';


import { Header } from "../../components/Header";
import theme from '../../constants';
import { Input } from "../../components/Input";
import { PaperButton } from "../../components/PaperButton";



export const AccountDetailsScreen = ({navigation}) => {
    const [emailAddress, setEmailAddress] = useState('');
    const { isSignedIn } = useUser();

    return (
        <>
            <Header isSignedIn={isSignedIn} />
            <TouchableOpacity onPress={navigation.goBack} style={tw`flex-row gap-x-2 items-center px-4 py-4`}>
                <Ionicons name="chevron-back" size={24} color={theme.sec_btn} />
                <Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_btn})}>Settings</Text>
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={tw.style(`text-2xl mt-4 px-4`, { fontFamily: "i_bold", color: theme.accent })}>Account details</Text>
                <View style={tw`bg-white px-3 py-7 mx-4 my-4 gap-y-3 rounded-lg shadow`}>
                    <Input 
                        placeholder={"Login"} 
                        value={emailAddress}
                        email 
                        onChangeText={(email) => setEmailAddress(email) }
                    />
                    <Input 
                        placeholder={"First Name"} 
                        value={emailAddress}
                        email 
                        onChangeText={(email) => setEmailAddress(email) }
                    />
                    <Input 
                        placeholder={"Second Name"} 
                        value={emailAddress}
                        email 
                        onChangeText={(email) => setEmailAddress(email) }
                    />
                    <PaperButton title="Save updates" filled style={`mt-5`} />
                </View>
            </ScrollView>
        </>
    )
}