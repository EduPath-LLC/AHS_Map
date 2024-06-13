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
    backgroundColor: '#E0EDFC',
    paddingTop: 10 * height,
    marginTop: 20 * height
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
    flexDirection: 'row',
    alignSelf: 'center'
  },
  signUp: {
    color: '#2028DE'
  },
  signUpText: {
    color: 'black'
  },
  forgotPasswordContainer: {
    width: 80 * width,
    marginTop: -1 * height,
    marginBottom: 2 * height,
  },
  forgotPassword: {
    color: '#1A16E2',
    textAlign: 'right'
  },
  title: {
    fontFamily: 'Kanit-Bold',
    fontSize: 10 * width
  }
});
