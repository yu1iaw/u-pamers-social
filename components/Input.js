import { useState } from 'react';
import { TextInput } from 'react-native-paper';
import tw from 'twrnc';

import theme from '../constants';



export const Input = ({placeholder, password, birth, email, style, value, onChangeText, onFocus, onBlur, error, disabled, multiline, numberOfLines, editable}) => {
    const [showSecureText, setShowSecureText] = useState(false);
    
    return (
        <TextInput 
            mode='outlined'
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoCapitalize={password || email ? "none" : "sentences"}
            secureTextEntry={!!password && !showSecureText}
            activeOutlineColor={theme.btn}
            right={password && <TextInput.Icon icon={!showSecureText ? "eye-off-outline" : "eye-outline"} onPress={() => setShowSecureText(!showSecureText)} />}
            left={birth && <TextInput.Icon icon="calendar-outline"/>}
            style={tw`${style ?? ''}`}
            onFocus={onFocus || undefined}
            onBlur={onBlur || undefined }
            numberOfLines={numberOfLines || undefined}
            error={error}
            disabled={disabled || false}
            multiline={multiline || false}
            editable={editable ?? true}
        />
    )
}