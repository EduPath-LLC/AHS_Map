import { StyleSheet, Dimensions } from 'react-native';

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;

export const stylesLight = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10 * height,
    backgroundColor: "#E0EDFC",
    marginTop: 10 * height,
  },
  bigText: {
    fontSize: 10 * width,
    alignItems: 'center',
    textAlign: 'left',
    fontFamily: 'Kanit-Bold',
  },
  firstNameTextInput: {
    width: 80 * width,
    height: 7 * height,
    padding: 3 * width,
    borderRadius: 2 * width,
    backgroundColor: "#FFFFFF",
    margin: 2 * height,
    placeholder: "First Name",
  },
  toggleSwitch: {
    marginLeft: 10 * width, 
  },
  normalText: {
    fontSize: 5 * width,
    fontFamily: 'Kanit-Bold',
  },
  normalTextBorder: {
    fontSize: 5 * width,
    fontFamily: 'Kanit-Bold',
    borderBottomWidth: 1, 
    borderBottomColor: '#000000', 
    marginBottom: 5 * width,
    textAlign: 'center', 
    paddingBottom: 5 * width, 
  },
  
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',  
    justifyContent: 'space-between',
    width: 80 * width,  
    marginVertical: width,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 5 * width,
    paddingVertical: 2 * width,
    width: 35 * width,
    height: 10 * height,
},
backButtonText: {
    fontSize: 5 * width,
    marginLeft: 2 * width,
    fontFamily: 'Kanit-Bold',
    color: 'black',
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
