import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, Keyboard, SafeAreaView } from 'react-native';
import MapView, { Polyline, Marker,} from 'react-native-maps';
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

// const firstFloorCoordinates = [
//   { latitude: 33.11012705174, longitude: -96.66134610000, reference: 'mainhall1' },
//   { latitude: 33.11005377415, longitude: -96.66127730000, reference: 'mainhall2' },
//   { latitude: 33.11001053185, longitude: -96.66123670000, reference: 'mainhall3' },
//   { latitude: 33.10978398907, longitude: -96.66102400000, reference: 'mainhall4' },
//   { latitude: 33.10958417983, longitude: -96.66083640000, reference: 'mainhall5' },
//   { latitude: 33.10957086632, longitude: -96.66082390000, reference: 'f entrance' },
// { latitude: 33.10947149, longitude: -96.6609794, reference: 'f mid front' },
// { latitude: 33.1095631, longitude: -96.66106426, reference: 'TLF' },







// { latitude: 33.10955218, longitude: -96.66107382, reference: 'F108' },
// { latitude: 33.10949087, longitude: -96.66116680, reference: 'F111' },
// { latitude: 33.10951721, longitude: -96.66112686, reference: 'F110' },
// { latitude: 33.10946359, longitude: -96.66120816, reference: 'F112' },
// { latitude: 33.10941872, longitude: -96.66127622, reference: 'F114' },
// { latitude: 33.10939153, longitude: -96.66131744, reference: 'F115' },
// { latitude: 33.10936915, longitude: -96.66135138, reference: 'F116' },
// { latitude: 33.10933977, longitude: -96.66139594, reference: 'F117' },
// { latitude: 33.10928326, longitude: -96.66148163, reference: 'F120' },
// {latitude:33.1092741, longitude:-96.6614961, reference: 'midhallcut1'},
// {latitude:33.1091114, longitude:-96.6613463, reference: 'midhallcut12'},
// {latitude:33.1092741, longitude:-96.6614961, reference: 'midhallcut13'},
// { latitude: 33.10932618, longitude: -96.66141655, reference: 'F119' },
// { latitude: 33.10932480, longitude: -96.66141863, reference: 'S1_8' },
// { latitude: 33.10922702, longitude: -96.66156692, reference: 'F123' },
// { latitude: 33.10922085, longitude: -96.66157627, reference: 'F124' },
// { latitude: 33.10918304, longitude: -96.66163361, reference: 'F125' },
// { latitude: 33.10916888, longitude: -96.66165509, reference: 'F126' },
// { latitude: 33.10910607, longitude: -96.66175032, reference: 'F128' },
// { latitude: 33.10909943, longitude: -96.66176040, reference: 'F129' },
// { latitude: 33.10904726, longitude: -96.66183951, reference: 'F130' },
// { latitude: 33.10900099, longitude: -96.66190967, reference: 'F133' },








// { latitude: 33.10883376, longitude: -96.66176128, reference: 'F136' },
// { latitude: 33.10886333, longitude: -96.66171719, reference: 'F137' },
// { latitude: 33.10889290, longitude: -96.66167311, reference: 'F138' },
// { latitude: 33.10892247, longitude: -96.66162902, reference: 'F139' },
// { latitude: 33.10895204, longitude: -96.66158494, reference: 'F140' },
// { latitude: 33.10898161, longitude: -96.66154086, reference: 'F141' },
// { latitude: 33.10901118, longitude: -96.66149677, reference: 'F144' },
// { latitude: 33.10904075, longitude: -96.66145269, reference: 'F145' },
// { latitude: 33.10907032, longitude: -96.66140860, reference: 'F146' },
// { latitude: 33.10909989, longitude: -96.66136452, reference: 'S1_7' },
// { latitude: 33.10912945, longitude: -96.66132043, reference: 'F149' },
// { latitude: 33.10915902, longitude: -96.66127635, reference: 'F153' },
// { latitude: 33.10918859, longitude: -96.66123226, reference: 'F154' },
// { latitude: 33.10921816, longitude: -96.66118818, reference: 'F155' },
// { latitude: 33.10924773, longitude: -96.66114409, reference: 'F156' },
// { latitude: 33.10927730, longitude: -96.66110001, reference: 'F158' },
// { latitude: 33.10930687, longitude: -96.66105592, reference: 'F160' },
// { latitude: 33.10933644, longitude: -96.66101184, reference: 'F161' },
// { latitude: 33.10936601, longitude: -96.66096776, reference: 'F163' },
// { latitude: 33.10939558, longitude: -96.66092367, reference: 'F164' },
// { latitude: 33.1094010, longitude: -96.6609141, reference: 'TRF' },
// { latitude: 33.10947149, longitude: -96.6609794, reference: 'f mid front' },
// { latitude: 33.10957086632, longitude: -96.66082390000, reference: 'f entrance' },







// // New entries
// { latitude: 33.10937095057, longitude: -96.66063620000, reference: 'a entrance' },
//  { latitude: 33.10946603787324, longitude:  -96.66049207061944, reference: 'amidfront' },
//  {latitude:33.1095109380455, longitude:-96.66053368788533, reference:'A134'},
//  { latitude: 33.10953135976243, longitude: -96.66055364224918, reference: 'A1' },
//  { latitude: 33.10956178414, longitude: -96.66050830533, reference: 'A130' },
//  { latitude: 33.10961167985, longitude: -96.66043394220, reference: 'A128' },
//  { latitude: 33.10963654762, longitude: -96.66039688000, reference: 'A125' },
//  { latitude: 33.10961085444, longitude: -96.66043517237, reference: 'A126' },
//  { latitude: 33.10968441530, longitude: -96.66032553941, reference: 'A121' },
//  { latitude: 33.10970620484, longitude: -96.66029306490, reference: 'A124' },
//  { latitude: 33.10972164366, longitude: -96.66027005533, reference: 'S1_2' },
// { latitude: 33.10955886827335, longitude: -96.66011928918694, reference: 'A116' },
// { latitude: 33.10954361813029, longitude: -96.66014275443264, reference: 'A114' },
// { latitude: 33.10952469860161, longitude: -96.66017186572604, reference: 'A115' },
// { latitude: 33.10946234482971, longitude: -96.6602678088639, reference: 'A112' },
// { latitude: 33.10944770286005, longitude: -96.66029033831916, reference: 'A110' },
// { latitude: 33.10947839516472, longitude: -96.6602431123707, reference: 'A109' },
// { latitude: 33.109399795176294, longitude: -96.66036405340273, reference: 'A108' },
// { latitude: 33.109372346964086, longitude: -96.66040628769791, reference: 'A106' },
// { latitude:33.10940547854645, longitude:-96.66043593912865, reference:'A104'},
// { latitude: 33.10946603787324, longitude:  -96.66049207061944, reference: 'amidfront' },
// { latitude: 33.10937095057, longitude: -96.66063620000, reference: 'a entrance' },
// { latitude: 33.10913120078, longitude: -96.66041110000, reference: 'g entrance' },
// { latitude: 33.10885800744, longitude: -96.66015460000, reference: 'k entrance' }
// ];

// const secondFloorCoordinates = [



//   { latitude: 33.109971381724904, longitude: -96.66130147923262, reference: '2mainhall' },
//   { latitude: 33.10952242109021, longitude: -96.66088922805024, reference: '2fentrance' },
//   { latitude: 33.10956921622493, longitude: -96.66081717996883, reference: '2entrance' },
 
// { latitude: 33.10945468699747, longitude: -96.66099546935033, reference: '2f mid front' },
// { latitude: 33.10954500167219, longitude: -96.66108226076537, reference: 'f207' },
// { latitude: 33.10953483107906, longitude: -96.6610977603442, reference: 'f208' },
// { latitude: 33.10946539704782, longitude: -96.66120357504222, reference: 'f210' },
// { latitude: 33.10945784773486, longitude: -96.66121507989448, reference: 'f212' },
// { latitude: 33.109452122162395, longitude: -96.66122380543887, reference: 'f213' },
// { latitude: 33.109368113683416, longitude: -96.66135183101474, reference: 'f216' },
// { latitude: 33.10935343444692, longitude: -96.66137420158647, reference: 'f217' },
// { latitude: 33.1093251244839, longitude: -96.6614173448425, reference: 'f215' },
// { latitude: 33.10930855790873, longitude: -96.66144259164321, reference: 'S2_8' },
// { latitude: 33.10925549614271, longitude: -96.66152345566115, reference: 'midcut1' },
// { latitude: 33.109224250296336, longitude: -96.66157107308649, reference: 'f222' },
// { latitude: 33.1092031527484, longitude: -96.66160322490923, reference: 'f224' },
// { latitude: 33.10914850258018, longitude: -96.66168650958885, reference: 'f223' },
// { latitude: 33.109128371004914, longitude: -96.66171718930771, reference: 'f226' },
// { latitude: 33.10910782001707, longitude: -96.66174850819462, reference: 'f227' },
// { latitude: 33.109039748725316, longitude: -96.66185224613196, reference: 'f228' },
// { latitude: 33.10903177996745, longitude: -96.66186439020154, reference: 'f229' },
// { latitude: 33.1090221335754, longitude: -96.6618790909188, reference: 'f230' },
// { latitude: 33.10896764835255, longitude: -96.66196212422827, reference: 'BLC' },

