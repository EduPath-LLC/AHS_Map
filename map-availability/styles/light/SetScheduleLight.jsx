import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;

export const stylesLight = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10 * width,
    backgroundColor: '#E0EDFC',
    marginTop: 15 * height
  },
  title: {
    fontFamily: 'Kanit-Bold',
    fontSize: 10 * width,
    margin: 5 * width,
    alignSelf: 'center'
  }
});
