import { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { FontAwesome } from '@expo/vector-icons';
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { useDispatch } from "react-redux";

import { Input } from "../components/Input";
import { ModalHeader } from "../components/ModalHeader";
import { PaddingTop } from "../components/PaddingTop";
import { PaperButton } from "../components/PaperButton";
import { Wrapper } from "../components/Wrapper";
import theme from "../constants";
import { ErrorMessage } from "../components/ErrorMessage";
import { firebaseInit } from "../firebase/firebaseInit";
import { setPersonalData } from '../redux/personalSlice';



export const SignUpScreen = ({ navigation }) => {
	const { isLoaded, signUp, setActive } = useSignUp();
	const { user } = useUser();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState({
		firstName: "",
		lastName: "",
		emailAddress: "",
		password: "",
		confirmPassword: ""
	});
	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState("");
	const dispatch = useDispatch();


	const e = error.emailAddress || error.firstName || error.lastName || error.password || error.confirmPassword;
	const isVerified = !isLoaded || !firstName || !lastName || !emailAddress || !password || password !== confirmPassword;


	useEffect(() => {
		if (!user?.id) return;

		const createUserInDB = async () => {
			const app = firebaseInit();
			const db = getFirestore(app);
			const userRef = doc(collection(db, 'users'), `${user?.id}`);
			const userInfo = {
				firstName, 
				lastName,
				firstLast: `${firstName} ${lastName}`.toLowerCase(),
				emailAddress,
				id: user?.id
			};
			await setDoc(userRef, userInfo);
			dispatch(setPersonalData(userInfo));
		}
		createUserInDB();
	}, [user?.id])


	const onFocus = (inputName) => {
		setError({...error, [inputName]: ""})
	}

	const onBlur = (inputValue, inputName) => {
		if (!inputValue.length) setError({...error, [inputName]: "This field cannot be empty" })
		if (inputName === "confirmPassword" && password !== confirmPassword) setError({...error, confirmPassword: "Invalid password"})
	}


	const onSignUpPress = async () => {
		if (!isLoaded || isVerified) {
			return;
		}

		try {
			await signUp.create({
				firstName,
				lastName,
				emailAddress,
				password,
			});

			// send the email.
			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

			// change the UI to our pending section.
			setPendingVerification(true);
		} catch (err) {
			alert(err.errors[0].message);
		}
	};

	const onPressVerify = async () => {
		if (!isLoaded || !code) {
			return;
		}

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code,
			});

			await setActive({ session: completeSignUp.createdSessionId });
			navigation.navigate("SignUpStep2")
		} catch (err) {
			alert(err.errors[0].longMessage);
			navigation.goBack();
		}
	};

	return (
		<Wrapper>
			<PaddingTop />
			<ModalHeader title="Sign up" />
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={tw`my-5 items-center`}>
					<Image source={e ? require("../assets/images/Stepper-2.png") : require("../assets/images/Stepper.png")} resizeMode="contain" style={tw`w-full h-[40px]`} />
				</View>
				<View style={tw`gap-y-3`}>
					<Text style={tw.style(`text-center text-2xl m-4`, { fontFamily: "i_bold", color: theme.pr_text })}>Fill in account details</Text>
					{!pendingVerification ? (
						<>
							<Input 
								placeholder={"Login*"} 
								value={emailAddress} 
								error={!!error.emailAddress} 
								email
								onFocus={() => onFocus("emailAddress")}
								onBlur={() => onBlur(emailAddress, 'emailAddress')} 
								onChangeText={(login) => setEmailAddress(login)} 
							/>
							{error.emailAddress && <ErrorMessage title={error.emailAddress} />}
							<Input 
								placeholder={"First name*"} 
								error={!!error.firstName} 
								onFocus={() => onFocus("firstName")}
								onBlur={() => onBlur(firstName, 'firstName')} 
								value={firstName} 
								onChangeText={(text) => setFirstName(text)} 
							/>
							{error.firstName && <ErrorMessage title={error.firstName} />}
							<Input 
								placeholder={"Last name*"} 
								error={!!error.lastName}
								onFocus={() => onFocus("lastName")} 
								onBlur={() => onBlur(lastName, 'lastName')} 
								value={lastName} 
								onChangeText={(text) => setLastName(text)} 
							/>
							{error.lastName && <ErrorMessage title={error.lastName} />}
							<Input 
								placeholder={"Password*"} 
								error={!!error.password} 
								onFocus={() => onFocus("password")}
								onBlur={() => onBlur(password, 'password')} 
								password 
								value={password} 
								onChangeText={(password) => setPassword(password)} 
							/>
							{error.password && <ErrorMessage title={error.password} />}
							<Text style={tw.style(`text-xs -mt-2 mb-2 ml-1`, { fontFamily: "i", color: theme.accent })}>
								Create a strong password that is at least 8 characters long, includes upper-case, lower-case letters, at least 1 digit and 1 special
								character.
							</Text>
							<Input 
								placeholder={"Confirm password*"} 
								error={!!error.confirmPassword} 
								onFocus={() => onFocus("confirmPassword")}
								onBlur={() => onBlur(confirmPassword, "confirmPassword")} 
								password 
								value={confirmPassword} 
								onChangeText={(password) => setConfirmPassword(password)} 
							/>
							{error.confirmPassword && <ErrorMessage title={error.confirmPassword} />}
							<PaperButton onPress={onSignUpPress} style="mt-7" title="Continue" filled disabled={isVerified} />
							<Pressable onPress={() => navigation.navigate("Login")} style={tw`self-center gap-x-4 my-4`}>
								<Text style={tw.style(`text-base`, { fontFamily: "i_medium", color: theme.hint })}>
									Already have an account? <Text style={tw.style({ fontFamily: "i_semi", color: theme.sec_btn })}>Login</Text>
								</Text>
							</Pressable>
						</>
					) : (
						<>
							<Input 
								placeholder={"Code"} 
								value={code} 
								onChangeText={(code) => setCode(code)} 
								style={`my-3`}
							/>
							<PaperButton onPress={onPressVerify} title="Verify Email" filled />
						</>
					)}
				</View>
			</ScrollView>
		</Wrapper>
	);
};