// { latitude: 33.10880219053123, longitude: -96.661809713627, reference: 'BRC' },
// { latitude: 33.10885407349071, longitude: -96.66173080754453, reference: 'f234' },
// { latitude: 33.1088667511467, longitude: -96.66171152675986, reference: 'f235' },
// { latitude: 33.10887335684002, longitude: -96.661701480506, reference: 'f236' },
// { latitude: 33.108949273233236, longitude: -96.66158602322979, reference: 'f238' },
// { latitude: 33.10896128996865, longitude: -96.66156774760472, reference: 'f239' },
// { latitude: 33.108982260399344, longitude: -96.66153585477227, reference: 'f241' },
// { latitude: 33.10904438696183, longitude: -96.66144136972915, reference: 'f242' },
// { latitude: 33.10905619398012, longitude: -96.66142341305189, reference: 'f243' },
// { latitude: 33.10909147837973, longitude: -96.66136975085195, reference: 'midcut2' },
// { latitude: 33.10910835955181, longitude: -96.66134407715927, reference: 'fly1' },
// { latitude: 33.10914197576989, longitude: -96.66129295200946, reference: 'S2_10' },
// { latitude: 33.10915944477946, longitude: -96.66126638430546, reference: 'f248' },
// { latitude: 33.10918823779095, longitude: -96.66122259451856, reference: 'f249' },
// { latitude: 33.109200527784935, longitude: -96.6612039033088, reference: 'f250' },
// { latitude: 33.10927004793607, longitude: -96.661098173743, reference: 'f252' },
// { latitude: 33.109283322849, longitude: -96.66107798462147, reference: 'f253' },
// { latitude: 33.10929575894579, longitude: -96.66105907121158, reference: 'f254' },
// { latitude: 33.10934455626815, longitude: -96.6609848579134, reference: 'f255' },
// { latitude: 33.109379913609914, longitude: -96.66093108477955, reference: 'TRC' },

// { latitude: 33.10945468699747, longitude: -96.66099546935033, reference: '2f mid front' },
// { latitude: 33.10952242109021, longitude: -96.66088922805024, reference: '2fentrance' },
// { latitude: 33.10931541294438, longitude: -96.66069914601121, reference: 'S2_3' },
// { latitude: 33.10906944131525, longitude: -96.66047328635425, reference: "gentrance" },
// { latitude: 33.10900017535599, longitude: -96.66058231936353, reference: "gmid" },
// { latitude: 33.109058569591525, longitude: -96.66063592758371, reference: "g205" },
// { latitude: 33.1090913645899, longitude: -96.66066596996748, reference: "g206" },
// { latitude: 33.109073120338095, longitude: -96.6606940468132, reference: "g207" },
// { latitude: 33.109044117584695, longitude: -96.6607382654019, reference: "g209" },
// { latitude: 33.10901763127212, longitude: -96.66077864733893, reference: "g210" },
// { latitude: 33.108997919075314, longitude: -96.66080870122764, reference: "g211" },
// { latitude: 33.108939640217216, longitude: -96.66089755516573, reference: "S2_14" },
// { latitude: 33.108913719398785, longitude: -96.66093707493107, reference: "g213" },
// { latitude: 33.10888563793986, longitude: -96.66097988888274, reference: "g214" },
// { latitude: 33.10886781305446, longitude: -96.66100706531199, reference: "g215" },
// { latitude: 33.10881966352259, longitude: -96.66108047573326, reference: "flycut2" },
// { latitude: 33.10879927752077, longitude: -96.6611115569281, reference: "g218" },
// { latitude: 33.10875741909612, longitude: -96.66117537571238, reference: "g220" },
// { latitude: 33.10872401243574, longitude: -96.66122630864811, reference: "g221" },
// { latitude: 33.10870675304451, longitude: -96.66125262290562, reference: "g222" },
// { latitude: 33.108676619115855, longitude: -96.66129856612275, reference: "g223" },
// { latitude: 33.10866040824057, longitude: -96.66132328177704, reference: "g224" },
// { latitude: 33.10862874277224, longitude: -96.66137156003188, reference: "g225" },
// { latitude: 33.108613014886394, longitude: -96.66139553930395, reference: "g226" },
// { latitude: 33.108581705223514, longitude: -96.66144327508565, reference: "g227" },
// { latitude: 33.10853124877592, longitude: -96.66152020270945, reference: "g228" },
// { latitude: 33.10851308693722, longitude: -96.66154789286921, reference: "BLCg" },
// { latitude: 33.10834535768775, longitude: -96.6613946199867, reference: "BRCg" },
// { latitude: 33.1083641486784, longitude: -96.66136620875649, reference: "g236" },
// { latitude: 33.10841559016205, longitude: -96.66128790580876, reference: "g237" },
// { latitude: 33.10844641688495, longitude: -96.66124098213743, reference: "g238" },
// { latitude: 33.10845990162788, longitude: -96.66122045599695, reference: "g239" },
// { latitude: 33.108540663924636, longitude: -96.66109752163636, reference: "g243" },
// { latitude: 33.10855681123405, longitude: -96.66107294260334, reference: "g244" },
// { latitude: 33.1085905548391, longitude: -96.66102157892652, reference: "g245" },
// { latitude: 33.10863610550598, longitude: -96.66095224283366, reference: "g247" },
// { latitude: 33.1086879026525, longitude: -96.66087339850478, reference: "g252" },
// { latitude: 33.1087003388336, longitude: -96.66085446845904, reference: "g253" },
// { latitude: 33.108717534638245, longitude: -96.66082829343264, reference: "g254" },
// { latitude: 33.108768893385836, longitude: -96.6607501164237, reference: "S2_15" },
// { latitude: 33.10881251197165, longitude: -96.6606837212966, reference: "g257" },
// { latitude: 33.10882956163746, longitude: -96.66065776871913, reference: "g258" },
// { latitude: 33.10884283661698, longitude: -96.66063756187529, reference: "g259" },
// { latitude: 33.10892506649267, longitude: -96.6605136299307, reference: "g261" },
// { latitude: 33.10896469384106, longitude: -96.6605499311982, reference: "g262" },
// { latitude: 33.10900017535599, longitude: -96.66058231936353, reference: "gmid" },
// { latitude: 33.10906944131525, longitude: -96.66047328635425, reference: "gentrance" },

// { latitude: 33.10886097025895, longitude: -96.66028186102025, reference: 'S2_4' },
// { latitude: 33.108630171211225, longitude: -96.66006993335228, reference: '2hentrance' },
// { latitude: 33.10867497158879, longitude: -96.65999863931151, reference: "K204" },
// { latitude: 33.10885838458248, longitude: -96.66016301902835, reference: "k entrance" },
// { latitude: 33.10896982964244, longitude: -96.65998494750866, reference: "k mid" },
// { latitude: 33.10900371784144, longitude: -96.6600158792806, reference: "k228" },
// { latitude: 33.10906480802483, longitude: -96.66007105066953, reference: "k222" },
// { latitude: 33.10910242757693, longitude: -96.66001164258827, reference: "k219" },
// { latitude: 33.10911136231943, longitude: -96.65999807723233, reference: "k220" },
// { latitude: 33.10918962651322, longitude: -96.65987925101595, reference: "k218" },
// { latitude: 33.10919885347937, longitude: -96.65986524198547, reference: "k216" },
// { latitude: 33.10921407932416, longitude: -96.65984212503454, reference: "k215" },
// { latitude: 33.109282569888094, longitude: -96.659738137832, reference: "k214" },
// { latitude: 33.10929611809012, longitude: -96.65971756799658, reference: "TLCK" },
// { latitude: 33.10912819010214, longitude: -96.6595629196543, reference: "TRCK" },
// { latitude: 33.10904976079582, longitude: -96.65968562007973, reference: "k211" },
// { latitude: 33.10904976079582, longitude: -96.65968562007973, reference: "k212" },
// { latitude: 33.10903424268949, longitude: -96.65970897630184, reference: "k210" },
// { latitude: 33.10900433751869, longitude: -96.6597539864208, reference: "k205" },
// { latitude: 33.108991755264015, longitude: -96.65977292390768, reference: "k208" },
// { latitude: 33.10894230292743, longitude: -96.65984735436545, reference: "k206" },
// { latitude: 33.10889616795223, longitude: -96.65991874948926, reference: "BRC" },
// { latitude: 33.108935522021554, longitude: -96.65995429069316, reference: "K202" },
// { latitude: 33.10896982964244, longitude: -96.65998494750866, reference: "k mid" },
// { latitude: 33.10885838458248, longitude: -96.66016301902835, reference: "k entrance" },
// { latitude: 33.10890844171046, longitude: -96.66020960345315, reference: "hallpt2" },
// { latitude: 33.10897834089072, longitude: -96.660272764514, reference: "k226" },
// { latitude: 33.109116115103, longitude: -96.66039979772553, reference: "midgentlate" },
// { latitude: 33.109362496538076, longitude: -96.66062614994448, reference: "a entrance" },
// { latitude: 33.10943150607069, longitude: -96.66052024554845, reference: "a mid" },
// { latitude: 33.109506502881715, longitude: -96.66058874684992, reference: "a232" },
// { latitude: 33.10953758611639, longitude: -96.66054173865825, reference: "a230" },
// { latitude: 33.109589517655046, longitude: -96.66046197402315, reference: "a228" },
// { latitude: 33.10960342726715, longitude: -96.66044060945043, reference: "a226" },
// { latitude: 33.10961833666596, longitude: -96.66041770924784, reference: "a225" },
// { latitude: 33.10968408571622, longitude: -96.66031672150248, reference: "a224" },
// { latitude: 33.109697871058806, longitude: -96.66029554780245, reference: "a222" },
// { latitude: 33.10972692243588, longitude: -96.6602509261226, reference: "a221" },
// { latitude: 33.1097488297521, longitude: -96.66021727741645, reference: "TRCA" },
// { latitude: 33.10958652121709, longitude: -96.66006582712545, reference: "TLCA" },
// { latitude: 33.10956269539189, longitude: -96.66010141735043, reference: "A215" },
// { latitude: 33.10953360886999, longitude: -96.66014555950275, reference: "A216" },
// { latitude: 33.10951751328456, longitude: -96.6601699864104, reference: "a214" },
// { latitude: 33.10945247454838, longitude: -96.66026869019527, reference: "a209" },
// { latitude: 33.10943785159766, longitude: -96.66029088220984, reference: "a212" },
// { latitude: 33.1094241904692, longitude: -96.66031161454819, reference: "a210" },
// { latitude: 33.109372366980466, longitude: -96.66039026267057, reference: "a208" },
// { latitude: 33.10934287253986, longitude: -96.66043779561238, reference: "a206" },
// { latitude: 33.10938086656869, longitude: -96.66047284562576, reference: "a204" },
// { latitude: 33.10943150607069, longitude: -96.66052024554845, reference: "a mid" },
// { latitude: 33.109362496538076, longitude: -96.66062614994448, reference: "a entrance" },
// { latitude: 33.10956921622493, longitude: -96.66081717996883, reference: "mid somewhere" },
// { latitude: 33.11001916668614, longitude: -96.66122943705936, reference: "starttop" },
// { latitude: 33.10999358063734, longitude: -96.6612672276186, reference: "S2_9" },
// { latitude: 33.109971381724904, longitude: -96.66130147923262, reference: "startofitall" }



