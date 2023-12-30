import { useUser } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

import { Header } from "../components/Header";
import { Wrapper } from "../components/Wrapper";
import { SettingsSection } from "../components/SettingsSection";
import theme from '../constants';



export const SettingsScreen = ({navigation}) => {
	const { isSignedIn } = useUser();

	return (
		<>
			<Header isSignedIn={isSignedIn} />
			<Wrapper>
				<TouchableOpacity onPress={() => navigation.navigate("Home")} style={tw`flex-row gap-x-2 items-center py-4`}>
					<Ionicons name="chevron-back" size={24} color={theme.sec_btn} />
					<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_btn})}>Catalogue</Text>
				</TouchableOpacity>
                <Text style={tw.style(`text-2xl my-4`, { fontFamily: "i_bold", color: theme.accent })}>Settings</Text>
                <View style={tw`gap-y-3`}>
                    <SettingsSection direction="AccountDetails" title="Account details" navigation={navigation} />
                    <SettingsSection direction="ChangePassword" title="Change password" navigation={navigation} />
                    <SettingsSection direction="ProfileDetails" title="Profile details" navigation={navigation} />
                    <SettingsSection direction="Privacy" title="Privacy" navigation={navigation} />
                </View>
			</Wrapper>
		</>
	);
};
