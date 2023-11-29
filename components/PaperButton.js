import { Button } from 'react-native-paper';
import tw from 'twrnc';

import theme from '../constants';



export const PaperButton = ({title, filled, style, onPress, disabled}) => {
    return (
        <Button 
            mode={filled ? "contained" : "outlined"}
            buttonColor={filled ? theme.btn : "white"}
            textColor={filled ? "white" : theme.btn}
            labelStyle={{fontFamily: "i_semi", fontSize: 16}}
            style={tw`rounded-lg ${filled ? 'h-[52px]' : 'h-[42px]'} justify-center ${!filled ? `border border-[${theme.btn}]` : ''} ${style ?? ''}`}
            disabled={!!disabled}
            onPress={onPress}
        >
            {title}
        </Button>
    )
}