import { useState, useRef, useCallback } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { EXPO_PUBLIC_GOOGLE_PLACES_API_KEY } from "@env";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { PaperButton } from "../../components/PaperButton";
import { interests, chipIcons } from "../../data";
import { PaperPortal } from "../../components/PaperPortal";
import { ChipsWrapper } from "../../components/ChipsWrapper";
import { SocialMediaInput } from "../../components/SocialMediaInput";
import { firebaseInit } from "../../firebase/firebaseInit";
import { setPersonalData } from "../../redux/personalSlice";
import theme from "../../constants";



export const ProfileDetailsScreen = ({navigation}) => {
    const { personalData } = useSelector(state => state.personalInfo);
    const { socialMedia: sm } = personalData;
    const [showModal, setShowModal] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [birth, setBirth] = useState(personalData?.age || '');
    const [location, setLocation] = useState(personalData?.location || '');
    const [aboutMe, setAboutMe] = useState(personalData?.aboutMe || '');
    const [selectedChips, setSelectedChips] = useState(personalData?.interests || []);
    const [socialMedia, setSocialMedia] = useState({
        linkedin: sm ? sm[0]?.linkedin : "",
        instagram: sm ? sm[1]?.instagram : "",
        telegram: sm ? sm[2]?.telegram : "",
        facebook: sm ? sm[3]?.facebook : "",
        skype: sm ? sm[4]?.skype : ""
    });
    const { isSignedIn, user } = useUser();
    const dispatch = useDispatch();
    const scrollviewRef = useRef(null);
    const googleRef = useRef(null);
    
    const profileDetailsJson = JSON.stringify({birth, location, aboutMe, selectedChips, socialMedia});
    const profileDetailsRef = useRef(profileDetailsJson);

    const isInputFilled = birth || location || aboutMe || selectedChips.length || socialMedia.linkedin || socialMedia.instagram || socialMedia.telegram || socialMedia.facebook || socialMedia.skype;


    const handleBackPress = () => {
        if (isInputFilled && profileDetailsRef.current !== profileDetailsJson) {
            setShowModal(true);
        } else {
            navigation.goBack()
        }
    }

    const onChangeText = useCallback((text, name) => {
        setSocialMedia({...socialMedia, [name]: text});
    }, [socialMedia])
    

    const onChangeAboutMeText = (text) => {
        if (text.length > 500) return;
        setAboutMe(text);
    }


    const updateUserProfileDetails = useCallback(async () => {
        if (isInputFilled && profileDetailsRef.current !== profileDetailsJson) {
            try {
                const app = firebaseInit();
                const db = getFirestore(app);
                const userRef = doc(collection(db, 'users'), `${user?.id}`);
                const userProfileDetails = {
                    age: birth,
                    location,
                    aboutMe,
                    interests: selectedChips,
                    socialMedia: [
                        { linkedin: socialMedia.linkedin },
                        { instagram: socialMedia.instagram },
                        { telegram: socialMedia.telegram },
                        { facebook: socialMedia.facebook },
                        { skype: socialMedia.skype },
                    ],
                };
        
                await updateDoc(userRef, userProfileDetails);
                dispatch(setPersonalData(userProfileDetails));   
            } catch(e) {
                console.log(e);
            } 
        }

        navigation.navigate("Settings");

    }, [birth, location, aboutMe, selectedChips, socialMedia])
    
    
	return (
		<>
			<Header isSignedIn={isSignedIn} />
			<TouchableOpacity onPress={handleBackPress} style={tw`flex-row gap-x-2 items-center px-4 py-4`}>
				<Ionicons name="chevron-back" size={24} color={theme.sec_btn} />
				<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_btn })}>Settings</Text>
			</TouchableOpacity>
            <PaperPortal showModal={showModal} setShowModal={setShowModal} setup />
			<ScrollView 
                ref={ref => scrollviewRef.current = ref}
                showsVerticalScrollIndicator={false} 
                keyboardShouldPersistTaps="always"
            >
				<Text style={tw.style(`text-2xl mt-4 px-4`, { fontFamily: "i_bold", color: theme.accent })}>Profile details</Text>
				<View style={tw`bg-white px-3 py-7 mx-4 my-4 gap-y-3 rounded-lg shadow`}>
                    <Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>General info</Text>
                    <Pressable onPress={() => setShowCalendar(!showCalendar)}>
                        <Input 
                            placeholder={"Date of birth"} 
                            birth
                            value={birth}
                            editable={false}
                        />
                    </Pressable>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        onContentSizeChange={() => googleRef.current?.isFocused() && scrollviewRef.current?.scrollTo({x: 0, y: 208, animated: true})}
                    >
                        <GooglePlacesAutocomplete
                            ref={googleRef}
                            placeholder={location || "Location"}
                            debounce={500}
                            minLength={2}
                            disableScroll
                            enablePoweredByContainer={false}
                            styles={toInputBoxStyles}
                            onPress={(data, details) => {
                                const city = data.structured_formatting.main_text;
                                const country = data.structured_formatting.secondary_text.split(',').at(-1).trim();
                                setLocation(`${city}, ${country}`)
                            }}
                            query={{
                                key: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
                                language: "en",
                                type: "(cities)"
                            }}
                        />
                    </ScrollView>
                    {showCalendar && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            onChange={({type, nativeEvent: {timestamp}}) => {
                                if (type === "dismissed") return setShowCalendar(false);
                                setShowCalendar(false);
                                const selected = new Date(timestamp).toLocaleDateString('uk-UA').split('.').reverse();
                                const now = new Date().toLocaleDateString('uk-UA').split('.').reverse();
                                const diff = now.map((item, i) => item - selected[i]);
    
                                let age;
                                if (diff[1] > 0) age = diff[0];
                                if (diff[1] < 0) age = diff[0] - 1;
                                if (diff[1] === 0) {
                                    if (diff[2] < 0) age = diff[0] - 1;
                                    else age = diff[0];
                                }
                                if (age < 0) age = 0;
                                
                                setBirth(age.toString());
                            }}
                        />
                    )}
                               
                    <Input 
                        placeholder={"About me"}
                        value={aboutMe}
                        onChangeText={onChangeAboutMeText}
                        multiline
                        numberOfLines={4}
                        style={'pt-2 pb-2'}   
                    />
				</View>
				<View style={tw`bg-white px-3 py-7 mx-4 my-4 gap-y-3 rounded-lg shadow`}>
                    <Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>Social media</Text>
                    <View style={tw`gap-y-3 mt-6`}>
                        <SocialMediaInput 
                            name="linkedin"
                            imageSource={require("../../assets/images/linkedin.png")}
                            placeholder={"Linkedin URL"} 
                            value={socialMedia.linkedin}
                            onChangeText={onChangeText}
                        />
                        <SocialMediaInput
                            name="instagram"
                            imageSource={require("../../assets/images/instagram.png")}
                            placeholder={"Instagram URL"} 
                            value={socialMedia.instagram}
                            onChangeText={onChangeText}
                        />
                        <SocialMediaInput 
                            name="telegram"
                            imageSource={require("../../assets/images/telegram.png")}
                            placeholder={"Telegram URL"} 
                            value={socialMedia.telegram}
                            onChangeText={onChangeText}
                        />
                        <SocialMediaInput 
                            name="facebook"
                            imageSource={require("../../assets/images/facebook.png")}
                            placeholder={"Facebook URL"} 
                            value={socialMedia.facebook}
                            onChangeText={onChangeText}
                        />
                        <SocialMediaInput 
                            name="skype"
                            imageSource={require("../../assets/images/skype.png")}
                            placeholder={"Skype URL"} 
                            value={socialMedia.skype}
                            onChangeText={onChangeText}
                        />
                    </View>
				</View>
				<View style={tw`bg-white px-3 py-7 mx-4 my-4 gap-y-3 rounded-lg shadow`}>
                    <Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>Interests</Text>
                    <View style={tw`flex-row flex-wrap gap-3`}>
                        {interests.map((item, index) => {
                            const isSelected = selectedChips.includes(item);
            
                            const handlePress = () => {
                                if (isSelected) {
                                    setSelectedChips(selectedChips.filter(chip => chip !== item))
                                } else {
                                    setSelectedChips([...selectedChips, item])
                                }
                            }

                            return (
                                <ChipsWrapper
                                    key={index} 
                                    onPress={handlePress} 
                                    buttonStyle={`flex-row items-center gap-x-2 p-1 border rounded-full ${isSelected ? 'bg-[#EBEEFF] border-[#6168E4]' : "border-[#a5a8ba]"}`}
                                    textStyle={`text-base text-[${theme.pr_text}]`}
                                    fontFamily="i_medium"
                                    text={item}
                                    imageSource={chipIcons[index]}
                                    iconName={isSelected ? "close" : "plus"}   
                                    selectedChips={selectedChips.length}
                                />
                            )
                        })}
                    </View>
				</View>
			    <PaperButton onPress={updateUserProfileDetails} title="Save updates" filled style={`mt-5 mx-4 mb-6`} />
			</ScrollView>
		</>
	);
}


const toInputBoxStyles = StyleSheet.create({
	container: {
		flex: 0,
        width: "100%",
        
		marginVertical: 12,
		backgroundColor: "white",
		borderRadius: 4,
		borderColor: "#9ca3af",
		borderWidth: 1,
		overflow: "hidden",
		zIndex: 50
	},
	textInput: {
        width: "100%",
        height: 56,
        fontFamily: "i",
		fontSize: 16,
        lineHeight: 24,
        color: theme.pr_text,
		backgroundColor: "white",
        marginBottom: 0
	},
	textInputContainer: {
        width: "100%",
		paddingHorizontal: 8
	},
});