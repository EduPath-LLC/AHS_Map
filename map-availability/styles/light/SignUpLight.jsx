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
  signInButton: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  signIn: {
    color: '#2028DE'
  },
  signInText: {
    color: 'black'
  },
  title: {
    fontFamily: 'Kanit-Bold',
    fontSize: 10 * width,
    alignSelf: 'center'
  },
  
  bigText: {
    fontSize: 10 * width,
    alignItems: 'center',
    textAlign: 'left',
    fontFamily: 'Kanit-Bold',
  },

  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "#E0EDFC",
    marginTop: 31 * height,
  },

  scrollStyle: {
    paddingLeft: 10
  },
  scrollText: {
    color: '#000000',
    width: 90 * width,
    alignSelf: 'flex-end',
    fontSize: 5 * width,
    fontWeight: 'bold',
    alignContent: 'flex-start',
    textAlign: 'flex-start',
    marginBottom: 1 * width,
  },
  scrollText2: {
    color: '#000000',
    width: 85 * width,
    alignSelf: 'flex-end',
    fontSize: 5 * width,
    alignContent: 'flex-start',
    textAlign: 'flex-start',
    marginBottom: 1 * width,
  },
  scrollText3: {
    color: '#000000',
    width: 80 * width,
    alignSelf: 'flex-end',
    fontSize: 5 * width,
    alignContent: 'flex-start',
    textAlign: 'flex-start',
    marginBottom: 1 * width,
  },
  
  // New styles for checkbox and buttons
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2 * height,
    paddingHorizontal: 2 * width,
    width: 85 * width,
    alignSelf: 'flex-end',
  },
  checkbox: {
    width: 6 * width,
    height: 6 * width,
    borderWidth: 2,
    borderColor: '#574BE5',
    borderRadius: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2 * width,
  },
  checkboxChecked: {
    backgroundColor: '#574BE5',
    borderColor: '#574BE5',
  },
  checkmark: {
    color: 'white',
    fontSize: 4 * width,
  },
  checkboxLabel: {
    fontSize: 4.5 * width,
    flex: 1,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3 * height,
    paddingHorizontal: 2 * width,
    width: 85 * width,
    alignSelf: 'flex-end',
  },
  buttonCancel: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 1.5 * height,
    paddingHorizontal: 5 * width,
    borderRadius: 2 * width,
    flex: 1,
    marginRight: 3 * width,
    alignItems: 'center',
    justifyContent: 'center',
    height: 7 * height,
  },
  buttonCancelText: {
    fontSize: 4 * width,
    fontWeight: 'bold',
    color: '#555555',
  },
  buttonDisabled: {
    backgroundColor: '#A8A8A8',
    opacity: 0.7,
  },
});