import React, { Component } from 'react'
import { View, TextInput } from 'react-native'

import {styles} from '../../styles/light/EmailLight'

export default class EmailInput extends Component {
    handleEmailChange = (email) => {
        this.props.onEmailChange(email);
      };
    
      render() {
        return (
          <View>
            <TextInput
              style={styles.email}
              placeholder="Email"
              keyboardType="email-address"
              value={this.props.email}
              onChangeText={this.handleEmailChange}
            />
          </View>
        );
      }
}