// ];

const firstFloorCoordinates = [

  { latitude: 33.11012705174, longitude: -96.66134610000, reference: 'mainhall1' },
  { latitude: 33.11005377415, longitude: -96.66127730000, reference: 'mainhall2' },
  { latitude: 33.11001053185, longitude: -96.66123670000, reference: 'mainhall3' },
  { latitude: 33.10978398907, longitude: -96.66102400000, reference: 'mainhall4' },
  { latitude: 33.10958417983, longitude: -96.66083640000, reference: 'mainhall5' },
  { latitude: 33.10957086632, longitude: -96.66082390000, reference: 'f entrance' },
  { latitude: 33.10947149, longitude: -96.6609794, reference: 'f mid front' },
  { latitude: 33.1095631, longitude: -96.66106426, reference: 'TLF' },
  { latitude:33.1092741, longitude:-96.6614961, reference: 'midhallcut1' },
  { latitude:33.1091114, longitude:-96.6613463, reference: 'midhallcut12' },
  { latitude:33.1092741, longitude:-96.6614961, reference: 'midhallcut13' },
  { latitude: 33.10932480, longitude: -96.66141863, reference: 'S1_8' },
  { latitude: 33.10909989, longitude: -96.66136452, reference: 'S1_7' },
  { latitude: 33.1094010, longitude: -96.6609141, reference: 'TRF' },
  { latitude: 33.10947149, longitude: -96.6609794, reference: 'f mid front' },
  { latitude: 33.10957086632, longitude: -96.66082390000, reference: 'f entrance' },
  { latitude: 33.10937095057, longitude: -96.66063620000, reference: 'a entrance' },
  { latitude: 33.10946603787324, longitude:  -96.66049207061944, reference: 'amidfront' },
  { latitude: 33.10953135976243, longitude: -96.66055364224918, reference: 'A1' },
  { latitude: 33.10972164366, longitude: -96.66027005533, reference: 'S1_2' },
  { latitude: 33.10937095057, longitude: -96.66063620000, reference: 'a entrance' },
  { latitude: 33.10913120078, longitude: -96.66041110000, reference: 'g entrance' },
  { latitude: 33.10885800744, longitude: -96.66015460000, reference: 'k entrance' },


  { latitude: 33.10909306, longitude: -96.66064912, reference: 'G104' },
  { latitude: 33.10910748, longitude: -96.66071285, reference: 'G106' },
  { latitude: 33.10904206, longitude: -96.66081715, reference: 'G109' },
  { latitude: 33.10903556, longitude: -96.66085481, reference: 'G110' },
  { latitude: 33.10890471, longitude: -96.66104311, reference: 'G115' },
  { latitude: 33.10886083, longitude: -96.66111844, reference: 'G117' },
  { latitude: 33.10883807, longitude: -96.66114789, reference: 'G118' },
  { latitude: 33.10876330, longitude: -96.66125556, reference: 'G122' },
  { latitude: 33.10874583, longitude: -96.66128502, reference: 'G123' },
  { latitude: 33.10867187, longitude: -96.66140138, reference: 'G126' },
  { latitude: 33.10864505, longitude: -96.66143421, reference: 'G127' },
  { latitude: 33.10857963, longitude: -96.66155251, reference: 'G128' },
  { latitude: 33.10900955, longitude: -96.66071189, reference: 'G108' },
  { latitude: 33.10887830, longitude: -96.66090502, reference: 'G114' },
  { latitude: 33.10871535, longitude: -96.66114596, reference: 'G121' },
  { latitude: 33.10861092, longitude: -96.66131785, reference: 'G125' },
  { latitude: 33.10845122, longitude: -96.66131399, reference: 'G139' },
  { latitude: 33.10862799, longitude: -96.66106677, reference: 'G145' },
  { latitude: 33.10878321, longitude: -96.66082777, reference: 'G154' },
  { latitude: 33.10891772, longitude: -96.66063270, reference: 'G160' },
  { latitude: 33.10889415, longitude: -96.66046274, reference: 'G165' },
  { latitude: 33.10885717, longitude: -96.66053758, reference: 'G164' },
  { latitude: 33.10880800, longitude: -96.66061387, reference: 'G162' },
  { latitude: 33.10878931, longitude: -96.66062449, reference: 'G161' },
  { latitude: 33.10866740, longitude: -96.66082680, reference: 'G155' },
  { latitude: 33.10864830, longitude: -96.66085191, reference: 'G153' },
  { latitude: 33.10857150, longitude: -96.66096393, reference: 'G148' },
  { latitude: 33.10852640, longitude: -96.66103346, reference: 'G147' },
  { latitude: 33.10849754, longitude: -96.66107257, reference: 'G146' },
  { latitude: 33.10842806, longitude: -96.66118845, reference: 'G142' },
  { latitude: 33.10840449, longitude: -96.66121259, reference: 'G140' },
  { latitude: 33.10833663, longitude: -96.66133378, reference: 'G138' },
  { latitude: 33.10954675, longitude: -96.66106194, reference: 'F105' },
  { latitude: 33.10957195, longitude: -96.66113002, reference: 'F108' },
  { latitude: 33.10950815, longitude: -96.66123287, reference: 'F111' },
  { latitude: 33.10948377, longitude: -96.66126715, reference: 'F112' },
  { latitude: 33.10940737, longitude: -96.66138352, reference: 'F115' },
  { latitude: 33.10938624, longitude: -96.66140959, reference: 'F116' },
  { latitude: 33.10929441, longitude: -96.66154478, reference: 'F120' },
  { latitude: 33.10922695, longitude: -96.66164328, reference: 'F124' },
  { latitude: 33.10919119, longitude: -96.66169640, reference: 'F125' },
  { latitude: 33.10912740, longitude: -96.66182242, reference: 'F129' },
  { latitude: 33.10907051, longitude: -96.66188470, reference: 'F130' },
  { latitude: 33.10902499, longitude: -96.66196051, reference: 'F133' },
  { latitude: 33.10945248, longitude: -96.66112520, reference: 'F110' },
  { latitude: 33.10938259, longitude: -96.66121066, reference: 'F158' },
  { latitude: 33.10936511, longitude: -96.66126715, reference: 'F114' },
  { latitude: 33.10927937, longitude: -96.66139028, reference: 'F117' },
  { latitude: 33.10915909, longitude: -96.66155685, reference: 'F123' },
  { latitude: 33.10910789, longitude: -96.66164425, reference: 'F126' },
  { latitude: 33.10904734, longitude: -96.66174130, reference: 'F128' },
  { latitude: 33.10899533, longitude: -96.66181807, reference: 'F131' },
  { latitude: 33.10940067, longitude: -96.66092868, reference: 'F165' },
  { latitude: 33.10934479, longitude: -96.66087822, reference: 'F164' },
  { latitude: 33.10933951, longitude: -96.66091468, reference: 'F163' },
  { latitude: 33.10926799, longitude: -96.66102042, reference: 'F160' },
  { latitude: 33.10923508, longitude: -96.66104987, reference: 'F159' },
  { latitude: 33.10916925, longitude: -96.66115706, reference: 'F155' },
  { latitude: 33.10905263, longitude: -96.66133958, reference: 'F148' },
  { latitude: 33.10897948, longitude: -96.66145932, reference: 'F146' },
  { latitude: 33.10895916, longitude: -96.66148153, reference: 'F144' },
  { latitude: 33.10891040, longitude: -96.66155927, reference: 'F141' },
  { latitude: 33.10881166, longitude: -96.66170364, reference: 'F137' },
  { latitude: 33.10878646, longitude: -96.66174371, reference: 'F136' },
  { latitude: 33.11011930, longitude: -96.66111940, reference: 'Library' },
  { latitude: 33.10948539, longitude: -96.66059697, reference: 'A134' },
  { latitude: 33.10956829, longitude: -96.66057041, reference: 'A130' },
  { latitude: 33.10962640, longitude: -96.66050378, reference: 'A128' },
  { latitude: 33.10964712, longitude: -96.66047626, reference: 'A126' },
  { latitude: 33.10971701, longitude: -96.66035555, reference: 'A124' },
  { latitude: 33.10974221, longitude: -96.66033817, reference: 'A122' },
  { latitude: 33.10963249, longitude: -96.66031113, reference: 'A121' },
  { latitude: 33.10952156, longitude: -96.66048737, reference: 'A125' },
  { latitude: 33.10934479, longitude: -96.66046854, reference: 'A104' },
  { latitude: 33.10928628, longitude: -96.66041108, reference: 'A106' },
  { latitude: 33.10933951, longitude: -96.66035700, reference: 'A108' },
  { latitude: 33.10938909, longitude: -96.66028892, reference: 'A110' },
  { latitude: 33.10940575, longitude: -96.66026236, reference: 'A112' },
  { latitude: 33.10948255, longitude: -96.66014117, reference: 'A114' },
  { latitude: 33.10949596, longitude: -96.66011655, reference: 'A116' },
  { latitude: 33.10954513, longitude: -96.66023532, reference: 'A115' },
  { latitude: 33.10943460, longitude: -96.66040577, reference: 'A109' },
  { latitude: 33.10900854, longitude: -96.66015566, reference: 'K130' },
  { latitude: 33.10906421, longitude: -96.66020877, reference: 'K128' },
  { latitude: 33.10907843, longitude: -96.66016580, reference: 'K126' },
  { latitude: 33.10913126, longitude: -96.66008854, reference: 'K124' },
  { latitude: 33.10919343, longitude: -96.65998087, reference: 'K122' },
  { latitude: 33.10923569, longitude: -96.65993307, reference: 'K120' },
  { latitude: 33.10932062, longitude: -96.65980415, reference: 'K118' },
  { latitude: 33.10924382, longitude: -96.65972883, reference: 'K117' },
  { latitude: 33.10907599, longitude: -96.65997411, reference: 'K123' },
  { latitude: 33.10881958, longitude: -96.65998376, reference: 'K100' },
  { latitude: 33.10885372, longitude: -96.65990120, reference: 'K106' },
  { latitude: 33.10892767, longitude: -96.65980125, reference: 'K108' },
  { latitude: 33.10904552, longitude: -96.65980125, reference: 'K109' },
  { latitude: 33.10897643, longitude: -96.65972545, reference: 'K110' },
  { latitude: 33.10910159, longitude: -96.65972738, reference: 'K113' },
  { latitude: 33.10907599, longitude: -96.65957335, reference: 'K112' },
  { latitude: 33.10864404, longitude: -96.66017111, reference: 'H100' },
  { latitude: 33.10853554, longitude: -96.66013972, reference: 'H101' },
  { latitude: 33.10851685, longitude: -96.66040963, reference: 'H104' },
  { latitude: 33.10837543, longitude: -96.66059456, reference: 'H113' },
  { latitude: 33.10834983, longitude: -96.66076741, reference: 'H115' },
  { latitude: 33.10832383, longitude: -96.66081377, reference: 'H117' },
  { latitude: 33.10834577, longitude: -96.66024933, reference: 'H123' },
  { latitude: 33.10823240, longitude: -96.66043184, reference: 'H112' },
  { latitude: 33.10834577, longitude: -96.65989589, reference: 'H153' },
  { latitude: 33.10804060, longitude: -96.65972400, reference: 'H136' },
  { latitude: 33.10789106, longitude: -96.65959846, reference: 'H156' },
  { latitude: 33.10789756, longitude: -96.65990458, reference: 'H167' },
  { latitude: 33.10781222, longitude: -96.65982201, reference: 'H172' },

];

