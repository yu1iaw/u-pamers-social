import { useUser } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

import { Header } from "../components/Header";
import { Wrapper } from "../components/Wrapper";
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
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("AccountDetails")}
                        style={tw`bg-white flex-row items-center justify-between p-3 rounded-lg shadow`}
                    >
                        <Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.pr_text })}>
                            Account details
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color={theme.pr_text} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("ChangePassword")}
                        style={tw`bg-white flex-row items-center justify-between p-3 rounded-lg shadow`}
                    >
                        <Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.pr_text })}>
                            Change password
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color={theme.pr_text} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("ProfileDetails")}
                        style={tw`bg-white flex-row items-center justify-between p-3 rounded-lg shadow`}
                    >
                        <Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.pr_text })}>
                            Profile details
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color={theme.pr_text} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("Privacy")}
                        style={tw`bg-white flex-row items-center justify-between p-3 rounded-lg shadow`}
                    >
                        <Text style={tw.style(`text-base`, { fontFamily: "i_semi", color: theme.pr_text })}>
                            Privacy
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color={theme.pr_text} />
                    </TouchableOpacity>
                </View>
				
			</Wrapper>
		</>
	);
};
