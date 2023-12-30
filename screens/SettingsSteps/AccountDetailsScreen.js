import { useRef, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { PaperButton } from "../../components/PaperButton";
import { firebaseInit } from "../../firebase/firebaseInit";
import { setPersonalData } from "../../redux/personalSlice";
import theme from '../../constants';



export const AccountDetailsScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const { isLoaded, isSignedIn, user } = useUser();
    const [name, setName] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName
    });
    const firstRef = useRef(name.firstName);
    const lastRef = useRef(name.lastName);


    const updateUser = async () => {
        if (!isLoaded || !name.firstName || !name.lastName) return;

        if (firstRef.current !== name.firstName || lastRef.current !== name.lastName) {
            await user.update({
                firstName: name.firstName,
                lastName: name.lastName,
            });
    
            const personalName = {
                firstName: name.firstName,
                lastName: name.lastName,
                firstLast: `${name.firstName} ${name?.lastName}`.toLowerCase()
            };

            try {
                const app = firebaseInit();
                const db = getFirestore(app);
                const userRef = doc(collection(db, "users"), `${user?.id}`);
        
                await updateDoc(userRef, personalName);
                dispatch(setPersonalData(personalName));
            } catch(e) {
                console.log(e);
            }
        }
        // user.reload();
        navigation.navigate("Profile", { tabs: true });
	};


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
                        disabled
                        value={user?.emailAddresses[0].emailAddress}
                    />
                    <Input 
                        placeholder={"First Name"} 
                        value={name.firstName}
                        onChangeText={(text) => setName({...name, firstName: text}) }
                    />
                    <Input 
                        placeholder={"Second Name"} 
                        value={name.lastName}
                        onChangeText={(text) => setName({...name, lastName: text}) }
                    />
                    <PaperButton onPress={updateUser} title="Save updates" filled style={`mt-5`} />
                </View>
            </ScrollView>
        </>
    )
}