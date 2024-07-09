import React, { Component } from 'react'
import { View, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Dimensions } from 'react-native'

import { styles } from '../../styles/light/BigHeaderLight'

const height = Dimensions.get('window').height * 0.01;

export default class BigHeader extends Component {
  render() {
    return (
        <View style={styles.svgCurve}>
        <View style={{ backgroundColor: '#83B5FF', height: 20 * height }}>
          <Svg
            height="60%"
            width="100%"
            viewBox="0 0 1440 320"
            style={{ position: 'absolute', top: 15 * height }}
          >
            <Path
              fill="#83B5FF"
              d="M0,320L48,288C96,256,192,192,288,165.3C384,139,480,149,576,181.3C672,213,768,267,864,277.3C960,288,1056,256,1152,229.3C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </Svg>

          <Image
            style={styles.logo}
            source={require('../../assets/AHS_Logo.png')}
          />

        </View>
      </View>
    )
  }
}
