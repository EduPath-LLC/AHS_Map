import { StyleSheet, Dimensions } from 'react-native';

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;

export const stylesLight = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10 * height,
    backgroundColor: "#E0EDFC",
    marginTop: 10 * height,
    paddingBottom: 20 * height,
  },
  bigText: {
    fontSize: 10 * width,
    alignItems: 'center',
    textAlign: 'left',
    fontFamily: 'Kanit-Bold',
    marginBottom: 5 * height,
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
    marginLeft: 10 * width, // Adjusted to space out from the text
  },
  normalText: {
    fontSize: 5 * width,
    fontFamily: 'Kanit-Bold',
  },
  normalTextBorder: {
    fontSize: 5 * width,
    fontFamily: 'Kanit-Bold',
    borderBottomWidth: 1,
    marginBottom: 5 * width,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Aligns the text and switch vertically centered
    justifyContent: 'space-between',
    width: 80 * width, // Ensure container is wide enough for text and switch
    marginVertical: width,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 5 * width,
    paddingVertical: 2 * height,
    width: 35 * width,
    height: 10 * height,
    zIndex: 10000
  },
  backButtonText: {
    fontSize: 5 * width,
    marginLeft: 2 * width,
    fontFamily: 'Kanit-Bold',
    color: 'black',
  },
  
  // New styles for improved message UI
  supportCard: {
    width: 90 * width,
    backgroundColor: '#FFFFFF',
    borderRadius: 4 * width,
    padding: 5 * width,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 3 * height,
    marginBottom: 3 * height,
  },
  cardTitle: {
    fontSize: 6 * width,
    fontFamily: 'Kanit-Bold',
    marginBottom: 3 * height,
    color: '#444',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 4.5 * width,
    fontFamily: 'Kanit-Bold',
    color: '#555',
    marginTop: 2 * height,
    marginBottom: 1 * height,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: height,
  },
  categoryButton: {
    paddingVertical: 1 * height,
    paddingHorizontal: 3 * width,
    backgroundColor: '#F0F0F0',
    borderRadius: 2 * width,
    marginRight: 2 * width,
    marginBottom: 1 * height,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeCategoryButton: {
    backgroundColor: '#3D7BE5',
    borderColor: '#3D7BE5',
  },
  categoryText: {
    fontSize: 3.5 * width,
    color: '#555',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  messageInput: {
    width: '100%',
    height: 20 * height,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 2 * width,
    padding: 3 * width,
    textAlignVertical: 'top',
    marginBottom: 3 * height,
    fontSize: 4 * width,
    backgroundColor: '#F9F9F9',
    color: '#333',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D7BE5',
    paddingVertical: 2 * height,
    paddingHorizontal: 5 * width,
    borderRadius: 2 * width,
    alignSelf: 'center',
    width: 50 * width,
  },
  submitText: {
    color: 'white',
    fontSize: 4.5 * width,
    fontFamily: 'Kanit-Bold',
  },
  submitIcon: {
    marginRight: 2 * width,
  },
  contactInfoCard: {
    width: 90 * width,
    backgroundColor: '#F5F9FF',
    borderRadius: 4 * width,
    padding: 5 * width,
    borderWidth: 1,
    borderColor: '#D0E0FC',
  },
  contactTitle: {
    fontSize: 5 * width,
    fontFamily: 'Kanit-Bold',
    color: '#444',
    marginBottom: 1 * height,
  },
  contactText: {
    fontSize: 4 * width,
    color: '#666',
    lineHeight: 5 * height,
  },
});