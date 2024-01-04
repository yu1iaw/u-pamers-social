import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { LogBox, View } from "react-native";
import tw from "twrnc";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { PaperProvider } from "react-native-paper";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Provider } from "react-redux";
import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from '@env';

import { store } from "./redux/store";
import { AppNavigator } from "./navigation/AppNavigator";
LogBox.ignoreLogs(['Calling getExpoPushTokenAsync']);


const tokenCache = {
	async getToken(key) {
		try {
			return SecureStore.getItemAsync(key);
		} catch (err) {
			return null;
		}
	},
	async saveToken(key, value) {
		try {
			return SecureStore.setItemAsync(key, value);
		} catch (err) {
			return;
		}
	},
};

SplashScreen.preventAutoHideAsync();



export default function App() {
	const [isFontsLoaded] = useFonts({
		i: require("./assets/fonts/Inter-Regular.ttf"),
		i_semi: require("./assets/fonts/Inter-SemiBold.ttf"),
		i_bold: require("./assets/fonts/Inter-Bold.ttf"),
		i_medium: require("./assets/fonts/Inter-Medium.ttf"),
	});


	const onLayout = useCallback(async () => {
		if (isFontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [isFontsLoaded]);

	if (!isFontsLoaded) return null;


	return (
		<NavigationContainer>
			<Provider store={store}>
				<ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
					<PaperProvider>
						<View onLayout={onLayout} style={tw`flex-1`}>
							<StatusBar style="auto" />
							<AppNavigator />
						</View>
					</PaperProvider>
				</ClerkProvider>
			</Provider>
		</NavigationContainer>
	);
}

