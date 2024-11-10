import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, Keyboard, SafeAreaView } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { LocationContext } from '../components/providers/LocationContext';
import {FontAwesome6, FontAwesome} from '@expo/vector-icons';
import { debounce } from 'lodash';
import { styles } from '../styles/light/MapLight'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Magnetometer } from 'expo-sensors';

function determineRealTurns(route) {
  const segments = [];
  let currentSegment = [route[0]];
  let lastSignificantBearing = calculateBearing(route[0], route[1]);
  let currentFloor = getFloor(route[0]);

  for (let i = 1; i < route.length; i++) {
    const nextPoint = route[i];
    const nextFloor = getFloor(nextPoint);

    // Only treat the staircase as a transition point if there's a floor change
    if (isFloorChange(route[i - 1], nextPoint)) {
      segments.push(currentSegment); // End the current segment

      // Create a special staircase segment
      segments.push([route[i - 1], nextPoint]);

      currentSegment = [nextPoint]; // Start a new segment on the new floor
      currentFloor = nextFloor;

      // Update the bearing
      if (i < route.length - 1) {
        lastSignificantBearing = calculateBearing(nextPoint, route[i + 1]);
      }
    } else {
      currentSegment.push(nextPoint); // Regular node behavior

      if (i < route.length - 1) {
        const newBearing = calculateBearing(nextPoint, route[i + 1]);
        let bearingDifference = Math.abs(newBearing - lastSignificantBearing);
        
        if (bearingDifference > 180) {
          bearingDifference = 360 - bearingDifference;
        }

        if (bearingDifference >= 75 && bearingDifference <= 110) {
          segments.push(currentSegment);
          currentSegment = [nextPoint];
          lastSignificantBearing = newBearing;
        }
      }
    }
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}


// Helper function to determine the floor of a point
function getFloor(point) {
  return point.reference.startsWith('S1') || point.reference.startsWith('1') ? 1 : 2;
}

// Helper function to determine if there's a floor change
function isFloorChange(point1, point2) {
  // If the points are in different floors (based on their staircase references)
  const isS1 = point1.reference.startsWith('S1') || point2.reference.startsWith('S1');
  const isS2 = point1.reference.startsWith('S2') || point2.reference.startsWith('S2');

  return isS1 && isS2;  // This means there's a floor change between staircases
}

const firstFloorCoordinates = [
  { latitude: 33.11012705174, longitude: -96.66134610000, reference: 'mainhall1' },
  { latitude: 33.11005377415, longitude: -96.66127730000, reference: 'mainhall2' },
  { latitude: 33.11001053185, longitude: -96.66123670000, reference: 'mainhall3' },
  { latitude: 33.10978398907, longitude: -96.66102400000, reference: 'mainhall4' },
  { latitude: 33.10958417983, longitude: -96.66083640000, reference: 'mainhall5' },
  { latitude: 33.10957086632, longitude: -96.66082390000, reference: 'f entrance' },
{ latitude: 33.10947149, longitude: -96.6609794, reference: 'f mid front' },
{ latitude: 33.1095631, longitude: -96.66106426, reference: 'TLF' },







{ latitude: 33.10955218, longitude: -96.66107382, reference: 'F108' },
{ latitude: 33.10949087, longitude: -96.66116680, reference: 'F111' },
{ latitude: 33.10951721, longitude: -96.66112686, reference: 'F110' },
{ latitude: 33.10946359, longitude: -96.66120816, reference: 'F112' },
{ latitude: 33.10941872, longitude: -96.66127622, reference: 'F114' },
{ latitude: 33.10939153, longitude: -96.66131744, reference: 'F115' },
{ latitude: 33.10936915, longitude: -96.66135138, reference: 'F116' },
{ latitude: 33.10933977, longitude: -96.66139594, reference: 'F117' },
{ latitude: 33.10928326, longitude: -96.66148163, reference: 'F120' },
{latitude:33.1092741, longitude:-96.6614961, reference: 'midhallcut1'},
{latitude:33.1091114, longitude:-96.6613463, reference: 'midhallcut12'},
{latitude:33.1092741, longitude:-96.6614961, reference: 'midhallcut13'},
{ latitude: 33.10932618, longitude: -96.66141655, reference: 'F119' },
{ latitude: 33.10932480, longitude: -96.66141863, reference: 'S1_8' },
{ latitude: 33.10922702, longitude: -96.66156692, reference: 'F123' },
{ latitude: 33.10922085, longitude: -96.66157627, reference: 'F124' },
{ latitude: 33.10918304, longitude: -96.66163361, reference: 'F125' },
{ latitude: 33.10916888, longitude: -96.66165509, reference: 'F126' },
{ latitude: 33.10910607, longitude: -96.66175032, reference: 'F128' },
{ latitude: 33.10909943, longitude: -96.66176040, reference: 'F129' },
{ latitude: 33.10904726, longitude: -96.66183951, reference: 'F130' },
{ latitude: 33.10900099, longitude: -96.66190967, reference: 'F133' },








{ latitude: 33.10883376, longitude: -96.66176128, reference: 'F136' },
{ latitude: 33.10886333, longitude: -96.66171719, reference: 'F137' },
{ latitude: 33.10889290, longitude: -96.66167311, reference: 'F138' },
{ latitude: 33.10892247, longitude: -96.66162902, reference: 'F139' },
{ latitude: 33.10895204, longitude: -96.66158494, reference: 'F140' },
{ latitude: 33.10898161, longitude: -96.66154086, reference: 'F141' },
{ latitude: 33.10901118, longitude: -96.66149677, reference: 'F144' },
{ latitude: 33.10904075, longitude: -96.66145269, reference: 'F145' },
{ latitude: 33.10907032, longitude: -96.66140860, reference: 'F146' },
{ latitude: 33.10909989, longitude: -96.66136452, reference: 'S1_7' },
{ latitude: 33.10912945, longitude: -96.66132043, reference: 'F149' },
{ latitude: 33.10915902, longitude: -96.66127635, reference: 'F153' },
{ latitude: 33.10918859, longitude: -96.66123226, reference: 'F154' },
{ latitude: 33.10921816, longitude: -96.66118818, reference: 'F155' },
{ latitude: 33.10924773, longitude: -96.66114409, reference: 'F156' },
{ latitude: 33.10927730, longitude: -96.66110001, reference: 'F158' },
{ latitude: 33.10930687, longitude: -96.66105592, reference: 'F160' },
{ latitude: 33.10933644, longitude: -96.66101184, reference: 'F161' },
{ latitude: 33.10936601, longitude: -96.66096776, reference: 'F163' },
{ latitude: 33.10939558, longitude: -96.66092367, reference: 'F164' },
{ latitude: 33.1094010, longitude: -96.6609141, reference: 'TRF' },
{ latitude: 33.10947149, longitude: -96.6609794, reference: 'f mid front' },
{ latitude: 33.10957086632, longitude: -96.66082390000, reference: 'f entrance' },







// New entries
{ latitude: 33.10937095057, longitude: -96.66063620000, reference: 'a entrance' },
 { latitude: 33.10946603787324, longitude:  -96.66049207061944, reference: 'amidfront' },
 {latitude:33.1095109380455, longitude:-96.66053368788533, reference:'A134'},
 { latitude: 33.10953135976243, longitude: -96.66055364224918, reference: 'A1' },
 { latitude: 33.10956178414, longitude: -96.66050830533, reference: 'A130' },
 { latitude: 33.10961167985, longitude: -96.66043394220, reference: 'A128' },
 { latitude: 33.10963654762, longitude: -96.66039688000, reference: 'A125' },
 { latitude: 33.10961085444, longitude: -96.66043517237, reference: 'A126' },
 { latitude: 33.10968441530, longitude: -96.66032553941, reference: 'A121' },
 { latitude: 33.10970620484, longitude: -96.66029306490, reference: 'A124' },
 { latitude: 33.10972164366, longitude: -96.66027005533, reference: 'S1_2' },
{ latitude: 33.10955886827335, longitude: -96.66011928918694, reference: 'A116' },
{ latitude: 33.10954361813029, longitude: -96.66014275443264, reference: 'A114' },
{ latitude: 33.10952469860161, longitude: -96.66017186572604, reference: 'A115' },
{ latitude: 33.10946234482971, longitude: -96.6602678088639, reference: 'A112' },
{ latitude: 33.10944770286005, longitude: -96.66029033831916, reference: 'A110' },
{ latitude: 33.10947839516472, longitude: -96.6602431123707, reference: 'A109' },
{ latitude: 33.109399795176294, longitude: -96.66036405340273, reference: 'A108' },
{ latitude: 33.109372346964086, longitude: -96.66040628769791, reference: 'A106' },
{ latitude:33.10940547854645, longitude:-96.66043593912865, reference:'A104'},
{ latitude: 33.10946603787324, longitude:  -96.66049207061944, reference: 'amidfront' },
{ latitude: 33.10937095057, longitude: -96.66063620000, reference: 'a entrance' },
{ latitude: 33.10913120078, longitude: -96.66041110000, reference: 'g entrance' },
{ latitude: 33.10885800744, longitude: -96.66015460000, reference: 'k entrance' }
];

const secondFloorCoordinates = [



  { latitude: 33.109971381724904, longitude: -96.66130147923262, reference: '2mainhall' },
  { latitude: 33.10952242109021, longitude: -96.66088922805024, reference: '2fentrance' },
  { latitude: 33.10956921622493, longitude: -96.66081717996883, reference: '2entrance' },
 
{ latitude: 33.10945468699747, longitude: -96.66099546935033, reference: '2f mid front' },
{ latitude: 33.10954500167219, longitude: -96.66108226076537, reference: 'f207' },
{ latitude: 33.10953483107906, longitude: -96.6610977603442, reference: 'f208' },
{ latitude: 33.10946539704782, longitude: -96.66120357504222, reference: 'f210' },
{ latitude: 33.10945784773486, longitude: -96.66121507989448, reference: 'f212' },
{ latitude: 33.109452122162395, longitude: -96.66122380543887, reference: 'f213' },
{ latitude: 33.109368113683416, longitude: -96.66135183101474, reference: 'f216' },
{ latitude: 33.10935343444692, longitude: -96.66137420158647, reference: 'f217' },
{ latitude: 33.1093251244839, longitude: -96.6614173448425, reference: 'f215' },
{ latitude: 33.10930855790873, longitude: -96.66144259164321, reference: 'S2_8' },
{ latitude: 33.10925549614271, longitude: -96.66152345566115, reference: 'midcut1' },
{ latitude: 33.109224250296336, longitude: -96.66157107308649, reference: 'f222' },
{ latitude: 33.1092031527484, longitude: -96.66160322490923, reference: 'f224' },
{ latitude: 33.10914850258018, longitude: -96.66168650958885, reference: 'f223' },
{ latitude: 33.109128371004914, longitude: -96.66171718930771, reference: 'f226' },
{ latitude: 33.10910782001707, longitude: -96.66174850819462, reference: 'f227' },
{ latitude: 33.109039748725316, longitude: -96.66185224613196, reference: 'f228' },
{ latitude: 33.10903177996745, longitude: -96.66186439020154, reference: 'f229' },
{ latitude: 33.1090221335754, longitude: -96.6618790909188, reference: 'f230' },
{ latitude: 33.10896764835255, longitude: -96.66196212422827, reference: 'BLC' },

{ latitude: 33.10880219053123, longitude: -96.661809713627, reference: 'BRC' },
{ latitude: 33.10885407349071, longitude: -96.66173080754453, reference: 'f234' },
{ latitude: 33.1088667511467, longitude: -96.66171152675986, reference: 'f235' },
{ latitude: 33.10887335684002, longitude: -96.661701480506, reference: 'f236' },
{ latitude: 33.108949273233236, longitude: -96.66158602322979, reference: 'f238' },
{ latitude: 33.10896128996865, longitude: -96.66156774760472, reference: 'f239' },
{ latitude: 33.108982260399344, longitude: -96.66153585477227, reference: 'f241' },
{ latitude: 33.10904438696183, longitude: -96.66144136972915, reference: 'f242' },
{ latitude: 33.10905619398012, longitude: -96.66142341305189, reference: 'f243' },
{ latitude: 33.10909147837973, longitude: -96.66136975085195, reference: 'midcut2' },
{ latitude: 33.10910835955181, longitude: -96.66134407715927, reference: 'fly1' },
{ latitude: 33.10914197576989, longitude: -96.66129295200946, reference: 'S2_10' },
{ latitude: 33.10915944477946, longitude: -96.66126638430546, reference: 'f248' },
{ latitude: 33.10918823779095, longitude: -96.66122259451856, reference: 'f249' },
{ latitude: 33.109200527784935, longitude: -96.6612039033088, reference: 'f250' },
{ latitude: 33.10927004793607, longitude: -96.661098173743, reference: 'f252' },
{ latitude: 33.109283322849, longitude: -96.66107798462147, reference: 'f253' },
{ latitude: 33.10929575894579, longitude: -96.66105907121158, reference: 'f254' },
{ latitude: 33.10934455626815, longitude: -96.6609848579134, reference: 'f255' },
{ latitude: 33.109379913609914, longitude: -96.66093108477955, reference: 'TRC' },

{ latitude: 33.10945468699747, longitude: -96.66099546935033, reference: '2f mid front' },
{ latitude: 33.10952242109021, longitude: -96.66088922805024, reference: '2fentrance' },
{ latitude: 33.10931541294438, longitude: -96.66069914601121, reference: 'S2_3' },
{ latitude: 33.10906944131525, longitude: -96.66047328635425, reference: "gentrance" },
{ latitude: 33.10900017535599, longitude: -96.66058231936353, reference: "gmid" },
{ latitude: 33.109058569591525, longitude: -96.66063592758371, reference: "g205" },
{ latitude: 33.1090913645899, longitude: -96.66066596996748, reference: "g206" },
{ latitude: 33.109073120338095, longitude: -96.6606940468132, reference: "g207" },
{ latitude: 33.109044117584695, longitude: -96.6607382654019, reference: "g209" },
{ latitude: 33.10901763127212, longitude: -96.66077864733893, reference: "g210" },
{ latitude: 33.108997919075314, longitude: -96.66080870122764, reference: "g211" },
{ latitude: 33.108939640217216, longitude: -96.66089755516573, reference: "S2_14" },
{ latitude: 33.108913719398785, longitude: -96.66093707493107, reference: "g213" },
{ latitude: 33.10888563793986, longitude: -96.66097988888274, reference: "g214" },
{ latitude: 33.10886781305446, longitude: -96.66100706531199, reference: "g215" },
{ latitude: 33.10881966352259, longitude: -96.66108047573326, reference: "flycut2" },
{ latitude: 33.10879927752077, longitude: -96.6611115569281, reference: "g218" },
{ latitude: 33.10875741909612, longitude: -96.66117537571238, reference: "g220" },
{ latitude: 33.10872401243574, longitude: -96.66122630864811, reference: "g221" },
{ latitude: 33.10870675304451, longitude: -96.66125262290562, reference: "g222" },
{ latitude: 33.108676619115855, longitude: -96.66129856612275, reference: "g223" },
{ latitude: 33.10866040824057, longitude: -96.66132328177704, reference: "g224" },
{ latitude: 33.10862874277224, longitude: -96.66137156003188, reference: "g225" },
{ latitude: 33.108613014886394, longitude: -96.66139553930395, reference: "g226" },
{ latitude: 33.108581705223514, longitude: -96.66144327508565, reference: "g227" },
{ latitude: 33.10853124877592, longitude: -96.66152020270945, reference: "g228" },
{ latitude: 33.10851308693722, longitude: -96.66154789286921, reference: "BLCg" },
{ latitude: 33.10834535768775, longitude: -96.6613946199867, reference: "BRCg" },
{ latitude: 33.1083641486784, longitude: -96.66136620875649, reference: "g236" },
{ latitude: 33.10841559016205, longitude: -96.66128790580876, reference: "g237" },
{ latitude: 33.10844641688495, longitude: -96.66124098213743, reference: "g238" },
{ latitude: 33.10845990162788, longitude: -96.66122045599695, reference: "g239" },
{ latitude: 33.108540663924636, longitude: -96.66109752163636, reference: "g243" },
{ latitude: 33.10855681123405, longitude: -96.66107294260334, reference: "g244" },
{ latitude: 33.1085905548391, longitude: -96.66102157892652, reference: "g245" },
{ latitude: 33.10863610550598, longitude: -96.66095224283366, reference: "g247" },
{ latitude: 33.1086879026525, longitude: -96.66087339850478, reference: "g252" },
{ latitude: 33.1087003388336, longitude: -96.66085446845904, reference: "g253" },
{ latitude: 33.108717534638245, longitude: -96.66082829343264, reference: "g254" },
{ latitude: 33.108768893385836, longitude: -96.6607501164237, reference: "S2_15" },
{ latitude: 33.10881251197165, longitude: -96.6606837212966, reference: "g257" },
{ latitude: 33.10882956163746, longitude: -96.66065776871913, reference: "g258" },
{ latitude: 33.10884283661698, longitude: -96.66063756187529, reference: "g259" },
{ latitude: 33.10892506649267, longitude: -96.6605136299307, reference: "g261" },
{ latitude: 33.10896469384106, longitude: -96.6605499311982, reference: "g262" },
{ latitude: 33.10900017535599, longitude: -96.66058231936353, reference: "gmid" },
{ latitude: 33.10906944131525, longitude: -96.66047328635425, reference: "gentrance" },

{ latitude: 33.10886097025895, longitude: -96.66028186102025, reference: 'S2_4' },
{ latitude: 33.108630171211225, longitude: -96.66006993335228, reference: '2hentrance' },
{ latitude: 33.10867497158879, longitude: -96.65999863931151, reference: "K204" },
{ latitude: 33.10885838458248, longitude: -96.66016301902835, reference: "k entrance" },
{ latitude: 33.10896982964244, longitude: -96.65998494750866, reference: "k mid" },
{ latitude: 33.10900371784144, longitude: -96.6600158792806, reference: "k228" },
{ latitude: 33.10906480802483, longitude: -96.66007105066953, reference: "k222" },
{ latitude: 33.10910242757693, longitude: -96.66001164258827, reference: "k219" },
{ latitude: 33.10911136231943, longitude: -96.65999807723233, reference: "k220" },
{ latitude: 33.10918962651322, longitude: -96.65987925101595, reference: "k218" },
{ latitude: 33.10919885347937, longitude: -96.65986524198547, reference: "k216" },
{ latitude: 33.10921407932416, longitude: -96.65984212503454, reference: "k215" },
{ latitude: 33.109282569888094, longitude: -96.659738137832, reference: "k214" },
{ latitude: 33.10929611809012, longitude: -96.65971756799658, reference: "TLCK" },
{ latitude: 33.10912819010214, longitude: -96.6595629196543, reference: "TRCK" },
{ latitude: 33.10904976079582, longitude: -96.65968562007973, reference: "k211" },
{ latitude: 33.10904976079582, longitude: -96.65968562007973, reference: "k212" },
{ latitude: 33.10903424268949, longitude: -96.65970897630184, reference: "k210" },
{ latitude: 33.10900433751869, longitude: -96.6597539864208, reference: "k205" },
{ latitude: 33.108991755264015, longitude: -96.65977292390768, reference: "k208" },
{ latitude: 33.10894230292743, longitude: -96.65984735436545, reference: "k206" },
{ latitude: 33.10889616795223, longitude: -96.65991874948926, reference: "BRC" },
{ latitude: 33.108935522021554, longitude: -96.65995429069316, reference: "K202" },
{ latitude: 33.10896982964244, longitude: -96.65998494750866, reference: "k mid" },
{ latitude: 33.10885838458248, longitude: -96.66016301902835, reference: "k entrance" },
{ latitude: 33.10890844171046, longitude: -96.66020960345315, reference: "hallpt2" },
{ latitude: 33.10897834089072, longitude: -96.660272764514, reference: "k226" },
{ latitude: 33.109116115103, longitude: -96.66039979772553, reference: "midgentlate" },
{ latitude: 33.109362496538076, longitude: -96.66062614994448, reference: "a entrance" },
{ latitude: 33.10943150607069, longitude: -96.66052024554845, reference: "a mid" },
{ latitude: 33.109506502881715, longitude: -96.66058874684992, reference: "a232" },
{ latitude: 33.10953758611639, longitude: -96.66054173865825, reference: "a230" },
{ latitude: 33.109589517655046, longitude: -96.66046197402315, reference: "a228" },
{ latitude: 33.10960342726715, longitude: -96.66044060945043, reference: "a226" },
{ latitude: 33.10961833666596, longitude: -96.66041770924784, reference: "a225" },
{ latitude: 33.10968408571622, longitude: -96.66031672150248, reference: "a224" },
{ latitude: 33.109697871058806, longitude: -96.66029554780245, reference: "a222" },
{ latitude: 33.10972692243588, longitude: -96.6602509261226, reference: "a221" },
{ latitude: 33.1097488297521, longitude: -96.66021727741645, reference: "TRCA" },
{ latitude: 33.10958652121709, longitude: -96.66006582712545, reference: "TLCA" },
{ latitude: 33.10956269539189, longitude: -96.66010141735043, reference: "A215" },
{ latitude: 33.10953360886999, longitude: -96.66014555950275, reference: "A216" },
{ latitude: 33.10951751328456, longitude: -96.6601699864104, reference: "a214" },
{ latitude: 33.10945247454838, longitude: -96.66026869019527, reference: "a209" },
{ latitude: 33.10943785159766, longitude: -96.66029088220984, reference: "a212" },
{ latitude: 33.1094241904692, longitude: -96.66031161454819, reference: "a210" },
{ latitude: 33.109372366980466, longitude: -96.66039026267057, reference: "a208" },
{ latitude: 33.10934287253986, longitude: -96.66043779561238, reference: "a206" },
{ latitude: 33.10938086656869, longitude: -96.66047284562576, reference: "a204" },
{ latitude: 33.10943150607069, longitude: -96.66052024554845, reference: "a mid" },
{ latitude: 33.109362496538076, longitude: -96.66062614994448, reference: "a entrance" },
{ latitude: 33.10956921622493, longitude: -96.66081717996883, reference: "mid somewhere" },
{ latitude: 33.11001916668614, longitude: -96.66122943705936, reference: "starttop" },
{ latitude: 33.10999358063734, longitude: -96.6612672276186, reference: "S2_9" },
{ latitude: 33.109971381724904, longitude: -96.66130147923262, reference: "startofitall" }



];


const firstFloorStaircases = firstFloorCoordinates.filter(coord => coord.reference.startsWith('S1'));
const secondFloorStaircases = secondFloorCoordinates.filter(coord => coord.reference.startsWith('S2'));




const roomCoordinates = {
F108: { latitude: 33.10959167, longitude: -96.6611234 },
F111: { latitude: 33.10953419, longitude: -96.66120964 },
F110: { latitude: 33.10946790, longitude: -96.66108344 },
F112: { latitude: 33.10950205, longitude: -96.66126420 },
F114: { latitude: 33.10937894, longitude: -96.66123695 },
F115: { latitude: 33.10943479, longitude: -96.66136275 },
F116: { latitude: 33.10941588, longitude: -96.66139435 },
F117: { latitude: 33.10930108, longitude: -96.66136090 },
F120: { latitude: 33.10932997, longitude: -96.66152640 },
F119: { latitude: 33.10929958, longitude: -96.66139901 },
F123: { latitude: 33.10919474, longitude: -96.66153375 },
F124: { latitude: 33.10925905, longitude: -96.66161894 },
F125: { latitude: 33.10921808, longitude: -96.66167626 },
F126: { latitude: 33.10913219, longitude: -96.66161789 },
F128: { latitude: 33.10907955, longitude: -96.66171981 },
F129: { latitude: 33.10913878, longitude: -96.66180036 },
F130: { latitude: 33.10908186, longitude: -96.66186708 },
F131: { latitude: 33.10901877, longitude: -96.66180897 },
F133: { latitude: 33.10903478, longitude: -96.66193809 },

F136: { latitude: 33.10880684, longitude: -96.66172540 },
F137: { latitude: 33.10883337, longitude: -96.66168656 },
F138: { latitude: 33.10891935, longitude: -96.66171985 },
F139: { latitude: 33.10886242, longitude: -96.66165558 },
F140: { latitude: 33.10899026, longitude: -96.66160587 },
F141: { latitude: 33.10893572, longitude: -96.66154236 },
F144: { latitude: 33.10898758, longitude: -96.66146447 },
F145: { latitude: 33.10904345, longitude: -96.66151760 },
F146: { latitude: 33.10900063, longitude: -96.66143651 },
// F148: { latitude: 33.10908299, longitude: -96.66131832 },
F149: { latitude: 33.10915934, longitude: -96.66133285 },
F153: { latitude: 33.10920637, longitude: -96.66127296 },
F154: { latitude: 33.10916137, longitude: -96.66119282 },
F155: { latitude: 33.10919531, longitude: -96.66113909 },
F156: { latitude: 33.10928420, longitude: -96.66114966 },
F158: { latitude: 33.10937162, longitude: -96.66111840 },
F160: { latitude: 33.10929493, longitude: -96.66100196 },
F161: { latitude: 33.10938663, longitude: -96.66101313 },
F163: { latitude: 33.10935875, longitude: -96.66088543 },
F164: { latitude: 33.10939019, longitude: -96.66085111 },
A134: { latitude: 33.10948601, longitude: -96.66057225 },
A130: { latitude: 33.10959816, longitude: -96.66054371 },
A125: { latitude: 33.10960490, longitude: -96.66036520 },
A128: { latitude: 33.10964351, longitude: -96.66047714 },
A126: { latitude: 33.10965822, longitude: -96.66044275 },
A121: { latitude: 33.10965515, longitude: -96.66028765 },
A124: { latitude: 33.10973972, longitude: -96.66032496 },
A122: { latitude: 33.10975995, longitude: -96.66030228 },
A104: { latitude: 33.10937961, longitude: -96.66045985 },
A106: { latitude: 33.10932474, longitude: -96.66040581 },
A108: { latitude: 33.10936681, longitude: -96.66032719 },
A110: { latitude: 33.10941482, longitude: -96.66025949 },
A112: { latitude: 33.10943266, longitude: -96.66023274 },
A109: { latitude: 33.10950628, longitude: -96.66026768 },
A115: { latitude: 33.10956253, longitude: -96.66020162 },
A114: { latitude: 33.10951497, longitude: -96.66011318 },
A116: { latitude: 33.10952823, longitude: -96.66009189 },
A116: { latitude: 33.10952823, longitude: -96.66009189 },
f207: { latitude: 33.10960813, longitude: -96.66110251 },
f208: { latitude: 33.10957188, longitude: -96.66112951 },
f212: { latitude: 33.10941840, longitude: -96.66118890 },
f210: { latitude: 33.10950247, longitude: -96.66123517 },
f213: { latitude: 33.10948242, longitude: -96.66126140 },
f216: { latitude: 33.10940683, longitude: -96.66138557 },
f217: { latitude: 33.10938524, longitude: -96.66140562 },
f215: { latitude: 33.10928574, longitude: -96.66138171 },
f222: { latitude: 33.10926029, longitude: -96.66159535 },
f224: { latitude: 33.10923870, longitude: -96.66162543 },
f223: { latitude: 33.10911221, longitude: -96.66165783 },
f226: { latitude: 33.10916234, longitude: -96.66174575 },
f227: { latitude: 33.10914460, longitude: -96.66176889 },
f228: { latitude: 33.10899883, longitude: -96.66182519 },
f229: { latitude: 33.10907133, longitude: -96.66189075 },
F230: { latitude: 33.10905128, longitude: -96.66191466 }





};


function findRoomCoordinates(reference) {
return roomCoordinates[reference] || null;
}
// Adjust overlapping segments

function createConstrainedGraph(polyline) {
const graph = {};
const connections = {};
polyline.forEach((point, index) => {
  graph[index] = {};
  connections[index] = new Set();
});
// Connect adjacent points and close non-consecutive points
for (let i = 0; i < polyline.length; i++) {
  for (let j = i + 1; j < polyline.length; j++) {
    const dist = distance(polyline[i], polyline[j]);
    if (j === i + 1 || dist < .00001) { // Adjust this threshold as needed
      graph[i][j] = dist;
      graph[j][i] = dist;
      connections[i].add(j);
      connections[j].add(i);
    }
  }
}
return { graph, connections };
}

function constrainedDijkstra(graphData, start, end) {
const { graph, connections } = graphData;
const costs = {};
const parents = {};
const processed = new Set();



Object.keys(graph).forEach(node => {
  costs[node] = node == start ? 0 : Infinity;
});


let node = findLowestCostNode(costs, processed);

while (node !== null) {
  const cost = costs[node];
  const neighbors = connections[node];


  for (let n of neighbors) {
    const newCost = cost + graph[node][n];
    if (newCost < costs[n]) {
      costs[n] = newCost;
      parents[n] = node;
    }
  }

  processed.add(node);
  node = findLowestCostNode(costs, processed);
}


// Reconstruct the path
const path = [];
let currentNode = end.toString();
while (currentNode !== start.toString()) {
  path.unshift(parseInt(currentNode));
  currentNode = parents[currentNode];
}
path.unshift(parseInt(start));

return path;
}
function distance(point1, point2) {
const dx = point1.longitude - point2.longitude;
const dy = point1.latitude - point2.latitude;
return Math.sqrt(dx * dx + dy * dy);
}
function findLowestCostNode(costs, processed) {
return Object.keys(costs).reduce((lowest, node) => {
  if (lowest === null && !processed.has(node)) {
    lowest = node;
  }
  if (!processed.has(node) && costs[node] < costs[lowest]) {
    lowest = node;
  }
  return lowest;
}, null);
}
function constrainToAdjacentSegments(currentSegment, newSegment) {
 if (Math.abs(newSegment - currentSegment) <= 1) {
   return newSegment;
 }
 return currentSegment;
}
function findNearestPointOnPolyline(point, errorMargin = 1) {
 if (!point || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
   console.error('Invalid point:', point);
   return null;
 }


 let minDistance = Infinity;
 let nearestPoint = null;
 let segmentIndex = -1;


 for (let i = 0; i < firstFloorCoordinates.length - 1; i++) {
   const start = firstFloorCoordinates[i];
   const end = firstFloorCoordinates[i + 1];
   const nearest = nearestPointOnLineSegment(point, start, end);
   const dist = distance(point, nearest);


   if (dist < minDistance) {
     minDistance = dist;
     nearestPoint = nearest;
     segmentIndex = i;
   }
 }


 if (!nearestPoint) {
   console.error('Could not find nearest point on polyline');
   return null;
 }


 // If the nearest point is within the error margin, snap to the polyline
 if (minDistance <= errorMargin) {
   return { point: nearestPoint, segmentIndex };
 } else {
   return { point: point, segmentIndex };
 }
}


function findNearestPoint(target, points) {
  let nearestPoint = null;
  let minDistance = Infinity;

  for (const point of points) {
    const dist = calculateDistance(
      target.latitude,
      target.longitude,
      point.latitude,
      point.longitude
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearestPoint = point;
    }
  }

  return nearestPoint;
}


function useInterval(callback, delay) {
const savedCallback = useRef();
useEffect(() => {
  savedCallback.current = callback;
}, [callback]);
useEffect(() => {
  function tick() {
    savedCallback.current();
  }
  if (delay !== null) {
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }
}, [delay]);
}
function nearestPointOnLineSegment(point, start, end) {
const dx = end.longitude - start.longitude;
const dy = end.latitude - start.latitude;
const t = ((point.longitude - start.longitude) * dx + (point.latitude - start.latitude) * dy) / (dx * dx + dy * dy);
 if (t < 0) return start;
if (t > 1) return end;
return {
  latitude: start.latitude + t * dy,
  longitude: start.longitude + t * dx,
  reference: 'N' // N for Nearest
};
}
function calculateTotalDistance(routeCoordinates) {
let totalDistance = 0;
for (let i = 0; i < routeCoordinates.length - 1; i++) {
  totalDistance += calculateDistance(
    routeCoordinates[i].latitude,
    routeCoordinates[i].longitude,
    routeCoordinates[i + 1].latitude,
    routeCoordinates[i + 1].longitude
  );
}
return totalDistance;
}
function calculateBearing(start, end) {
const startLat = start.latitude * Math.PI / 180;
const startLng = start.longitude * Math.PI / 180;
const endLat = end.latitude * Math.PI / 180;
const endLng = end.longitude * Math.PI / 180;
const y = Math.sin(endLng - startLng) * Math.cos(endLat);
const x = Math.cos(startLat) * Math.sin(endLat) -
          Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
let bearing = Math.atan2(y, x) * 180 / Math.PI;
return (bearing + 360) % 360; // Normalize to 0-360
}
function getCombinedDirections(route) {
  let combinedDistance = 0;
  let directions = [];

  for (let i = 0; i < route.length - 1; i++) {
    const start = route[i];
    const end = route[i + 1];
    const segmentDistance = calculateDistance(
      start.latitude,
      start.longitude,
      end.latitude,
      end.longitude
    );
    combinedDistance += segmentDistance;
    
    if (i < route.length - 2) {
      const nextEnd = route[i + 2];
      const currentBearing = calculateBearing(start, end);
      const nextBearing = calculateBearing(end, nextEnd);
      let bearingDifference = Math.abs(nextBearing - currentBearing);
      
      // Normalize bearing difference to be between 0 and 180 degrees
      if (bearingDifference > 180) {
        bearingDifference = 360 - bearingDifference;
      }
      
      // Consider it a turn if the bearing difference is significant (e.g., more than 30 degrees)
      if (bearingDifference > 30) {
        const turn = nextBearing > currentBearing ? 'right' : 'left';
        directions.push({
          text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet, then turn ${turn}`,
          turn: turn,
        });
        combinedDistance = 0;
      }
    }
  }
  
  // Add the final straight segment
  if (combinedDistance > 0) {
    directions.push({
      text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet`,
      turn: 'straight'
    });
  }
  
  // Add destination information
  const destinationReference = route[route.length - 1].reference;
  const roomCoords = findRoomCoordinates(destinationReference);
  if (roomCoords) {
    const finalBearing = calculateBearing(route[route.length - 2], route[route.length - 1]);
    const roomBearing = calculateBearing(route[route.length - 1], roomCoords);
    let relativeAngle = roomBearing - finalBearing;
    if (relativeAngle < -180) relativeAngle += 360;
    if (relativeAngle > 180) relativeAngle -= 360;
    const side = relativeAngle > 0 ? 'right' : 'left';
    directions.push({
      text: `Your destination will be on the ${side}`,
      turn: 'straight'
    });
  }
  
  return directions;
}

function getSegmentDirections(segment, isLastSegment, destination) {
  const start = segment[0];
  const end = segment[segment.length - 1];
  const distance = calculateTotalDistance(segment);
  const distanceInFeet = Math.round(distance * 3.28084 / 5) * 5;

  let text = `Go straight for ${distanceInFeet} feet`;
  let turn = 'straight';

  // Check if the segment involves stairs
  const isStaircaseStart = start.reference.startsWith('S');
  const isStaircaseEnd = end.reference.startsWith('S');
  const isGoingUp = start.reference.startsWith('S1') && end.reference.startsWith('S2');
  const isGoingDown = start.reference.startsWith('S2') && end.reference.startsWith('S1');

  if (!isStaircaseStart && isStaircaseEnd) {
    // First prompt to proceed to the stairs
    text = `Proceed to the stairs`;
    turn = 'stairs-start';
  } else if (isStaircaseStart && isStaircaseEnd) {
    // Climbing stairs segment
    text = `Climb the stairs to the ${isGoingUp ? 'second' : 'first'} floor`;
    turn = 'stairs-climb';
  } else if (isStaircaseStart && !isStaircaseEnd) {
    // Exiting the stairs on the destination floor
    text = `From stairs, walk forward ${distanceInFeet} feet`;
    turn = 'walk-forward';
  } else {
    // Handle turns and destination arrival
    const currentBearing = calculateBearing(start, segment[1]);
    const nextBearing = calculateBearing(segment[segment.length - 2], end);
    let bearingDifference = nextBearing - currentBearing;

    if (bearingDifference > 180) bearingDifference -= 360;
    if (bearingDifference < -180) bearingDifference += 360;

    if (Math.abs(bearingDifference) >= 80 && Math.abs(bearingDifference) <= 100) {
      turn = bearingDifference > 0 ? 'right' : 'left';
      text += `, then turn ${turn}`;
    }

    if (isLastSegment) {
      const destCoords = findRoomCoordinates(destination);
      if (destCoords) {
        const finalBearing = calculateBearing(segment[segment.length - 2], end);
        const roomBearing = calculateBearing(end, destCoords);
        let relativeAngle = roomBearing - finalBearing;
        if (relativeAngle < -180) relativeAngle += 360;
        if (relativeAngle > 180) relativeAngle -= 360;
        const side = relativeAngle > 0 ? 'right' : 'left';
        text += `. Your destination will be on the ${side}`;
      }
    }
  }

  return { text, turn };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
const R = 6371e3; // Earth's radius in meters
const φ1 = lat1 * Math.PI/180;
const φ2 = lat2 * Math.PI/180;
const Δφ = (lat2-lat1) * Math.PI/180;
const Δλ = (lon2-lon1) * Math.PI/180;
const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
return R * c; // Distance in meters
}
function findNearestSegment(point, polyline) {
let minDistance = Infinity;
let nearestIndex = 0;
for (let i = 0; i < polyline.length; i++) {
  const distance = calculateDistance(
    point.latitude,
    point.longitude,
    polyline[i].latitude,
    polyline[i].longitude
  );
  if (distance < minDistance) {
    minDistance = distance;
    nearestIndex = i;
  }
}
return nearestIndex;
}

function findCurrentSegment(location, route) {
if (!location || !route || route.length < 2) {
  return { currentSegment: 0, progress: 0, currentBearing: 0, nextBearing: 0 };
}








let minDistance = Infinity;
let currentSegment = 0;
let progress = 0;








for (let i = 0; i < route.length - 1; i++) {
  const start = route[i];
  const end = route[i + 1];
  if (!start || !end) continue;








  const nearest = nearestPointOnLineSegment(location, start, end);
  const dist = distance(location, nearest);








  if (dist < minDistance) {
    minDistance = dist;
    currentSegment = i;
    progress = distance(start, nearest) / distance(start, end);
  }
}








const currentBearing = calculateBearing(route[currentSegment], route[currentSegment + 1]);
const nextBearing = currentSegment < route.length - 2 ?
  calculateBearing(route[currentSegment + 1], route[currentSegment + 2]) : currentBearing;








return { currentSegment, progress, currentBearing, nextBearing };
}








export default function Map({userId}) {
const { location, errorMsg } = useContext(LocationContext);
const [estimatedTime, setEstimatedTime] = useState(0);
const mapRef = useRef(null);
const [searchQuery, setSearchQuery] = useState('');
const [route, setRoute] = useState([]);
const [destination, setDestination] = useState(null);
const [bearing, setBearing] = useState(0);
const [isRouteActive, setIsRouteActive] = useState(false);
const [showArrivedMessage, setShowArrivedMessage] = useState(false);
const [destinationCoords, setDestinationCoords] = useState(null);
const [hasArrived, setHasArrived] = useState(false);
const [isMapDisabled, setIsMapDisabled] = useState(false);
const [currentDirection, setCurrentDirection] = useState({ text: '', icon: null });
const [remainingDistance, setRemainingDistance] = useState(0);
const [searchHistory, setSearchHistory] = useState([]);
const [showHistory, setShowHistory] = useState(false);
const routeFromHome = useRoute();
const [currentSegment, setCurrentSegment] = useState(0);
const [startingPoint, setStartingPoint] = useState(null);
const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
const [routeSegments, setRouteSegments] = useState([]);
const [startingPointQuery, setStartingPointQuery] = useState('');
const [directions, setDirections] = useState({ text: '', turn: 'straight' });
const [showFirstFloor, setShowFirstFloor] = useState(true);
const [currentFloor, setCurrentFloor] = useState(1);
const [heading, setHeading] = useState(0);
const [showSearch, setShowSearch] = useState(true);


const handleEndSegment = useCallback(() => {
  if (currentSegmentIndex < routeSegments.length - 1) {
    const nextIndex = currentSegmentIndex + 1;
    setCurrentSegmentIndex(nextIndex);

    const nextSegment = routeSegments[nextIndex];
    const newBearing = calculateBearing(nextSegment[0], nextSegment[nextSegment.length - 1]);
    setBearing(newBearing);

    animateCamera(nextSegment[0], newBearing);

    // Update directions
    const isLastSegment = nextIndex === routeSegments.length - 1;
    const segmentDirections = getSegmentDirections(nextSegment, isLastSegment, searchQuery);
    setDirections(segmentDirections);

    // Update estimated time
    const remainingRoute = routeSegments.slice(nextIndex).flat();
    const remainingDistance = calculateTotalDistance(remainingRoute);
    const updatedEstimatedTime = Math.ceil(remainingDistance * 3.28084 / 308);
    setEstimatedTime(updatedEstimatedTime);

    // Handle floor changes
    const currentSegment = routeSegments[currentSegmentIndex];
    const nextFloor = nextSegment[0].reference.startsWith('S2') ? 2 : 1;
    if (currentSegment[currentSegment.length - 1].reference.startsWith('S') && currentFloor !== nextFloor) {
      setCurrentFloor(nextFloor);
      setShowFirstFloor(nextFloor === 1);
    }
  } else {
    // Route is complete
    setHasArrived(true);
    setShowArrivedMessage(true);
    setShowSearch(true);
    setRoute([]);
    setRouteSegments([]);
    setDestination(null);
    setBearing(0);
    setIsRouteActive(false);
    setEstimatedTime(0);
    setDirections({ text: '', turn: null });
    setTimeout(() => setShowArrivedMessage(false), 3000);
  }
}, [currentSegmentIndex, routeSegments, calculateBearing, animateCamera, searchQuery, calculateTotalDistance, currentFloor]);
const routeBetweenFloors = (start, end, startFloorCoordinates, endFloorCoordinates, startFloorStaircases, endFloorStaircases) => {
  // Find nearest staircase on start floor
  const nearestStartStaircase = findNearestPoint(start, startFloorStaircases);

  if (!nearestStartStaircase) {
    console.error('No nearest staircase found on the start floor');
    return []; // Return an empty route if no staircase is found
  }

  // Find all possible routes through different staircases
  const possibleRoutes = startFloorStaircases.map(startStaircase => {
    // Extract the staircase number
    const staircaseNumber = startStaircase.reference.match(/_(\d+)$/)[1];

    // Find the corresponding staircase on the other floor
    let correspondingStaircase;
    if (startStaircase.reference.startsWith('S1_')) {
      correspondingStaircase = endFloorStaircases.find(stair => stair.reference === `S2_${staircaseNumber}`);
    } else if (startStaircase.reference.startsWith('S2_')) {
      correspondingStaircase = endFloorStaircases.find(stair => stair.reference === `S1_${staircaseNumber}`);
    }

    if (!correspondingStaircase) {
      console.error(`No corresponding staircase found between floors for S1/S2_${staircaseNumber}`);
      return null;
    }

    // Route to staircase on start floor
    const startToStaircaseGraphData = createConstrainedGraph(startFloorCoordinates);
    const startSegment = findNearestSegment(start, startFloorCoordinates);
    const staircaseSegment = findNearestSegment(startStaircase, startFloorCoordinates);
    const startToStaircasePath = constrainedDijkstra(startToStaircaseGraphData, startSegment, staircaseSegment);
    const startToStaircaseRoute = startToStaircasePath.map(index => startFloorCoordinates[index]);

    // Route from corresponding staircase to destination on the end floor
    const staircaseToEndGraphData = createConstrainedGraph(endFloorCoordinates);
    const correspondingStaircaseSegment = findNearestSegment(correspondingStaircase, endFloorCoordinates);
    const endSegment = findNearestSegment(end, endFloorCoordinates);
    const staircaseToEndPath = constrainedDijkstra(staircaseToEndGraphData, correspondingStaircaseSegment, endSegment);
    const staircaseToEndRoute = staircaseToEndPath.map(index => endFloorCoordinates[index]);

    // Combine routes and calculate total distance
    const fullRoute = [...startToStaircaseRoute, ...staircaseToEndRoute];
    const totalDistance = calculateTotalDistance(fullRoute);

    return { route: fullRoute, distance: totalDistance, startStaircase, endStaircase: correspondingStaircase };
  }).filter(Boolean); // Remove null routes

  if (possibleRoutes.length === 0) {
    console.error('No valid routes found between floors');
    return [];
  }

  // Find the shortest route
  const shortestRoute = possibleRoutes.reduce((shortest, current) => 
    current.distance < shortest.distance ? current : shortest
  );

  console.log(`Chosen route uses staircases: ${shortestRoute.startStaircase.reference} to ${shortestRoute.endStaircase.reference}`);
  return shortestRoute.route;
};

useEffect(() => {
  let subscription;
  let lastUpdateTime = 0;
  const updateInterval = 500; // 2 seconds in milliseconds

  const startMagnetometer = async () => {
    try {
      await Magnetometer.requestPermissionsAsync();
      Magnetometer.setUpdateInterval(updateInterval);
      subscription = Magnetometer.addListener((data) => {
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime >= updateInterval) {
          const newHeading = Math.round((Math.atan2(data.y, data.x) * 180) / Math.PI);
          setHeading(newHeading);
          lastUpdateTime = currentTime;
        }
      });
    } catch (error) {
      console.log('Error setting up magnetometer:', error);
    }
  };

  startMagnetometer();

  return () => {
    if (subscription) {
      subscription.remove();
    }
  };
}, []);

const getHeadingDifference = useCallback(() => {
  if (!isRouteActive || routeSegments.length === 0) return null;

  const currentSegment = routeSegments[currentSegmentIndex];
  if (!currentSegment || currentSegment.length < 2) return null;

  // Check if the current segment is for stairs (assuming stair segments have references starting with 'S')
  const isStairSegment = currentSegment[0].reference.startsWith('S') || currentSegment[currentSegment.length - 1].reference.startsWith('S');

  if (isStairSegment) {
    // For stair segments, we don't provide directional guidance
    return null;
  }

  const segmentStart = currentSegment[0];
  const segmentEnd = currentSegment[currentSegment.length - 1];
  const segmentBearing = calculateBearing(segmentStart, segmentEnd);

  let difference = segmentBearing - heading;
  if (difference < -180) difference += 360;
  if (difference > 180) difference -= 360;

  return difference;
}, [isRouteActive, routeSegments, currentSegmentIndex, heading, calculateBearing]);

  
// Initial orientation guidance
const getFirstHeadingDirection = useCallback(() => {
  const difference = getHeadingDifference();

  if (Math.abs(difference) <= 45) {
    return 'You are facing the right way';
  } else if (difference < 0) {
    return `Rotate left ${Math.abs(Math.round(difference))}°`;
  } else {
    return `Rotate right ${Math.round(difference)}°`;
  }
}, [getHeadingDifference, routeSegments, currentSegmentIndex]);

const getDirectionGuidance = useCallback(() => {
  const nextSegmentIndex = currentSegmentIndex + 1;
  const nextSegment = routeSegments[nextSegmentIndex];
  
  // If no next segment, return final directions text from directions
  if (!nextSegment) {
    return directions.text;
  }
  
  // Calculate heading difference for the next segment
  const difference = getHeadingDifference(nextSegment);

  // Extract distance from directions.text for turn guidance
  let distance = directions.text.match(/(\d+)/);
  distance = distance ? `${distance[0]} feet` : 'unknown distance';

  if(directions.text.startsWith("From stairs")) {
    let secondary = ""
    if (difference > 0) {
      secondary = `Turn left`;
    } else {
      secondary = `Turn right`;
    }

    return directions.text + " and " + secondary.toLowerCase()
  }

  // If there's no heading difference, just return directions.text
  if (difference === null) {
    return directions.text;
  }

  // Provide turn instructions based on the heading difference
  if (difference > 0) {
    return `Turn left in ${distance}`;
  } else {
    return `Turn right in ${distance}`;
  }
}, [getHeadingDifference, routeSegments, currentSegmentIndex, directions.text]);


const [nearestPolylinePoint, setNearestPolylinePoint] = useState(null);

const checkDistanceToPolyline = useCallback((userLocation) => {
  if (!userLocation) return;
   const { point: nearestPolylinePoint } = findNearestPointOnPolyline(userLocation);
  const distanceToPolyline = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    nearestPolylinePoint.latitude,
    nearestPolylinePoint.longitude
  );
   setIsMapDisabled(distanceToPolyline > 200);
}, []);
const updateNearestPolylinePoint = useCallback(() => {
 if (location) {
   const { point: nearest, segmentIndex } = findNearestPointOnPolyline({
     latitude: location.coords.latitude,
     longitude: location.coords.longitude
   });
  
   const constrainedSegment = constrainToAdjacentSegments(currentSegment, segmentIndex);
   setCurrentSegment(constrainedSegment);
  
   const constrainedPoint = firstFloorCoordinates[constrainedSegment];
   setNearestPolylinePoint(constrainedPoint);
   checkDistanceToPolyline(constrainedPoint);
 }
}, [location, currentSegment, checkDistanceToPolyline]);






useEffect(() => {
 const nearestPointInterval = setInterval(updateNearestPolylinePoint, 100); // Update every 100ms


 return () => {
   clearInterval(nearestPointInterval);
 };
}, [updateNearestPolylinePoint]);


const calculateRoute = useCallback((start, end) => {
  try {
    let routeCoordinates = [];
    const startFloor = firstFloorCoordinates.some(coord => coord.reference === start.reference) ? 1 : 2;
    const endFloor = firstFloorCoordinates.some(coord => coord.reference === end.reference) ? 1 : 2;

    if (startFloor === endFloor) {
      // Same floor routing
      const coordinates = startFloor === 1 ? firstFloorCoordinates : secondFloorCoordinates;
      const startSegment = findNearestSegment(start, coordinates);
      const endSegment = findNearestSegment(end, coordinates);
      const graphData = createConstrainedGraph(coordinates);
      const path = constrainedDijkstra(graphData, startSegment, endSegment);
      routeCoordinates = path.map(index => coordinates[index]);
    } else {
      // Different floor routing
      if (startFloor === 1 && endFloor === 2) {
        routeCoordinates = routeBetweenFloors(start, end, firstFloorCoordinates, secondFloorCoordinates, firstFloorStaircases, secondFloorStaircases);
      } else {
        routeCoordinates = routeBetweenFloors(start, end, secondFloorCoordinates, firstFloorCoordinates, secondFloorStaircases, firstFloorStaircases);
      }
    }

    return routeCoordinates;
  } catch (error) {
    console.error('Error calculating route:', error);
    return [start, end];
  }
}, [firstFloorCoordinates, secondFloorCoordinates, firstFloorStaircases, secondFloorStaircases, findNearestSegment, createConstrainedGraph, constrainedDijkstra, findNearestPoint]);
useEffect(() => {
  const debouncedLocationUpdate = debounce((newLocation) => {
    if (newLocation) {
      const { point: nearest } = findNearestPointOnPolyline({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude
      });
      setNearestPolylinePoint(nearest);
      checkDistanceToPolyline(nearest);
      if (route.length > 1 && destinationCoords) {
        const { currentSegment, progress, currentBearing, nextBearing } = findCurrentSegment(
          nearest,
          route
        );
        const remainingRoute = route.slice(currentSegment);
        const combinedDirection = getCombinedDirections(remainingRoute);
        setCurrentDirection(combinedDirection);
        const remainingDistance = calculateTotalDistance(remainingRoute);
        const totalRemainingDistanceInFeet = Math.round(Math.round(remainingDistance * 3.28084) / 5) * 5;
        const updatedEstimatedTime = Math.ceil(totalRemainingDistanceInFeet / 308);
        setEstimatedTime(updatedEstimatedTime);
        setRemainingDistance(totalRemainingDistanceInFeet);
        const distanceToDestination = calculateDistance(
          nearest.latitude,
          nearest.longitude,
          destinationCoords.latitude,
          destinationCoords.longitude
        );
        if (distanceToDestination <= 10) {
          setHasArrived(true);
          setShowArrivedMessage(true);
          setShowSearch(true);
          setRoute([]);
          setDestination(null);
          setBearing(0);
          setIsRouteActive(false);
          setEstimatedTime(0);
          setCurrentDirection({ text: '', turn: null });
          setSearchQuery('');
          setTimeout(() => setShowArrivedMessage(false), 3000);
        } else {
          if (currentSegment < route.length - 1) {
            const start = route[currentSegment];
            const end = route[currentSegment + 1];
            if (start && end) {
              const newBearing = calculateBearing(start, end);
              setBearing(newBearing);
            }
         
            animateCamera(nearest, bearing);
          }
        }
      }
    }
  }, 4000);  // Debounce for 500ms
   debouncedLocationUpdate(location);
   return () => {
    debouncedLocationUpdate.cancel();
  };
}, [location, route, destinationCoords, animateCamera, bearing, checkDistanceToPolyline]);

 // Modify the existing useInterval hook
 useInterval(() => {
  if (isRouteActive && routeSegments[currentSegmentIndex] && mapRef.current) {
    const currentPosition = routeSegments[currentSegmentIndex][0];
    mapRef.current.animateCamera({
      center: {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      },
      heading: bearing,
      pitch: 0,
      zoom: 18,
      altitude: 2000,
    }, { duration: 1000 });
  }
}, 3000);


const handleExitRoute = useCallback(() => {
  setRoute([]);
  setDestination(null);
  setBearing(0);
  setIsRouteActive(false);
  setSearchQuery('');
  setStartingPointQuery('');  // Add this line
  setDestinationCoords(null);
  setStartingPoint(null);
  setShowSearch(true);

  if (startingPoint) {
    animateCamera({
      latitude: startingPoint.latitude,
      longitude: startingPoint.longitude,
    }, 0);
  }
}, [startingPoint, animateCamera]);

useEffect(() => {
  const fetchHistory = async () => {
    try {
      const history = await loadSearchHistory(userId);
      setSearchHistory(history);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };
  fetchHistory();
}, [userId]);








const saveSearchHistory = async (uid, history) => {
  try {
    const jsonValue = JSON.stringify(history);
    await AsyncStorage.setItem(`@search_history_${uid}`, jsonValue);
  } catch (e) {
    console.error('Failed to save search history.', e);
  }
};








const loadSearchHistory = async (uid) => {
  try {
    const jsonValue = await AsyncStorage.getItem(`@search_history_${uid}`);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load search history.', e);
    return [];
  }
};








const handleSearch = useCallback(async () => {
  if (startingPointQuery && searchQuery) {
    Keyboard.dismiss();
    setShowSearch(false);


    const newSearch = { query: searchQuery, timestamp: new Date().toISOString() };
    const updatedHistory = [...searchHistory, newSearch];
    setSearchHistory(updatedHistory);
    await saveSearchHistory(userId, updatedHistory);
    setShowHistory(false);

    setHasArrived(false);
    const newDestination = searchQuery.toUpperCase();
    const startPoint = [...firstFloorCoordinates, ...secondFloorCoordinates].find(point => point.reference.toUpperCase() === startingPointQuery.toUpperCase());
    const destinationPoint = [...firstFloorCoordinates, ...secondFloorCoordinates].find(point => point.reference.toUpperCase() === newDestination);

    if (startPoint && destinationPoint) {
      setStartingPoint(startPoint);
      setDestination(destinationPoint);
      setIsRouteActive(true);
  
      const startFloor = firstFloorCoordinates.includes(startPoint) ? 1 : 2;
      setCurrentFloor(startFloor);
      setShowFirstFloor(startFloor === 1);
  
      const endFloor = firstFloorCoordinates.includes(destinationPoint) ? 1 : 2;

      const newRoute = calculateRoute(startPoint, destinationPoint);

      if (newRoute.length > 0) {
        const routeSegments = determineRealTurns(newRoute);
        setRoute(newRoute);
        setRouteSegments(routeSegments);
        setCurrentSegmentIndex(0);

        const estimatedTimeInMinutes = Math.ceil(calculateTotalDistance(newRoute) * 3.28084 / 250);
        setEstimatedTime(estimatedTimeInMinutes);

        if (routeSegments.length > 0) {
          const firstSegment = routeSegments[0];
          const newBearing = calculateBearing(firstSegment[0], firstSegment[firstSegment.length - 1]);
          setBearing(newBearing);

          const segmentDirections = getSegmentDirections(firstSegment, routeSegments.length === 1, newDestination);
          setDirections(segmentDirections);

          animateCamera(startPoint, newBearing);
        }
      } else {
        console.error('Unable to calculate route');
        alert('Unable to calculate route. Please try again.');
      }
    } else {
      alert("Invalid starting point or destination. Please enter valid hall numbers (e.g., F108, S18).");
      setShowSearch(true);
    }
  } else {
    alert("Please enter both a starting point and a destination.");
  }
}, [
  startingPointQuery,
  searchQuery,
  searchHistory,
  userId,
  firstFloorCoordinates,
  secondFloorCoordinates,
  calculateRoute,
  calculateBearing,
  animateCamera,
  calculateTotalDistance,
  saveSearchHistory,
  setShowSearch
]);
 // Add this useEffect hook to handle route updates
 useEffect(() => {
  if (isRouteActive && startingPoint && destination) {
    const newRoute = calculateRoute(startingPoint, destination);

    if (newRoute.length > 0) {
      setRoute(newRoute);
   
      const totalDistance = calculateTotalDistance(newRoute);
      const totalDistanceInFeet = Math.round(totalDistance * 3.28084 / 5) * 5;
      const updatedEstimatedTime = Math.ceil(totalDistanceInFeet / 308);
      setEstimatedTime(updatedEstimatedTime);
   
      if (newRoute.length > 1) {
        const start = newRoute[0];
        const end = newRoute[1];
        if (start && end) {
          const newBearing = calculateBearing(start, end);
          setBearing(newBearing);
       
          const combinedDirection = getCombinedDirections(newRoute);
          setCurrentDirection(combinedDirection);
       
          animateCamera(startingPoint, newBearing);
        }
      }
    }
  }
}, [isRouteActive, startingPoint, destination, calculateRoute, calculateTotalDistance, calculateBearing, getCombinedDirections, animateCamera]);
useInterval(() => {
  if (isRouteActive) {
    // This will trigger the useEffect hook above
    setNearestPolylinePoint(prev => ({...prev}));
  }
}, 3000);








const animateCamera = useCallback((targetLocation, targetBearing) => {
  mapRef.current?.animateCamera({
    center: {
      latitude: targetLocation.latitude,
      longitude: targetLocation.longitude,
    },
    heading: targetBearing,
    pitch: 0,
    zoom: 18,
    altitude: 2000,
  }, { duration: 1000 });
}, []);
return (
  <View style={styles.container}>
    <MapView
      ref={mapRef}
      style={styles.map}
      initialCamera={{
        center: {
          latitude: nearestPolylinePoint?.latitude || location?.coords.latitude || 0,
          longitude: nearestPolylinePoint?.longitude || location?.coords.longitude || 0,
        },
        pitch: 0,
        heading: 0,
        altitude: 2000,
        zoom: 18,
      }}
      showsCompass={!isRouteActive}
      showsPointsOfInterest={false}
      showsBuildings={true}
      showsIndoors={false}
    >
{isRouteActive && (
  <>
    {routeSegments.slice(currentSegmentIndex).map((segment, index) => {
      const isSegmentOnCurrentFloor = segment.every(point => 
        (currentFloor === 1 && firstFloorCoordinates.some(c => c.reference === point.reference)) ||
        (currentFloor === 2 && secondFloorCoordinates.some(c => c.reference === point.reference))
      );
      
      if (isSegmentOnCurrentFloor) {
        return (
          <Polyline
            key={index}
            coordinates={segment}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        );
      }
      return null;
    })}
  </>
)}
  {showFirstFloor ? (
    <Polyline
      coordinates={firstFloorCoordinates}
      strokeColor="#4a4a4a"
      strokeWidth={1}
    />
  ) : (
    <Polyline
      coordinates={secondFloorCoordinates}
      strokeColor="#4a4a4a"
      strokeWidth={1}
    />
  )}

      {isRouteActive && routeSegments[currentSegmentIndex] && (
        <Marker
          coordinate={{
            latitude: routeSegments[currentSegmentIndex][0].latitude,
            longitude: routeSegments[currentSegmentIndex][0].longitude,
          }}
        >
          <View style={styles.customMarker}>
            <View style={styles.markerInner} />
          </View>
        </Marker>
      )}
    </MapView>
    <View style={styles.overlay}>
    {showSearch && (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={startingPointQuery}
          onChangeText={setStartingPointQuery}
          placeholder="Enter starting point (e.g., F108)"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowHistory(true)}
          placeholder="Enter destination (e.g., F108)"
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
  style={styles.floorToggleButton} 
  onPress={() => {
    setShowFirstFloor(prev => !prev);
    setCurrentFloor(prev => prev === 1 ? 2 : 1);
  }}
>
  <Text style={styles.floorToggleButtonText}>
    {showFirstFloor ? 'Show 2nd Floor' : 'Show 1st Floor'}
  </Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    )}
      {showHistory && (
        <View style={styles.historyContainer}>
          {searchHistory.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleSearch(item.query)}>
              <Text style={styles.historyItem}>{item.query}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {isRouteActive && (
        <View style={styles.routeInfoContainer}>
          <Text style={styles.routeInfoText}>
            Estimated time: {estimatedTime} min
          </Text>
          <TouchableOpacity style={styles.endSegmentButton} onPress={handleEndSegment}>
            <Text style={styles.endSegmentButtonText}>End Segment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitButton} onPress={handleExitRoute}>
            <Text style={styles.exitButtonText}>Exit Route</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    {showArrivedMessage && (
      <View style={styles.arrivedMessageContainer}>
        <Text style={styles.arrivedMessageText}>Arrived</Text>
      </View>
    )}
    {isMapDisabled && (
      <View style={styles.disabledMapContainer}>
        <Text style={styles.disabledMapText}>
          Map is currently unavailable. Please move closer to the designated area.
        </Text>
      </View>
    )}
    {isRouteActive && (
  <View style={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>

    <View style={styles.rotationContainer}>
          <Text style={styles.directionsText}>
            Rotation
          </Text>

          {getFirstHeadingDirection().startsWith("Rotate left") 
            ? <FontAwesome6 name="arrow-rotate-left" size={24} color="black" />
            : getFirstHeadingDirection().startsWith("Rotate right")
              ? <FontAwesome6 name="arrow-rotate-right" size={24} color="black" />
              : <FontAwesome name="check" size={24} color="black" />
            }
    </View>

    <View style={styles.guidanceContainer}>
          <Text style={styles.directionsText}>
            {getDirectionGuidance()}
          </Text>
      </View>

  </View>
)}

  </View>
);
}