const secondFloorCoordinates = [

  { latitude: 33.109971381724904, longitude: -96.66130147923262, reference: '2mainhall' },
  { latitude: 33.10952242109021, longitude: -96.66088922805024, reference: '2fentrance' },
  { latitude: 33.10956921622493, longitude: -96.66081717996883, reference: '2entrance' },
  { latitude: 33.10945468699747, longitude: -96.66099546935033, reference: '2f mid front' },
  { latitude: 33.10930855790873, longitude: -96.66144259164321, reference: 'S2_8' },
  { latitude: 33.10925549614271, longitude: -96.66152345566115, reference: 'midcut1' },
  { latitude: 33.10896764835255, longitude: -96.66196212422827, reference: 'BLC' },
  { latitude: 33.10880219053123, longitude: -96.661809713627, reference: 'BRC' },
  { latitude: 33.10909147837973, longitude: -96.66136975085195, reference: 'midcut2' },
  { latitude: 33.10910835955181, longitude: -96.66134407715927, reference: 'fly1' },
  { latitude: 33.10914197576989, longitude: -96.66129295200946, reference: 'S2_10' },
  { latitude: 33.109379913609914, longitude: -96.66093108477955, reference: 'TRC' },
  { latitude: 33.10945468699747, longitude: -96.66099546935033, reference: '2f mid front' },
  { latitude: 33.10952242109021, longitude: -96.66088922805024, reference: '2fentrance' },
  { latitude: 33.10931541294438, longitude: -96.66069914601121, reference: 'S2_3' },
  { latitude: 33.10906944131525, longitude: -96.66047328635425, reference: "gentrance" },
  { latitude: 33.10900017535599, longitude: -96.66058231936353, reference: "gmid" },
  { latitude: 33.108939640217216, longitude: -96.66089755516573, reference: "S2_14" },
  { latitude: 33.10881966352259, longitude: -96.66108047573326, reference: "flycut2" },
  { latitude: 33.10851308693722, longitude: -96.66154789286921, reference: "BLCg" },
  { latitude: 33.10834535768775, longitude: -96.6613946199867, reference: "BRCg" },
  { latitude: 33.108768893385836, longitude: -96.6607501164237, reference: "S2_15" },
  { latitude: 33.10900017535599, longitude: -96.66058231936353, reference: "gmid" },
  { latitude: 33.10906944131525, longitude: -96.66047328635425, reference: "gentrance" },
  { latitude: 33.10886097025895, longitude: -96.66028186102025, reference: 'S2_4' },
  { latitude: 33.108630171211225, longitude: -96.66006993335228, reference: '2hentrance' },
  { latitude: 33.10885838458248, longitude: -96.66016301902835, reference: "k entrance" },
  { latitude: 33.10896982964244, longitude: -96.65998494750866, reference: "k mid" },
  { latitude: 33.10929611809012, longitude: -96.65971756799658, reference: "TLCK" },
  { latitude: 33.10912819010214, longitude: -96.6595629196543, reference: "TRCK" },
  { latitude: 33.10889616795223, longitude: -96.65991874948926, reference: "BRC" },
  { latitude: 33.10896982964244, longitude: -96.65998494750866, reference: "k mid" },
  { latitude: 33.10885838458248, longitude: -96.66016301902835, reference: "k entrance" },
  { latitude: 33.10890844171046, longitude: -96.66020960345315, reference: "hallpt2" },
  { latitude: 33.109116115103, longitude: -96.66039979772553, reference: "midgentlate" },
  { latitude: 33.109362496538076, longitude: -96.66062614994448, reference: "a entrance" },
  { latitude: 33.10943150607069, longitude: -96.66052024554845, reference: "a mid" },
  { latitude: 33.1097488297521, longitude: -96.66021727741645, reference: "TRCA" },
  { latitude: 33.10958652121709, longitude: -96.66006582712545, reference: "TLCA" },
  { latitude: 33.10943150607069, longitude: -96.66052024554845, reference: "a mid" },
  { latitude: 33.109362496538076, longitude: -96.66062614994448, reference: "a entrance" },
  { latitude: 33.10956921622493, longitude: -96.66081717996883, reference: "mid somewhere" },
  { latitude: 33.11001916668614, longitude: -96.66122943705936, reference: "starttop" },
  { latitude: 33.10999358063734, longitude: -96.6612672276186, reference: "S2_9" },
  { latitude: 33.109971381724904, longitude: -96.66130147923262, reference: "startofitall" },


  { latitude: 33.10958534, longitude: -96.66109439, reference: 'F207' },
  { latitude: 33.10956719, longitude: -96.66110143, reference: 'F208' },
  { latitude: 33.10950093, longitude: -96.66123634, reference: 'F210' },
  { latitude: 33.10943285, longitude: -96.66116916, reference: 'F212' },
  { latitude: 33.10948414, longitude: -96.66126235, reference: 'F213' },
  { latitude: 33.10940335, longitude: -96.66137938, reference: 'F216' },
  { latitude: 33.10936387, longitude: -96.66130786, reference: 'F215' },
  { latitude: 33.10938316, longitude: -96.66140918, reference: 'F217' },
  { latitude: 33.10931145, longitude: -96.66153651, reference: 'F219' },
  { latitude: 33.10920661, longitude: -96.66142977, reference: 'F220' },
  { latitude: 33.10925835, longitude: -96.66160694, reference: 'F222' },
  { latitude: 33.10917439, longitude: -96.66157714, reference: 'F223' },
  { latitude: 33.10923657, longitude: -96.66164054, reference: 'F224' },
  { latitude: 33.10916259, longitude: -96.66174781, reference: 'F226' },
  { latitude: 33.10914897, longitude: -96.66177545, reference: 'F227' },
  { latitude: 33.10907681, longitude: -96.66173319, reference: 'F228' },
  { latitude: 33.10907545, longitude: -96.66188598, reference: 'F229' },
  { latitude: 33.10904278, longitude: -96.66192390, reference: 'F230' },
  { latitude: 33.10931644, longitude: -96.66095297, reference: 'F255' },
  { latitude: 33.10937226, longitude: -96.66104020, reference: 'F252' },
  { latitude: 33.10926879, longitude: -96.66102774, reference: 'F254' },
  { latitude: 33.10924337, longitude: -96.66105646, reference: 'F253' },
  { latitude: 33.10917893, longitude: -96.66116807, reference: 'F250' },
  { latitude: 33.10925245, longitude: -96.66120763, reference: 'F248' },
  { latitude: 33.10914943, longitude: -96.66119896, reference: 'F249' },
  { latitude: 33.10914398, longitude: -96.66135446, reference: 'F245' },
  { latitude: 33.10903052, longitude: -96.66138534, reference: 'F243' },
  { latitude: 33.10907954, longitude: -96.66148720, reference: 'F241' },
  { latitude: 33.10899966, longitude: -96.66141731, reference: 'F242' },
  { latitude: 33.10893340, longitude: -96.66152838, reference: 'F239' },
  { latitude: 33.10890889, longitude: -96.66156197, reference: 'F238' },
  { latitude: 33.10897606, longitude: -96.66163783, reference: 'F236' },
  { latitude: 33.10881132, longitude: -96.66170664, reference: 'F234' },
  { latitude: 33.10882947, longitude: -96.66109005, reference: 'skybridgeG' },
  { latitude: 33.10909270, longitude: -96.66132953, reference: 'skybridgeF' },
  { latitude: 33.10908544, longitude: -96.66060025, reference: 'G205' },
  { latitude: 33.10913354, longitude: -96.66068152, reference: 'G206' },
  { latitude: 33.10910087, longitude: -96.66072595, reference: 'G207' },
  { latitude: 33.10905095, longitude: -96.66081806, reference: 'G210' },
  { latitude: 33.10900465, longitude: -96.66071078, reference: 'G209' },
  { latitude: 33.10903098, longitude: -96.66086249, reference: 'G211' },
  { latitude: 33.10891298, longitude: -96.66100770, reference: 'G214' },
  { latitude: 33.10889392, longitude: -96.66103695, reference: 'G215' },
  { latitude: 33.10888484, longitude: -96.66091342, reference: 'G213' },
  { latitude: 33.10883038, longitude: -96.66115399, reference: 'G218' },
  { latitude: 33.10872055, longitude: -96.66115940, reference: 'G220' },
  { latitude: 33.10876502, longitude: -96.66124284, reference: 'G221' },
  { latitude: 33.10873416, longitude: -96.66128944, reference: 'G222' },
  { latitude: 33.10865066, longitude: -96.66126668, reference: 'G223' },
  { latitude: 33.10862343, longitude: -96.66129702, reference: 'G224' },
  { latitude: 33.10866699, longitude: -96.66139780, reference: 'G225' },
  { latitude: 33.10854809, longitude: -96.66140972, reference: 'G227' },
  { latitude: 33.10864249, longitude: -96.66143898, reference: 'G226' },
  { latitude: 33.10856624, longitude: -96.66154084, reference: 'G228' },
  { latitude: 33.10898287, longitude: -96.66051573, reference: 'G262' },
  { latitude: 33.10888665, longitude: -96.66049947, reference: 'G261' },
  { latitude: 33.10881404, longitude: -96.66061000, reference: 'G259' },
  { latitude: 33.10890481, longitude: -96.66062734, reference: 'G257' },
  { latitude: 33.10878862, longitude: -96.66063709, reference: 'G258' },
  { latitude: 33.10878590, longitude: -96.66081373, reference: 'G252' },
  { latitude: 33.10868969, longitude: -96.66079747, reference: 'G254' },
  { latitude: 33.10866155, longitude: -96.66083431, reference: 'G253' },
  { latitude: 33.10859983, longitude: -96.66093184, reference: 'G247' },
  { latitude: 33.10862161, longitude: -96.66105754, reference: 'G245' },
  { latitude: 33.10852903, longitude: -96.66103587, reference: 'G244' },
  { latitude: 33.10849907, longitude: -96.66107705, reference: 'G243' },
  { latitude: 33.10843735, longitude: -96.66118649, reference: 'G239' },
  { latitude: 33.10851360, longitude: -96.66122550, reference: 'G237' },
  { latitude: 33.10840467, longitude: -96.66122442, reference: 'G238' },
  { latitude: 33.10833932, longitude: -96.66132412, reference: 'G236' },
  { latitude: 33.11017465, longitude: -96.66132737, reference: 'B205' },
  { latitude: 33.11016920, longitude: -96.66123092, reference: 'B207' },
  { latitude: 33.11023546, longitude: -96.66106730, reference: 'B209' },
  { latitude: 33.11014288, longitude: -96.66109330, reference: 'B206' },
  { latitude: 33.11005030, longitude: -96.66121900, reference: 'B204' },
  { latitude: 33.10996044, longitude: -96.66112256, reference: 'B203' },
  { latitude: 33.10989781, longitude: -96.66100228, reference: 'B202' },
  { latitude: 33.10993775, longitude: -96.66094810, reference: 'B201' },
  { latitude: 33.11001581, longitude: -96.66081914, reference: 'B200' },
  { latitude: 33.10985061, longitude: -96.66067394, reference: 'A254' },
  { latitude: 33.10981884, longitude: -96.66080506, reference: 'A251' },
  { latitude: 33.10976529, longitude: -96.66087874, reference: 'A253' },
  { latitude: 33.10966454, longitude: -96.66078989, reference: 'A239' },
  { latitude: 33.10976075, longitude: -96.66068911, reference: 'A241' },
  { latitude: 33.10974350, longitude: -96.66056124, reference: 'A250' },
  { latitude: 33.10968632, longitude: -96.66057316, reference: 'A248' },
  { latitude: 33.10951659, longitude: -96.66063818, reference: 'A232' },
  { latitude: 33.10956288, longitude: -96.66057858, reference: 'A230' },
  { latitude: 33.10961915, longitude: -96.66049622, reference: 'A228' },
  { latitude: 33.10964184, longitude: -96.66048105, reference: 'A226' },
  { latitude: 33.10971446, longitude: -96.66035535, reference: 'A224' },
  { latitude: 33.10973080, longitude: -96.66033585, reference: 'A222' },
  { latitude: 33.10952339, longitude: -96.66047888, reference: 'A225' },
  { latitude: 33.10963322, longitude: -96.66031526, reference: 'A221' },
  { latitude: 33.10934912, longitude: -96.66051139, reference: 'A204' },
  { latitude: 33.10928921, longitude: -96.66042362, reference: 'A206' },
  { latitude: 33.10933006, longitude: -96.66035860, reference: 'A208' },
  { latitude: 33.10942536, longitude: -96.66040736, reference: 'A209' },
  { latitude: 33.10938996, longitude: -96.66028383, reference: 'A210' },
  { latitude: 33.10940903, longitude: -96.66025891, reference: 'A212' },
  { latitude: 33.10948436, longitude: -96.66013754, reference: 'A214' },
  { latitude: 33.10953519, longitude: -96.66023507, reference: 'A215' },
  { latitude: 33.10949798, longitude: -96.66011478, reference: 'A216' },
  { latitude: 33.10900783, longitude: -96.66025349, reference: 'K226' },
  { latitude: 33.10891706, longitude: -96.66015380, reference: 'K228' },
  { latitude: 33.10890072, longitude: -96.65999667, reference: 'K202' },
  { latitude: 33.10881722, longitude: -96.65991648, reference: 'K204' },
  { latitude: 33.10891071, longitude: -96.65982871, reference: 'K206' },
  { latitude: 33.10895609, longitude: -96.65975719, reference: 'K208' },
  { latitude: 33.10900238, longitude: -96.65968783, reference: 'K210' },
  { latitude: 33.10901781, longitude: -96.65966074, reference: 'K212' },
  { latitude: 33.10883537, longitude: -96.65962607, reference: 'K240' },
  { latitude: 33.10881177, longitude: -96.65970192, reference: 'K238' },
  { latitude: 33.10898332, longitude: -96.65989264, reference: 'K205' },
  { latitude: 33.10909633, longitude: -96.65973010, reference: 'K211' },
  { latitude: 33.10918256, longitude: -96.65981245, reference: 'K215' },
  { latitude: 33.10907364, longitude: -96.65998150, reference: 'K219' },
  { latitude: 33.10911448, longitude: -96.66009094, reference: 'K222' },
  { latitude: 33.10916531, longitude: -96.66003785, reference: 'K220' },
  { latitude: 33.10923067, longitude: -96.65994140, reference: 'K218' },
  { latitude: 33.10925064, longitude: -96.65990348, reference: 'K216' },
  { latitude: 33.10931599, longitude: -96.65978861, reference: 'K214' },
  { latitude: 33.10856942, longitude: -96.66009582, reference: 'H203' },
  { latitude: 33.10849272, longitude: -96.66021394, reference: 'H204' },
  { latitude: 33.10841602, longitude: -96.66028817, reference: 'H206' },
  { latitude: 33.10851496, longitude: -96.66033097, reference: 'H205' },
  { latitude: 33.10845187, longitude: -96.66036077, reference: 'H208' },
  
];


