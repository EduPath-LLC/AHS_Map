import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;

export const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10 * width,
    backgroundColor: '#E0EDFC',
    padding: 10 * height
  },
  button: {
    backgroundColor: '#574BE5',
    width: 80 * width,
    height: 7 * height,
    borderRadius: 2 * width,
    margin: 2 * height,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
  },
  signUpButton: {
    flexDirection: 'row'
  },
  signUp: {
    color: '#2028DE'
  },
  signUpText: {
    color: 'black'
  }
});
