import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { useNavigation } from "@react-navigation/native";
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
	const [countryCities, setCountryCities] = useState([]);
	const [city, setCity] = useState("");
	const [fromValue, setFromValue] = useState(0);
	const [toValue, setToValue] = useState(0);
	const navigation = useNavigation();
	console.log(filter);
	console.log(country);
	console.log(countryCode);
	console.log(city);
	console.log(fromValue);


	return (
		<Wrapper>
			<PaddingTop />
			<TouchableOpacity onPress={navigation.goBack} style={tw`flex-row gap-x-2 items-center py-4`}>
				<Ionicons name="chevron-back" size={24} color={theme.pr_text} />
				<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.pr_text })}>Catalogue</Text>
			</TouchableOpacity>
			<ScrollView 
                style={tw`flex-initial mt-2`}
                showsVerticalScrollIndicator={false}
            >
				<View>
					<Text style={tw.style(`text-2xl`, { fontFamily: "i_bold", color: theme.accent })}>Filters</Text>
					<Text style={tw.style(`text-xs`, { fontFamily: "i", color: theme.sec_text })}>15777 users found</Text>
				</View>
				<SelectDropdown
					data={["Location", "Age"]}
					onSelect={(selectedItem, index) => {
						if (index === 1) {
							setCountry("");
							setCountryCode("");
						}
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
				{filter === "Location" && (
					<View style={tw`gap-y-3`}>
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
					</View>
				)}
			</ScrollView>
			{filter === "Location" && (
				<>
					<GooglePlacesAutocomplete
						placeholder="City or village"
						debounce={500}
						minLength={2}
						enablePoweredByContainer={false}
						styles={toInputBoxStyles}
						onPress={(data, details = null) => {
							setCity(data.structured_formatting.main_text);
                            console.log(details)
						}}
						query={{
							key: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
							language: "en",
                            type: "(cities)",
							components: `country:${countryCode.toLowerCase()}`,
						}}
					/>

					{!country && <Text style={tw.style(`text-xs`, { fontFamily: "i", color: theme.accent })}>Please select country first</Text>}
				</>
			)}

			{filter === "Age" && (
				<View style={tw`gap-y-8 mb-[110px]`}>
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
			)}

			{filter && (
				<View style={tw`mt-auto w-full gap-y-3 mb-4`}>
					<PaperButton title="Apply" filled onPress={() => navigation.navigate("DrawerHome")} />
					<PaperButton title="Cancel" onPress={navigation.goBack} />
				</View>
			)}
		</Wrapper>
	);
};

const toInputBoxStyles = StyleSheet.create({
	container: {
		flex: 0,
		marginTop: 20,
		marginBottom: 12,
		backgroundColor: "white",
		borderRadius: 8,
		borderColor: "#9ca3af",
		borderWidth: 1,
		overflow: "hidden",
		zIndex: 50
	},
	textInput: {
        fontFamily: "i",
		fontSize: 16,
        lineHeight: 24,
        color: theme.sec_text,
		backgroundColor: "white",
        marginBottom: 0
	},
	textInputContainer: {
		paddingHorizontal: 8,
		alignItems: "center",
	},
});
