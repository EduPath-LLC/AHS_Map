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
  }
});