const firstFloorStaircases = firstFloorCoordinates.filter(coord => coord.reference.startsWith('S1'));
const secondFloorStaircases = secondFloorCoordinates.filter(coord => coord.reference.startsWith('S2'));




// const roomCoordinates = {
// F108: { latitude: 33.10959167, longitude: -96.6611234 },
// F111: { latitude: 33.10953419, longitude: -96.66120964 },
// F110: { latitude: 33.10946790, longitude: -96.66108344 },
// F112: { latitude: 33.10950205, longitude: -96.66126420 },
// F114: { latitude: 33.10937894, longitude: -96.66123695 },
// F115: { latitude: 33.10943479, longitude: -96.66136275 },
// F116: { latitude: 33.10941588, longitude: -96.66139435 },
// F117: { latitude: 33.10930108, longitude: -96.66136090 },
// F120: { latitude: 33.10932997, longitude: -96.66152640 },
// F119: { latitude: 33.10929958, longitude: -96.66139901 },
// F123: { latitude: 33.10919474, longitude: -96.66153375 },
// F124: { latitude: 33.10925905, longitude: -96.66161894 },
// F125: { latitude: 33.10921808, longitude: -96.66167626 },
// F126: { latitude: 33.10913219, longitude: -96.66161789 },
// F128: { latitude: 33.10907955, longitude: -96.66171981 },
// F129: { latitude: 33.10913878, longitude: -96.66180036 },
// F130: { latitude: 33.10908186, longitude: -96.66186708 },
// F131: { latitude: 33.10901877, longitude: -96.66180897 },
// F133: { latitude: 33.10903478, longitude: -96.66193809 },

