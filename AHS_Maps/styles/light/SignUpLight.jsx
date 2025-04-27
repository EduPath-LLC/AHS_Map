import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;

export const styles = StyleSheet.create({
  // Original styles
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
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 4.5 * width,
  },
  signInButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 2 * height,
  },
  signIn: {
    color: '#2028DE',
    fontWeight: '600',
  },
  signInText: {
    color: 'black',
  },
  title: {
    fontFamily: 'Kanit-Bold',
    fontSize: 10 * width,
    alignSelf: 'center',
    marginBottom: 5 * height,
  },
  
  bigText: {
    fontSize: 8 * width,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4 * height,
    color: '#333',
  },

  // Improved modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 3 * width,
    padding: 5 * width,
    width: 90 * width,
    maxHeight: 80 * height,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  policyScrollView: {
    width: '100%',
    maxHeight: 55 * height,
    backgroundColor: '#F7F9FE',
    borderRadius: 2 * width,
    padding: 2 * width,
  },
  policyContent: {
    paddingHorizontal: 3 * width,
    paddingVertical: 2 * height,
  },

  // Improved text styles for policy
  scrollText: {
    color: '#333333',
    fontSize: 5 * width,
    fontWeight: 'bold',
    marginBottom: 2 * height,
    marginTop: 2 * height,
  },
  scrollText2: {
    color: '#555555',
    fontSize: 4.5 * width,
    marginBottom: 2 * height,
    lineHeight: 6 * height,
  },
  scrollText3: {
    color: '#555555',
    fontSize: 4.5 * width,
    marginBottom: 1.5 * height,
    marginLeft: 3 * width,
    lineHeight: 6 * height,
  },
  
  // Enhanced checkbox styling
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3 * height,
    marginBottom: 4 * height,
    width: '100%',
    paddingHorizontal: 2 * width,
  },
  checkbox: {
    width: 6 * width,
    height: 6 * width,
    borderWidth: 2,
    borderColor: '#574BE5',
    borderRadius: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3 * width,
  },
  checkboxChecked: {
    backgroundColor: '#574BE5',
    borderColor: '#574BE5',
  },
  checkmark: {
    color: 'white',
    fontSize: 4 * width,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  
  textInput: {
    fontSize: 16,
    letterSpacing: 4, // Makes PIN digits more readable
  },
  checkboxLabel: {
    fontSize: 4 * width,
    flex: 1,
    color: '#333333',
  },
  
  // Improved button container
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 2 * height,
  },
  
  // Improved cancel button
  buttonCancel: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 1.5 * height,
    paddingHorizontal: 4 * width,
    borderRadius: 2 * width,
    flex: 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    height: 7 * height,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  buttonCancelText: {
    fontSize: 4.5 * width,
    fontWeight: '600',
    color: '#555555',
  },
  
  // Accept button styles
  acceptButton: {
    backgroundColor: '#574BE5',
    paddingVertical: 1.5 * height,
    paddingHorizontal: 4 * width,
    borderRadius: 2 * width,
    flex: 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    height: 7 * height,
    shadowColor: '#574BE5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  acceptButtonText: {
    fontSize: 4.5 * width,
    fontWeight: 'bold',
    color: 'white',
  },
  
  buttonDisabled: {
    backgroundColor: '#B7B7B7',
    opacity: 0.7,
  },
});