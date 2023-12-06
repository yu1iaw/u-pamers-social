import { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { PaperButton } from "../../components/PaperButton";
import { interests, chipIcons } from "../../data";
import { PaperPortal } from "../../components/PaperPortal";
import theme from "../../constants";



export const ProfileDetailsScreen = ({navigation}) => {
    const [showModal, setShowModal] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [birth, setBirth] = useState('');
    const [selectedChips, setSelectedChips] = useState([]);
    const { isSignedIn } = useUser();

    const handleBackPress = () => {
        if (birth || selectedChips.length) {
            setShowModal(true);
        } else {
            navigation.goBack()
        }

    }


	return (
		<>
			<Header isSignedIn={isSignedIn} />
			<TouchableOpacity onPress={handleBackPress} style={tw`flex-row gap-x-2 items-center px-4 py-4`}>
				<Ionicons name="chevron-back" size={24} color={theme.sec_btn} />
				<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.sec_btn })}>Settings</Text>
			</TouchableOpacity>
            <PaperPortal showModal={showModal} setShowModal={setShowModal} setup />
			<ScrollView showsVerticalScrollIndicator={false}>
				<Text style={tw.style(`text-2xl mt-4 px-4`, { fontFamily: "i_bold", color: theme.accent })}>Profile details</Text>
				<View style={tw`bg-white px-3 py-7 mx-4 my-4 gap-y-3 rounded-lg shadow`}>
                    <Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>General info</Text>
                    <Input 
                        placeholder={"Date of birth"} 
                        birth
                        onChangeText={() => setShowCalendar(true)}
                        onFocus={() => setShowCalendar(true)}
                        value={birth}
                    />
                    <DateTimePicker
                        isVisible={showCalendar}
                        mode="date"
                        onConfirm={(selectedDate) => {
                            setBirth(selectedDate.toISOString().substring(0, 10).split('-').reverse().join('-'));
                            setShowCalendar(false);
                        }}
                        onCancel={() => setShowCalendar(false)}
                    />
					<Input 
                        placeholder={"Location"} 
                    />
					<Input 
                        placeholder={"About me"}
                        multiline
                        numberOfLines={4}
                        style={'pt-2'}
                         
                     />
				</View>
				<View style={tw`bg-white px-3 py-7 mx-4 my-4 gap-y-3 rounded-lg shadow`}>
                    <Text style={tw.style(`text-lg`, { fontFamily: "i_bold", color: theme.pr_text })}>Social media</Text>
                    <View style={tw`gap-y-3 mt-6`}>
                        <View style={tw`flex-row gap-x-2 items-center`}>
                            <Image source={require("../../assets/images/linkedin.png")} />
                            <Input placeholder={"Linkedin URL"} style={'flex-1'} email />
                        </View>
                        <View style={tw`flex-row gap-x-2 items-center`}>
                            <Image source={require("../../assets/images/instagram.png")} />
                            <Input placeholder={"Instagram URL"} style={'flex-1'} email />
                        </View>
                        <View style={tw`flex-row gap-x-2 items-center`}>
                            <Image source={require("../../assets/images/telegram.png")} />
                            <Input placeholder={"Telegram URL"} style={'flex-1'} email />
                        </View>
                        <View style={tw`flex-row gap-x-2 items-center`}>
                            <Image source={require("../../assets/images/facebook.png")} />
                            <Input placeholder={"Facebook URL"} style={'flex-1'} email />
                        </View>
                        <View style={tw`flex-row gap-x-2 items-center`}>
                            <Image source={require("../../assets/images/skype.png")} />
                            <Input placeholder={"Skype URL"} style={'flex-1'} email />
                        </View>
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
                                <TouchableOpacity 
                                    onPress={handlePress} 
                                    key={index} 
                                    style={tw`flex-row items-center gap-x-2 p-1 border rounded-full ${isSelected ? 'bg-[#EBEEFF] border-[#6168E4]' : "border-[#a5a8ba]"}`}
                                >
                                    <View style={tw`bg-[#363A7E] w-[32px] h-[32px] justify-center items-center rounded-full overflow-hidden`}>
                                        <Image source={chipIcons[index]} />
                                    </View>
                                    <Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.pr_text })}>{item}</Text>
                                    <AntDesign name={isSelected ? "close" : "plus"} size={18} color={theme.pr_text} />
                                </TouchableOpacity>
                            )
                        })}
                    </View>
				</View>
			</ScrollView>
			<PaperButton title="Save updates" filled style={`mt-5 mx-4 mb-6`} />
		</>
	);
}