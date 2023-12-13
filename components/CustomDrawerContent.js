import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Keyboard } from "react-native";
import tw from "twrnc";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import RangeSlider from "react-native-range-slider-expo";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { PaddingTop } from "./PaddingTop";
import { Wrapper } from "./Wrapper";
import { PaperButton } from "./PaperButton";
import { countries, countriesCode } from "../data";
import { EXPO_PUBLIC_GOOGLE_PLACES_API_KEY } from "@env";
import theme from "../constants";



export const CustomDrawerContent = () => {
	const [filter, setFilter] = useState("");
	const [country, setCountry] = useState("");
	const [countryCode, setCountryCode] = useState("");
	const [city, setCity] = useState("");
	const [fromValue, setFromValue] = useState(0);
	const [toValue, setToValue] = useState(0);
	const navigation = useNavigation();
	const scrollViewRef = useRef(null);


	const onApplyPress = () => {
		navigation.navigate("DrawerHome", { location: city.length ? city : country, age: { fromValue, toValue } });
	};


	return (
		<Wrapper>
			<PaddingTop />
			<TouchableOpacity onPress={navigation.goBack} style={tw`flex-row gap-x-2 items-center py-4`}>
				<Ionicons name="chevron-back" size={24} color={theme.pr_text} />
				<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.pr_text })}>Catalogue</Text>
			</TouchableOpacity>
			<View>
				<Text style={tw.style(`text-2xl`, { fontFamily: "i_bold", color: theme.accent })}>Filters</Text>
				<Text style={tw.style(`text-xs`, { fontFamily: "i", color: theme.sec_text })}>15777 users found</Text>
			</View>
			<ScrollView
				ref={(ref) => (scrollViewRef.current = ref)}
				onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
				onLayout={() => scrollViewRef.current?.scrollToEnd()}
				style={tw`flex-1 mt-2`}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="always">
				<SelectDropdown
					data={["Location", "Age"]}
					onSelect={(selectedItem, index) => {
						setFilter(selectedItem);
					}}
					defaultButtonText={"Filter by"}
					buttonTextAfterSelection={(selectedItem, index) => selectedItem}
					rowTextForSelection={(item, index) => item}
					buttonStyle={tw`w-full h-[50px] my-3 bg-white rounded-lg border border-gray-400`}
					buttonTextStyle={tw.style(`text-base text-left`, { fontFamily: "i", color: theme.pr_text })}
					renderDropdownIcon={(isOpened) => <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} color={theme.pr_text} size={18} />}
					dropdownIconPosition={"right"}
					dropdownStyle={tw`bg-white`}
					rowStyle={tw`border-b`}
					rowTextStyle={tw.style(`text-base text-center`, { fontFamily: "i", color: theme.hint })}
				/>

				<View style={tw.style(`gap-y-3 hidden`, filter === "Location" && "flex")}>
					<Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.accent })}>Location</Text>
					<SelectDropdown
						data={countries}
						onSelect={(selectedItem, index) => {
							setCountry(selectedItem);
							setCountryCode(countriesCode[index]);
						}}
						defaultButtonText={"Country"}
						buttonTextAfterSelection={(selectedItem, index) => selectedItem}
						rowTextForSelection={(item, index) => item}
						buttonStyle={tw`w-full h-[50px] bg-white rounded-lg border border-gray-400`}
						buttonTextStyle={tw.style(`text-base text-left`, { fontFamily: "i", color: theme.pr_text })}
						renderDropdownIcon={(isOpened) => <Ionicons name={isOpened ? "chevron-up" : "chevron-down"} color={theme.pr_text} size={18} />}
						dropdownStyle={tw`bg-white`}
						rowStyle={tw`border-b`}
						rowTextStyle={tw.style(`text-base text-center`, { fontFamily: "i", color: theme.hint })}
					/>
					<GooglePlacesAutocomplete
						placeholder="City or village"
						debounce={500}
						minLength={2}
						enablePoweredByContainer={false}
						styles={toInputBoxStyles}
						disableScroll
						onPress={(data, details = null) => {
							setCity(data.structured_formatting.main_text);
							// console.log(data.description.split(",").at(-1).trim());
						}}
						query={{
							key: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
							language: "en",
							type: "(cities)",
							components: `country:${countryCode.toLowerCase()}`,
						}}
					/>

					{!country && <Text style={tw.style(`text-xs -mt-[18px]`, { fontFamily: "i", color: theme.accent })}>Please select country first</Text>}
				</View>

				<View style={tw.style(`gap-y-8 hidden`, filter === "Age" && "flex")}>
					<Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.accent })}>Age</Text>
					<RangeSlider
						min={18}
						max={90}
						fromValueOnChange={(value) => setFromValue(value)}
						toValueOnChange={(value) => setToValue(value)}
						initialFromValue={22}
						initialToValue={44}
						fromKnobColor={theme.btn}
						toKnobColor={theme.btn}
						inRangeBarColor={theme.btn}
						rangeLabelsTextColor={theme.btn}
						valueLabelsBackgroundColor={theme.btn}
					/>
				</View>
			</ScrollView>

			{filter && (
				<View style={tw.style(`w-full gap-y-3 mb-4`, Keyboard.isVisible() && "hidden")}>
					<PaperButton title="Apply" filled onPress={onApplyPress} />
					<PaperButton title="Cancel" onPress={navigation.goBack} />
				</View>
			)}
			{filter && (
				<View style={tw.style(`absolute top-[67%] left-4 flex-row gap-x-2`, Keyboard.isVisible() && "hidden")}>
					{!!country && (
						<TouchableOpacity
							onPress={() => {
								if (!city.length) {
									setCountry("");
									setCountryCode("");
									return;
								} 
								setCity("");
							}}
							style={tw`bg-[#EBEEFF] flex-row items-center mt-4 gap-x-1 px-2 py-2 border border-[${theme.btn}] rounded-full`}>
							<Text style={tw.style(`text-sm`, { fontFamily: "i", color: theme.pr_text })}>
								{city.length ? city.slice(0, 10) : country.slice(0, 10)}
							</Text>
							<AntDesign name="close" size={14} color={theme.pr_text} style={tw`pt-0.5`} />
						</TouchableOpacity>
					)}
					{fromValue > 0 && toValue > 0 && (
						<TouchableOpacity
							onPress={() => {
								setFromValue(0);
								setToValue(0);
							}}
							style={tw`bg-[#EBEEFF] flex-row items-center mt-4 gap-x-1 px-2 py-2 border border-[${theme.btn}] rounded-full`}>
							<Text style={tw.style(`text-sm`, { fontFamily: "i", color: theme.pr_text })}>
								{fromValue} - {toValue} years
							</Text>
							<AntDesign name="close" size={14} color={theme.pr_text} style={tw`pt-0.5`} />
						</TouchableOpacity>
					)}
				</View>
			)}
		</Wrapper>
	);
};

const toInputBoxStyles = StyleSheet.create({
	container: {
		flex: 0,
		marginVertical: 12,
		backgroundColor: "white",
		borderRadius: 8,
		borderColor: "#9ca3af",
		borderWidth: 1,
		overflow: "hidden",
		zIndex: 50,
	},
	textInput: {
		fontFamily: "i",
		fontSize: 16,
		lineHeight: 24,
		color: theme.sec_text,
		backgroundColor: "white",
		marginBottom: 0,
	},
	textInputContainer: {
		paddingHorizontal: 8,
		alignItems: "center",
	},
});
