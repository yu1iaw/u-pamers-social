import { TextInput } from 'react-native-paper';
import tw from 'twrnc';

import theme from '../constants';



export const Input = ({placeholder, password, birth, email, style, value, onChangeText, onFocus, onBlur, error, disabled, multiline, numberOfLines}) => {
    return (
        <TextInput 
            mode='outlined'
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoCapitalize={password || email ? "none" : "sentences"}
            secureTextEntry={!!password}
            activeOutlineColor={theme.btn}
            right={password && <TextInput.Icon icon="eye-off-outline"/>}
            left={birth && <TextInput.Icon icon="calendar-outline"/>}
            style={tw`${style ?? ''}`}
            onFocus={onFocus || undefined}
            onBlur={onBlur || undefined }
            numberOfLines={numberOfLines || undefined}
            error={error}
            disabled={disabled || false}
            multiline={multiline || false}
        />
    )
}