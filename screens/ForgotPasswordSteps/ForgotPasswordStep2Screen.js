import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import tw from "twrnc";

import { ModalHeader } from "../../components/ModalHeader";
import { PaddingTop } from "../../components/PaddingTop";
import { Wrapper } from "../../components/Wrapper";
import { PaperButton } from "../../components/PaperButton";
import { Input } from "../../components/Input";
import theme from "../../constants";



export const ForgotPasswordStep2Screen = ({ navigation, route }) => {
	const [code, setCode] = useState("");

    const handleConfirmPress = () => {
        if (!code) return;

        navigation.navigate("ForgotPasswordStep3", { code })
    }

	return (
		<Wrapper>
			<PaddingTop />
			<ModalHeader title="Password reset" />
            <ScrollView
                contentContainerStyle={tw`pb-4`}
                showsVerticalScrollIndicator={false}
            >
                <View style={tw`items-center gap-y-4 mt-8`}>
                    <Image source={require("../../assets/images/Email-Check.png")} />
                    <View style={tw`gap-y-2 mt-4`}>
                        <Text style={tw.style(`text-center text-2xl`, { fontFamily: "i_bold", color: theme.pr_text })}>Enter code</Text>
                        <Text style={tw.style(`text-center text-base`, { fontFamily: "i_medium", color: theme.sec_text })}>
                            Please check your email and provide the verification code
                        </Text>
                    </View>
                    <View style={tw`w-full my-7 gap-y-3`}>
                        <Input 
                            placeholder={route.params?.email} 
                            disabled
                            email 
                        />
                        <Input 
                            placeholder="Verification Code" 
                            value={code}
                            onChangeText={code => setCode(code)}
                            email 
                        />
                    </View>

                </View>
                <PaperButton 
                    style="w-full mb-2" 
                    title="Confirm code" 
                    filled 
                    onPress={handleConfirmPress} 
                />
            </ScrollView>
		</Wrapper>
	);
};