// F136: { latitude: 33.10880684, longitude: -96.66172540 },
// F137: { latitude: 33.10883337, longitude: -96.66168656 },
// F138: { latitude: 33.10891935, longitude: -96.66171985 },
// F139: { latitude: 33.10886242, longitude: -96.66165558 },
// F140: { latitude: 33.10899026, longitude: -96.66160587 },
// F141: { latitude: 33.10893572, longitude: -96.66154236 },
// F144: { latitude: 33.10898758, longitude: -96.66146447 },
// F145: { latitude: 33.10904345, longitude: -96.66151760 },
// F146: { latitude: 33.10900063, longitude: -96.66143651 },
// // F148: { latitude: 33.10908299, longitude: -96.66131832 },
// F149: { latitude: 33.10915934, longitude: -96.66133285 },
// F153: { latitude: 33.10920637, longitude: -96.66127296 },
// F154: { latitude: 33.10916137, longitude: -96.66119282 },
// F155: { latitude: 33.10919531, longitude: -96.66113909 },
// F156: { latitude: 33.10928420, longitude: -96.66114966 },
// F158: { latitude: 33.10937162, longitude: -96.66111840 },
// F160: { latitude: 33.10929493, longitude: -96.66100196 },
// F161: { latitude: 33.10938663, longitude: -96.66101313 },
// F163: { latitude: 33.10935875, longitude: -96.66088543 },
// F164: { latitude: 33.10939019, longitude: -96.66085111 },
// A134: { latitude: 33.10948601, longitude: -96.66057225 },
// A130: { latitude: 33.10959816, longitude: -96.66054371 },
// A125: { latitude: 33.10960490, longitude: -96.66036520 },
// A128: { latitude: 33.10964351, longitude: -96.66047714 },
// A126: { latitude: 33.10965822, longitude: -96.66044275 },
// A121: { latitude: 33.10965515, longitude: -96.66028765 },
// A124: { latitude: 33.10973972, longitude: -96.66032496 },
// A122: { latitude: 33.10975995, longitude: -96.66030228 },
// A104: { latitude: 33.10937961, longitude: -96.66045985 },
// A106: { latitude: 33.10932474, longitude: -96.66040581 },
// A108: { latitude: 33.10936681, longitude: -96.66032719 },
// A110: { latitude: 33.10941482, longitude: -96.66025949 },
// A112: { latitude: 33.10943266, longitude: -96.66023274 },
// A109: { latitude: 33.10950628, longitude: -96.66026768 },
// A115: { latitude: 33.10956253, longitude: -96.66020162 },
// A114: { latitude: 33.10951497, longitude: -96.66011318 },
// A116: { latitude: 33.10952823, longitude: -96.66009189 },
// A116: { latitude: 33.10952823, longitude: -96.66009189 },
// f207: { latitude: 33.10960813, longitude: -96.66110251 },
// f208: { latitude: 33.10957188, longitude: -96.66112951 },
// f212: { latitude: 33.10941840, longitude: -96.66118890 },
// f210: { latitude: 33.10950247, longitude: -96.66123517 },
// f213: { latitude: 33.10948242, longitude: -96.66126140 },
// f216: { latitude: 33.10940683, longitude: -96.66138557 },
// f217: { latitude: 33.10938524, longitude: -96.66140562 },
// f215: { latitude: 33.10928574, longitude: -96.66138171 },
// f222: { latitude: 33.10926029, longitude: -96.66159535 },
// f224: { latitude: 33.10923870, longitude: -96.66162543 },
// f223: { latitude: 33.10911221, longitude: -96.66165783 },
// f226: { latitude: 33.10916234, longitude: -96.66174575 },
// f227: { latitude: 33.10914460, longitude: -96.66176889 },
// f228: { latitude: 33.10899883, longitude: -96.66182519 },
// f229: { latitude: 33.10907133, longitude: -96.66189075 },
// F230: { latitude: 33.10905128, longitude: -96.66191466 }
// };

