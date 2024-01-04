import { useEffect, useRef } from "react";
import { Alert, Platform } from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { MessagesScreen } from "../screens/MessagesScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { SignUpScreen } from "../screens/SignUpScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { SignUpStep2Screen } from "../screens/SignUpSteps/SignUpStep2Screen";
import { SignUpStep3Screen } from "../screens/SignUpSteps/SignUpStep3Screen";
import { SignUpSuccessScreen } from "../screens/SignUpSteps/SignUpSuccessScreen";
import { ForgotPasswordStep2Screen } from "../screens/ForgotPasswordSteps/ForgotPasswordStep2Screen";
import { ForgotPasswordStep3Screen } from "../screens/ForgotPasswordSteps/ForgotPasswordStep3Screen";
import { ForgotPasswordSuccessScreen } from "../screens/ForgotPasswordSteps/ForgotPasswordSuccessScreen";
import { CustomDrawerContent } from "../components/CustomDrawerContent";
import { AccountDetailsScreen } from "../screens/SettingsSteps/AccountDetailsScreen";
import { ChangePasswordScreen } from "../screens/SettingsSteps/ChangePasswordScreen";
import { ProfileDetailsScreen } from "../screens/SettingsSteps/ProfileDetailsScreen";
import { PrivacyScreen } from "../screens/SettingsSteps/PrivacyScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



const DrawerNavigator = () => {
	return (
		<Drawer.Navigator drawerContent={() => <CustomDrawerContent />}>
			<Drawer.Screen name="DrawerHome" component={HomeScreen} options={{ headerShown: false, swipeEnabled: false }} />
		</Drawer.Navigator>
	);
};



export const AppNavigator = () => {
	const responseListener = useRef();
	// const navigation = useNavigation();


	useEffect(() => {
		registerForPushNotificationsAsync();

		// notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
		//   console.log(notification)
		// });

		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			// const { data } = response.notification.request.content;

			// const pushAction = StackActions.push("Messages");
			// navigation.dispatch(pushAction);
		});

		return () => {
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);


	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Home" component={DrawerNavigator} />
			<Stack.Group screenOptions={{ presentation: "modal" }}>
				<Stack.Screen name="SignUp" component={SignUpScreen} />
				<Stack.Screen name="SignUpStep2" component={SignUpStep2Screen} />
				<Stack.Screen name="SignUpStep3" component={SignUpStep3Screen} />
				<Stack.Screen name="SignUpSuccess" component={SignUpSuccessScreen} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
				<Stack.Screen name="ForgotPasswordStep2" component={ForgotPasswordStep2Screen} />
				<Stack.Screen name="ForgotPasswordStep3" component={ForgotPasswordStep3Screen} />
				<Stack.Screen name="ForgotPasswordSuccess" component={ForgotPasswordSuccessScreen} />
				<Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
				<Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
				<Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
				<Stack.Screen name="Privacy" component={PrivacyScreen} />
			</Stack.Group>
			<Stack.Screen name="Messages" component={MessagesScreen} />
			<Stack.Screen name="Chat" component={ChatScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="Settings" component={SettingsScreen} />
		</Stack.Navigator>
	);
};


async function registerForPushNotificationsAsync() {

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			Alert.alert("Error", "Failed to get push token for push notification!");
			return;
		}
	} else {
		console.log("Must use physical device for Push Notifications");
	}
}
