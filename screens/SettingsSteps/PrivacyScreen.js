import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { Wrapper } from "../../components/Wrapper";
import { Header } from "../../components/Header";
import theme from "../../constants";
import { Switch } from "react-native-paper";

export const PrivacyScreen = ({ navigation }) => {
	const [privacy, setPrivacy] = useState({
        privateAccount: false,
        age: false,
        location: false,
        description: false
    });
	const { isSignedIn } = useUser();


    const onToggleSwitch = (name) => {
        if (name === "privateAccount" && !privacy.privateAccount) {
            return setPrivacy({privateAccount: true, age: false, location: false, description: false});
        }
        setPrivacy({...privacy, [name]: !privacy[name]})
    }

    // useEffect(() => {
    //     if (privacy.privateAccount) {
    //         setPrivacy({...privacy, age: false, location: false, description: false})
    //     }
    // }, [privacy.privateAccount])


	return (
		<>
			<Header isSignedIn={isSignedIn} />
			<Wrapper>
				<TouchableOpacity onPress={navigation.goBack} style={tw`flex-row gap-x-2 items-center py-4`}>
					<Ionicons name="chevron-back" size={24} color={theme.sec_btn} />
					<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_btn })}>Settings</Text>
				</TouchableOpacity>
				<Text style={tw.style(`text-2xl mt-4`, { fontFamily: "i_bold", color: theme.accent })}>Privacy</Text>
				<View style={tw`bg-white px-3 py-7 my-4 gap-y-4 rounded-lg shadow`}>
                    <View>
                        <View style={tw`flex-row items-center justify-between`}>
                            <Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.darkest })}>Private Account</Text>
                            <Switch color={theme.btn} value={privacy.privateAccount} onValueChange={() => onToggleSwitch("privateAccount")} />
                        </View>
                        <Text style={tw.style(`text-sm w-[85%] -mt-1`, { fontFamily: "i", color: theme.accent })}>
                            The private account is not viewable to users who are not logged in
                        </Text>
                    </View>
                    <View style={tw`flex-row items-center justify-between`}>
                        <Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: privacy.privateAccount ? theme.disabled : theme.pr_text })}>Age</Text>
                        <Switch 
                            disabled={privacy.privateAccount}
                            color={theme.btn} 
                            value={privacy.age} 
                            onValueChange={() => onToggleSwitch("age")} 
                        />
                    </View>
                    <View style={tw`flex-row items-center justify-between`}>
                        <Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: privacy.privateAccount ? theme.disabled : theme.pr_text })}>Location</Text>
                        <Switch 
                            disabled={privacy.privateAccount}
                            color={theme.btn} 
                            value={privacy.location} 
                            onValueChange={() => onToggleSwitch("location")} 
                        />
                    </View>
                    <View style={tw`flex-row items-center justify-between`}>
                        <Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: privacy.privateAccount ? theme.disabled : theme.pr_text })}>Description</Text>
                        <Switch 
                            disabled={privacy.privateAccount}
                            color={theme.btn} 
                            value={privacy.description} 
                            onValueChange={() => onToggleSwitch("description")} 
                        />
                    </View>
                </View>
			</Wrapper>
		</>
	);
};
