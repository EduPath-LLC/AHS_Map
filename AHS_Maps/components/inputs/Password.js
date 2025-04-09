import React, { Component } from 'react'
import { View, TextInput } from 'react-native'

import {styles} from '../../styles/light/PasswordLight'

export default class PasswordInput extends Component {
    handlePassword = (password) => {
        this.props.onPasswordChange(password);
      };
    
      render() {
        return (
          <View>
            <TextInput
              style={styles.password}
              placeholder="Password"
              secureTextEntry={true}
              value={this.props.password}
              onChangeText={this.handlePassword}
            />
          </View>
        );
      }
}