const roomCoordinates = {
  F207: { latitude: 33.10958534, longitude: -96.66109439 },
  F208: { latitude: 33.10956719, longitude: -96.66110143 },
  F210: { latitude: 33.10950093, longitude: -96.66123634 },
  F212: { latitude: 33.10943285, longitude: -96.66116916 },
  F213: { latitude: 33.10948414, longitude: -96.66126235 },
  F216: { latitude: 33.10940335, longitude: -96.66137938 },
  F215: { latitude: 33.10936387, longitude: -96.66130786 },
  F217: { latitude: 33.10938316, longitude: -96.66140918 },
  F219: { latitude: 33.10931145, longitude: -96.66153651 },
  F220: { latitude: 33.10920661, longitude: -96.66142977 },
  F222: { latitude: 33.10925835, longitude: -96.66160694 },
  F223: { latitude: 33.10917439, longitude: -96.66157714 },
  F224: { latitude: 33.10923657, longitude: -96.66164054 },
  F226: { latitude: 33.10916259, longitude: -96.66174781 },
  F227: { latitude: 33.10914897, longitude: -96.66177545 },
  F228: { latitude: 33.10907681, longitude: -96.66173319 },
  F229: { latitude: 33.10907545, longitude: -96.66188598 },
  F230: { latitude: 33.10904278, longitude: -96.66192390 },
  F255: { latitude: 33.10931644, longitude: -96.66095297 },
  F252: { latitude: 33.10937226, longitude: -96.66104020 },
  F254: { latitude: 33.10926879, longitude: -96.66102774 },
  F253: { latitude: 33.10924337, longitude: -96.66105646 },
  F250: { latitude: 33.10917893, longitude: -96.66116807 },
  F248: { latitude: 33.10925245, longitude: -96.66120763 },
  F249: { latitude: 33.10914943, longitude: -96.66119896 },
  F245: { latitude: 33.10914398, longitude: -96.66135446 },
  F243: { latitude: 33.10903052, longitude: -96.66138534 },
  F241: { latitude: 33.10907954, longitude: -96.66148720 },
  F242: { latitude: 33.10899966, longitude: -96.66141731 },
  F239: { latitude: 33.10893340, longitude: -96.66152838 },
  F238: { latitude: 33.10890889, longitude: -96.66156197 },
  F236: { latitude: 33.10897606, longitude: -96.66163783 },
  F234: { latitude: 33.10881132, longitude: -96.66170664 },
  skybridgeG: { latitude: 33.10882947, longitude: -96.66109005 },
  skybridgeF: { latitude: 33.10909270, longitude: -96.66132953 },
  G205: { latitude: 33.10908544, longitude: -96.66060025 },
  G206: { latitude: 33.10913354, longitude: -96.66068152 },
  G207: { latitude: 33.10910087, longitude: -96.66072595 },
  G210: { latitude: 33.10905095, longitude: -96.66081806 },
  G209: { latitude: 33.10900465, longitude: -96.66071078 },
  G211: { latitude: 33.10903098, longitude: -96.66086249 },
  G214: { latitude: 33.10891298, longitude: -96.66100770 },
  G215: { latitude: 33.10889392, longitude: -96.66103695 },
  G213: { latitude: 33.10888484, longitude: -96.66091342 },
  G218: { latitude: 33.10883038, longitude: -96.66115399 },
  G220: { latitude: 33.10872055, longitude: -96.66115940 },
  G221: { latitude: 33.10876502, longitude: -96.66124284 },
  G222: { latitude: 33.10873416, longitude: -96.66128944 },
  G223: { latitude: 33.10865066, longitude: -96.66126668 },
  G224: { latitude: 33.10862343, longitude: -96.66129702 },
  G225: { latitude: 33.10866699, longitude: -96.66139780 },
  G227: { latitude: 33.10854809, longitude: -96.66140972 },
  G226: { latitude: 33.10864249, longitude: -96.66143898 },
  G228: { latitude: 33.10856624, longitude: -96.66154084 },
  G262: { latitude: 33.10898287, longitude: -96.66051573 },
  G261: { latitude: 33.10888665, longitude: -96.66049947 },
  G259: { latitude: 33.10881404, longitude: -96.66061000 },
  G257: { latitude: 33.10890481, longitude: -96.66062734 },
  G258: { latitude: 33.10878862, longitude: -96.66063709 },
  G252: { latitude: 33.10878590, longitude: -96.66081373 },
  G254: { latitude: 33.10868969, longitude: -96.66079747 },
  G253: { latitude: 33.10866155, longitude: -96.66083431 },
  G247: { latitude: 33.10859983, longitude: -96.66093184 },
  G245: { latitude: 33.10862161, longitude: -96.66105754 },
  G244: { latitude: 33.10852903, longitude: -96.66103587 },
  G243: { latitude: 33.10849907, longitude: -96.66107705 },
  G239: { latitude: 33.10843735, longitude: -96.66118649 },
  G237: { latitude: 33.10851360, longitude: -96.66122550 },
  G238: { latitude: 33.10840467, longitude: -96.66122442 },
  G236: { latitude: 33.10833932, longitude: -96.66132412 },
  B205: { latitude: 33.11017465, longitude: -96.66132737 },
  B207: { latitude: 33.11016920, longitude: -96.66123092 },
  B209: { latitude: 33.11023546, longitude: -96.66106730 },
  B206: { latitude: 33.11014288, longitude: -96.66109330 },
  B204: { latitude: 33.11005030, longitude: -96.66121900 },
  B203: { latitude: 33.10996044, longitude: -96.66112256 },
  B202: { latitude: 33.10989781, longitude: -96.66100228 },
  B201: { latitude: 33.10993775, longitude: -96.66094810 },
  B200: { latitude: 33.11001581, longitude: -96.66081914 },
  A254: { latitude: 33.10985061, longitude: -96.66067394 },
  A251: { latitude: 33.10981884, longitude: -96.66080506 },
  A253: { latitude: 33.10976529, longitude: -96.66087874 },
  A239: { latitude: 33.10966454, longitude: -96.66078989 },
  A241: { latitude: 33.10976075, longitude: -96.66068911 },
  A250: { latitude: 33.10974350, longitude: -96.66056124 },
  A248: { latitude: 33.10968632, longitude: -96.66057316 },
  A232: { latitude: 33.10951659, longitude: -96.66063818 },
  A230: { latitude: 33.10956288, longitude: -96.66057858 },
  A228: { latitude: 33.10961915, longitude: -96.66049622 },
  A226: { latitude: 33.10964184, longitude: -96.66048105 },
  A224: { latitude: 33.10971446, longitude: -96.66035535 },
  A222: { latitude: 33.10973080, longitude: -96.66033585 },
  A225: { latitude: 33.10952339, longitude: -96.66047888 },
  A221: { latitude: 33.10963322, longitude: -96.66031526 },
  A204: { latitude: 33.10934912, longitude: -96.66051139 },
  A206: { latitude: 33.10928921, longitude: -96.66042362 },
  A208: { latitude: 33.10933006, longitude: -96.66035860 },
  A209: { latitude: 33.10942536, longitude: -96.66040736 },
  A210: { latitude: 33.10938996, longitude: -96.66028383 },
  A212: { latitude: 33.10940903, longitude: -96.66025891 },
  A214: { latitude: 33.10948436, longitude: -96.66013754 },
  A215: { latitude: 33.10953519, longitude: -96.66023507 },
  A216: { latitude: 33.10949798, longitude: -96.66011478 },
  K226: { latitude: 33.10900783, longitude: -96.66025349 },
  K228: { latitude: 33.10891706, longitude: -96.66015380 },
  K202: { latitude: 33.10890072, longitude: -96.65999667 },
  K204: { latitude: 33.10881722, longitude: -96.65991648 },
  K206: { latitude: 33.10891071, longitude: -96.65982871 },
  K208: { latitude: 33.10895609, longitude: -96.65975719 },
  K210: { latitude: 33.10900238, longitude: -96.65968783 },
  K212: { latitude: 33.10901781, longitude: -96.65966074 },
  K240: { latitude: 33.10883537, longitude: -96.65962607 },
  K238: { latitude: 33.10881177, longitude: -96.65970192 },
  K205: { latitude: 33.10898332, longitude: -96.65989264 },
  K211: { latitude: 33.10909633, longitude: -96.65973010 },
  K215: { latitude: 33.10918256, longitude: -96.65981245 },
  K219: { latitude: 33.10907364, longitude: -96.65998150 },
  K222: { latitude: 33.10911448, longitude: -96.66009094 },
  K220: { latitude: 33.10916531, longitude: -96.66003785 },
  K218: { latitude: 33.10923067, longitude: -96.65994140 },
  K216: { latitude: 33.10925064, longitude: -96.65990348 },
  K214: { latitude: 33.10931599, longitude: -96.65978861 },
  H203: { latitude: 33.10856942, longitude: -96.66009582 },
  H204: { latitude: 33.10849272, longitude: -96.66021394 },
  H206: { latitude: 33.10841602, longitude: -96.66028817 },
  H205: { latitude: 33.10851496, longitude: -96.66033097 },
  H208: { latitude: 33.10845187, longitude: -96.66036077 },
  G104: { latitude: 33.10909306, longitude: -96.66064912 },
  G106: { latitude: 33.10910748, longitude: -96.66071285 },
  G109: { latitude: 33.10904206, longitude: -96.66081715 },
  G110: { latitude: 33.10903556, longitude: -96.66085481 },
  G115: { latitude: 33.10890471, longitude: -96.66104311 },
  G117: { latitude: 33.10886083, longitude: -96.66111844 },
  G118: { latitude: 33.10883807, longitude: -96.66114789 },
  G122: { latitude: 33.10876330, longitude: -96.66125556 },
  G123: { latitude: 33.10874583, longitude: -96.66128502 },
  G126: { latitude: 33.10867187, longitude: -96.66140138 },
  G127: { latitude: 33.10864505, longitude: -96.66143421 },
  G128: { latitude: 33.10857963, longitude: -96.66155251 },
  G108: { latitude: 33.10900955, longitude: -96.66071189 },
  G114: { latitude: 33.10887830, longitude: -96.66090502 },
  G121: { latitude: 33.10871535, longitude: -96.66114596 },
  G125: { latitude: 33.10861092, longitude: -96.66131785 },
  G139: { latitude: 33.10845122, longitude: -96.66131399 },
  G145: { latitude: 33.10862799, longitude: -96.66106677 },
  G154: { latitude: 33.10878321, longitude: -96.66082777 },
  G160: { latitude: 33.10891772, longitude: -96.66063270 },
  G165: { latitude: 33.10889415, longitude: -96.66046274 },
  G164: { latitude: 33.10885717, longitude: -96.66053758 },
  G162: { latitude: 33.10880800, longitude: -96.66061387 },
  G161: { latitude: 33.10878931, longitude: -96.66062449 },
  G155: { latitude: 33.10866740, longitude: -96.66082680 },
  G153: { latitude: 33.10864830, longitude: -96.66085191 },
  G148: { latitude: 33.10857150, longitude: -96.66096393 },
  G147: { latitude: 33.10852640, longitude: -96.66103346 },
  G146: { latitude: 33.10849754, longitude: -96.66107257 },
  G142: { latitude: 33.10842806, longitude: -96.66118845 },
  G140: { latitude: 33.10840449, longitude: -96.66121259 },
  G138: { latitude: 33.10833663, longitude: -96.66133378 },
  F105: { latitude: 33.10954675, longitude: -96.66106194 },
  F108: { latitude: 33.10957195, longitude: -96.66113002 },
  F111: { latitude: 33.10950815, longitude: -96.66123287 },
  F112: { latitude: 33.10948377, longitude: -96.66126715 },
  F115: { latitude: 33.10940737, longitude: -96.66138352 },
  F116: { latitude: 33.10938624, longitude: -96.66140959 },
  F120: { latitude: 33.10929441, longitude: -96.66154478 },
  F124: { latitude: 33.10922695, longitude: -96.66164328 },
  F125: { latitude: 33.10919119, longitude: -96.66169640 },
  F129: { latitude: 33.10912740, longitude: -96.66182242 },
  F130: { latitude: 33.10907051, longitude: -96.66188470 },
  F133: { latitude: 33.10902499, longitude: -96.66196051 },
  F110: { latitude: 33.10945248, longitude: -96.66112520 },
  F158: { latitude: 33.10938259, longitude: -96.66121066 },
  F114: { latitude: 33.10936511, longitude: -96.66126715 },
  F117: { latitude: 33.10927937, longitude: -96.66139028 },
  F123: { latitude: 33.10915909, longitude: -96.66155685 },
  F126: { latitude: 33.10910789, longitude: -96.66164425 },
  F128: { latitude: 33.10904734, longitude: -96.66174130 },
  F131: { latitude: 33.10899533, longitude: -96.66181807 },
  F165: { latitude: 33.10940067, longitude: -96.66092868 },
  F164: { latitude: 33.10934479, longitude: -96.66087822 },
  F163: { latitude: 33.10933951, longitude: -96.66091468 },
  F160: { latitude: 33.10926799, longitude: -96.66102042 },
  F159: { latitude: 33.10923508, longitude: -96.66104987 },
  F155: { latitude: 33.10916925, longitude: -96.66115706 },
  F148: { latitude: 33.10905263, longitude: -96.66133958 },
  F146: { latitude: 33.10897948, longitude: -96.66145932 },
  F144: { latitude: 33.10895916, longitude: -96.66148153 },
  F141: { latitude: 33.10891040, longitude: -96.66155927 },
  F137: { latitude: 33.10881166, longitude: -96.66170364 },
  F136: { latitude: 33.10878646, longitude: -96.66174371 },
  Library: { latitude: 33.11011930, longitude: -96.66111940 },
  A134: { latitude: 33.10948539, longitude: -96.66059697 },
  A130: { latitude: 33.10956829, longitude: -96.66057041 },
  A128: { latitude: 33.10962640, longitude: -96.66050378 },
  A126: { latitude: 33.10964712, longitude: -96.66047626 },
  A124: { latitude: 33.10971701, longitude: -96.66035555 },
  A122: { latitude: 33.10974221, longitude: -96.66033817 },
  A121: { latitude: 33.10963249, longitude: -96.66031113 },
  A125: { latitude: 33.10952156, longitude: -96.66048737 },
  A104: { latitude: 33.10934479, longitude: -96.66046854 },
  A106: { latitude: 33.10928628, longitude: -96.66041108 },
  A108: { latitude: 33.10933951, longitude: -96.66035700 },
  A110: { latitude: 33.10938909, longitude: -96.66028892 },
  A112: { latitude: 33.10940575, longitude: -96.66026236 },
  A114: { latitude: 33.10948255, longitude: -96.66014117 },
  A116: { latitude: 33.10949596, longitude: -96.66011655 },
  A115: { latitude: 33.10954513, longitude: -96.66023532 },
  A109: { latitude: 33.10943460, longitude: -96.66040577 },
  K130: { latitude: 33.10900854, longitude: -96.66015566 },
  K128: { latitude: 33.10906421, longitude: -96.66020877 },
  K126: { latitude: 33.10907843, longitude: -96.66016580 },
  K124: { latitude: 33.10913126, longitude: -96.66008854 },
  K122: { latitude: 33.10919343, longitude: -96.65998087 },
  K120: { latitude: 33.10923569, longitude: -96.65993307 },
  K118: { latitude: 33.10932062, longitude: -96.65980415 },
  K117: { latitude: 33.10924382, longitude: -96.65972883 },
  K123: { latitude: 33.10907599, longitude: -96.65997411 },
  K100: { latitude: 33.10881958, longitude: -96.65998376 },
  K106: { latitude: 33.10885372, longitude: -96.65990120 },
  K108: { latitude: 33.10892767, longitude: -96.65980125 },
  K109: { latitude: 33.10904552, longitude: -96.65980125 },
  K110: { latitude: 33.10897643, longitude: -96.65972545 },
  K113: { latitude: 33.10910159, longitude: -96.65972738 },
  K112: { latitude: 33.10907599, longitude: -96.65957335 },
  H100: { latitude: 33.10864404, longitude: -96.66017111 },
  H101: { latitude: 33.10853554, longitude: -96.66013972 },
  H104: { latitude: 33.10851685, longitude: -96.66040963 },
  H113: { latitude: 33.10837543, longitude: -96.66059456 },
  H115: { latitude: 33.10834983, longitude: -96.66076741 },
  H117: { latitude: 33.10832383, longitude: -96.66081377 },
  H123: { latitude: 33.10834577, longitude: -96.66024933 },
  H112: { latitude: 33.10823240, longitude: -96.66043184 },
  H153: { latitude: 33.10834577, longitude: -96.65989589 },
  H136: { latitude: 33.10804060, longitude: -96.65972400 },
  H156: { latitude: 33.10789106, longitude: -96.65959846 },
  H167: { latitude: 33.10789756, longitude: -96.65990458 },
  H172: { latitude: 33.10781222, longitude: -96.65982201 },
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
  const difference = getHeadingDifference(currentSegmentIndex);


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
  const currentSegment = routeSegments[currentSegmentIndex];

  if (!currentSegment) {
    return;
  }

  if (!nextSegment) {
    return directions.text;
  }
  

  const point1_lat = currentSegment[0].latitude;
  const point1_long = currentSegment[0].longitude;
  const point2_lat = currentSegment[currentSegment.length - 1].latitude;
  const point2_long = currentSegment[currentSegment.length - 1].longitude;
  const point3_lat = nextSegment[0].latitude;
  const point3_long = nextSegment[0].longitude;
  const point4_lat = nextSegment[nextSegment.length - 1].latitude;
  const point4_long = nextSegment[nextSegment.length - 1].longitude;


  // If no next segment, return final directions text from directions


  function calculateAngle() {
    const vector1_x = point2_long - point1_long;
    const vector1_y = point2_lat - point1_lat;
    const vector2_x = point4_long - point3_long;
    const vector2_y = point4_lat - point3_lat;

    // Calculate the dot product and magnitudes of the vectors
    const dotProduct = vector1_x * vector2_x + vector1_y * vector2_y;
    const mag1 = Math.sqrt(vector1_x ** 2 + vector1_y ** 2);
    const mag2 = Math.sqrt(vector2_x ** 2 + vector2_y ** 2);
    const cosTheta = dotProduct / (mag1 * mag2);
    let angleInDegrees = Math.acos(cosTheta) * (180 / Math.PI);

    // Calculate cross product to determine turn direction
    const crossProduct = vector1_x * vector2_y - vector1_y * vector2_x;

    // If cross product is negative, the angle should be to the right
    if (crossProduct < 0) {
        angleInDegrees = 360 - angleInDegrees; // Convert to right turn angle
    }

    return angleInDegrees;
}

  const angle = calculateAngle();

  // Extract distance from directions.text for turn guidance
  let distance = directions.text.match(/(\d+)/);

  if (directions.text.startsWith('Proceed') || directions.text.startsWith('Climb')){
    return directions.text;
  }


  distance = distance ? `${distance[0]} feet` : 'unknown distance';

  if (directions.text.startsWith("From stairs")) {
    let secondary = angle < 180 ? `Turn left` : `Turn right`;
    return directions.text + " and " + secondary.toLowerCase();
  }

  // Provide turn instructions based on the angle
  if (angle < 180) {
    return `Turn left in ${distance}`;
  } else {
    return `Turn right in ${distance}`;
  }
}, [routeSegments, currentSegmentIndex, directions.text]);



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