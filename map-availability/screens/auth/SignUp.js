import React, { useState } from 'react';
import { View, Pressable, Text, Alert } from 'react-native';

import { supabase } from '../../supabase';
import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';

import { styles } from '../../styles/light/SignUpLight';

export default function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (email, password) => {
    // if (email === '' || password === '') {
    //   Alert.alert('Make Sure All Fields are Entered');
    //   return;
    // }

    // const { error } = await supabase.auth.signUp({
    //   email: email,
    //   password: password,
    // });

    // if (error) {
    //     Alert.alert('Error', error.message);
    // } else {
    //     Alert.alert('Success', 'Check your email for the confirmation link!');
    //     navigation.navigate("SignIn")
    // }

    navigation.navigate("BottomTab");
  };

  return (
    <View style={styles.fullScreen}>
      <View style={styles.container}>
        <EmailInput email={email} onEmailChange={setEmail} />
        <PasswordInput password={password} onPasswordChange={setPassword} />

        <Pressable
          style={styles.button}
          onPress={() => handleSignUp(email, password)}>
          <Text style={styles.buttonText}> Sign Up </Text>
        </Pressable>
      </View>
    </View>
  );
}
