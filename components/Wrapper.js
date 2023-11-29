import { View } from "react-native";
import tw from 'twrnc';



export const Wrapper = ({children}) => {
    return (
        <View style={tw`flex-1 px-4 bg-white`}>
            {children}
        </View>
    )
}