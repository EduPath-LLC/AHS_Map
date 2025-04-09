import React, { useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View, TextInput, Text, TouchableOpacity, Keyboard, SafeAreaView } from 'react-native';
import MapView, { Polyline, Marker,} from 'react-native-maps';
import { LocationContext } from '../components/providers/LocationContext';
import {FontAwesome6, FontAwesome} from '@expo/vector-icons';
import { debounce } from 'lodash';
import { styles } from '../styles/light/MapLight'
import { useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Magnetometer } from 'expo-sensors';
import { Linking } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase'

function isValidStaircasePair(point1, point2) {
  const isStaircase1 = point1.reference.startsWith('S');
  const isStaircase2 = point2.reference.startsWith('S');

  if (isStaircase1 && isStaircase2) {
    const pair1 = point1.reference.split('_')[1];
    const pair2 = point2.reference.split('_')[1];
    return pair1 === pair2;
  }
  return false;
}function determineRealTurns(route) {
  console.log('DETERMINERIEALJSKJLJDL:KJDS:FJDLS:FJDL:SFJ');
  const segments = [];
  let currentSegment = [route[0]];
  let lastSignificantBearing = calculateBearing(route[0], route[1]);
  let currentFloor = getFloor(route[0]);
  let specialStaircaseHandled = false;

  // Enhanced staircase detection using both ID and reference
  const isTargetStaircase = (point) => {
    const identifiers = [point?.id, point?.nodeId, point?.reference];
    return identifiers.some(id => id?.includes('S1_14') || id?.includes('S2_14'));
  };

  const isActiveStaircasePair = (i) => {
    if (i < 0 || i >= route.length - 1) return false;
    const curr = route[i];
    const next = route[i + 1];
    return isValidStaircasePair(curr, next) && isFloorChange(curr, next);
  };

  for (let i = 1; i < route.length; i++) {
    const currentPoint = route[i - 1];
    const nextPoint = route[i];

    if (isActiveStaircasePair(i - 1)) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }

      // Handle staircase segment
      segments.push([currentPoint, nextPoint]);
      
      // Check if this is our target staircase
      const isSpecialCase = isTargetStaircase(currentPoint) || isTargetStaircase(nextPoint);

      let lookAhead = i + 1;
      if (isSpecialCase) {
        // Special handling for S1_14/S2_14
        while (lookAhead < route.length && 
              (isFloorChange(route[lookAhead - 1], route[lookAhead]) ||
              isTargetStaircase(route[lookAhead]))) {
          lookAhead++;
        }

        // Create extended segment for special case
        currentSegment = [route[lookAhead - 1]];
        if (lookAhead < route.length) {
          currentSegment.push(route[lookAhead]);
          i = lookAhead; // Skip ahead
          specialStaircaseHandled = true;
        }
      } else {
        // Regular staircase handling
        while (lookAhead < route.length && 
              isFloorChange(route[lookAhead - 1], route[lookAhead])) {
          lookAhead++;
        }
        i = lookAhead - 1;
        currentSegment = [route[i]];
      }
      continue;
    }

    // Reset bearing after special staircase
    if (specialStaircaseHandled) {
      lastSignificantBearing = calculateBearing(
        currentSegment[currentSegment.length - 2],
        currentSegment[currentSegment.length - 1]
      );
      specialStaircaseHandled = false;
    }

    currentSegment.push(nextPoint);

    // Bearing calculations for regular points
    if (i < route.length - 1 && !specialStaircaseHandled) {
      const newBearing = calculateBearing(nextPoint, route[i + 1]);
      let bearingDifference = Math.abs(newBearing - lastSignificantBearing);
      
      bearingDifference = bearingDifference > 180 ? 360 - bearingDifference : bearingDifference;

      if (bearingDifference >= 55 && bearingDifference <= 120) {
        segments.push(currentSegment);
        currentSegment = [nextPoint];
        lastSignificantBearing = newBearing;
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
  return (point1.reference.startsWith('S1') && point2.reference.startsWith('S2')) ||
         (point1.reference.startsWith('S2') && point2.reference.startsWith('S1'));
}


const firstFloorCoordinates = [
  
  { latitude: 33.11000677620671000000, longitude: -96.66127234430397000000, reference: 'LIBRARY' },
  { latitude: 33.10976867219124400000, longitude: -96.66105219132257000000, reference: 'S1_9' },
  { latitude: 33.10976867219124400000, longitude: -96.66105219132257000000, reference: 'CAFETERIA' },
    
    { latitude: 33.11002453134270951, longitude: -96.66066677016860353, reference: 'ENTRANCE' },
    { latitude: 33.109768672191244, longitude: -96.66105221607516, reference: 'MID' },
    { latitude: 33.10954918426422500000, longitude: -96.66084925093358000000, reference: 'S1_1' },
    { latitude: 33.10945194354582, longitude: -96.66100404668036, reference: 'F MID' },
    { latitude: 33.109483345573686, longitude: -96.66103270225616, reference: 'F105' },
    { latitude: 33.10954345131491, longitude: -96.66108818354715, reference: 'CORNER' },
    { latitude: 33.109537331464665, longitude: -96.66109775412494, reference: 'F108' },
    { latitude: 33.1095002772129, longitude: -96.66115385886242, reference: 'F110' },
    { latitude: 33.10946247160276, longitude: -96.66121110124978, reference: 'F111' },
    { latitude: 33.10944999651145, longitude: -96.66122999008681, reference: 'F112' },
    { latitude: 33.109404586260965, longitude: -96.66129874684378, reference: 'F114' },
    { latitude: 33.10936795750624, longitude: -96.66135420732593, reference: 'F115' },
    { latitude: 33.10935564529681, longitude: -96.66137284953959, reference: 'F116' },
    { latitude: 33.10932042879837, longitude: -96.66142617169038, reference: 'F117' },
    { latitude: 33.10930435051054, longitude: -96.66145051621429, reference: 'S1_7' },
    { latitude: 33.10926906150741, longitude: -96.66150394814619, reference: 'F120' },
    { latitude: 33.10925627852489, longitude: -96.66152330316875, reference: 'MIDCUT1' },
    { latitude: 33.10909240405331, longitude: -96.66136957400717, reference: 'MIDCUT2' },
    { latitude: 33.10925627852489, longitude: -96.66152330316875, reference: 'MIDCUT1' },
    { latitude: 33.10921164679766, longitude: -96.66159088114483, reference: 'F123' },
    { latitude: 33.10920717458255, longitude: -96.66159765263374, reference: 'F124' },
    { latitude: 33.10916647180384, longitude: -96.66165928169400, reference: 'F125' },
    { latitude: 33.10915557184550, longitude: -96.66167578558417, reference: 'F126' },
    { latitude: 33.10909125855586, longitude: -96.66177316388925, reference: 'F128' },
    { latitude: 33.10908160797290, longitude: -96.66178777606997, reference: 'F129' },
    { latitude: 33.10903337296948, longitude: -96.66186080985356, reference: 'F130' },
    { latitude: 33.10903118206320, longitude: -96.66186412715768, reference: 'F131' },
    { latitude: 33.10898396103786, longitude: -96.66193562565257, reference: 'F133' },
    { latitude: 33.10896996486976, longitude: -96.66195681758873, reference: 'S1_20' },
    { latitude: 33.10880449636794, longitude: -96.66180426005346, reference: 'S1_30' },
    { latitude: 33.10881853776829, longitude: -96.66178306019978, reference: 'F136' },
    { latitude: 33.10884543469507, longitude: -96.66174245093733, reference: 'F137' },
    { latitude: 33.10886880986748, longitude: -96.66170715885659, reference: 'F138' },
    { latitude: 33.10894049259899, longitude: -96.66159893151591, reference: 'F140' },
    { latitude: 33.10894520020812, longitude: -96.66159182391820, reference: 'F141' },
    { latitude: 33.10899633230812, longitude: -96.66151462413677, reference: 'F145' },
    { latitude: 33.10900033377335, longitude: -96.66150858268254, reference: 'F144' },
    { latitude: 33.10901217527204, longitude: -96.66149070426349, reference: 'F146' },
    { latitude: 33.10909240405331, longitude: -96.66136957400717, reference: 'MIDCUT2' },
    { latitude: 33.10909240405331, longitude: -96.66136957400717, reference: 'F148' },
    { latitude: 33.10913821274078, longitude: -96.66130041156984, reference: 'S1_10' },
    { latitude: 33.10915554044267, longitude: -96.66127425002360, reference: 'F153' },
    { latitude: 33.10920440903412, longitude: -96.66120046771113, reference: 'F155' },
    { latitude: 33.10923993344288, longitude: -96.66114683258577, reference: 'F156' },
    { latitude: 33.10928659316026, longitude: -96.66107638525457, reference: 'F159' },
    { latitude: 33.10928659316026, longitude: -96.66107638525457, reference: 'F158' },
    { latitude: 33.10930149455387, longitude: -96.66105388697403, reference: 'F160' },
    { latitude: 33.10933546167882, longitude: -96.66100260305214, reference: 'F161' },
    { latitude: 33.10937364769099, longitude: -96.66094494941002, reference: 'F163' },
    { latitude: 33.10937929679408, longitude: -96.66093665884165, reference: 'F164' },
    { latitude: 33.10941692859606, longitude: -96.66097139530632, reference: 'F165' },
    { latitude: 33.10945194354582, longitude: -96.66100404668036, reference: 'F MID' },
    { latitude: 33.109549184260000, longitude: -96.66084925000000, reference: 'F201' },

    { latitude: 33.109349413, longitude: -96.660664880, reference: 'S1_14' },

    { latitude: 33.10944234865774, longitude: -96.66051814553069, reference: 'A MID' },
    { latitude: 33.10949115105158, longitude: -96.66056318284635, reference: 'A134' },
    { latitude: 33.10951177786585, longitude: -96.66058215076715, reference: 'CORNERA' },
    { latitude: 33.10954215395278, longitude: -96.66053657130539, reference: 'A130' },
    { latitude: 33.10955224510578, longitude: -96.66052127472483, reference: 'A125' },
    { latitude: 33.10958978516158, longitude: -96.66046436997993, reference: 'A128' },
    { latitude: 33.10960453556035, longitude: -96.66044201072498, reference: 'A126' },
    { latitude: 33.10966288555176, longitude: -96.66035356143246, reference: 'A121' },
    { latitude: 33.10968196939599, longitude: -96.66032463336444, reference: 'A124' },
    { latitude: 33.10969838561389, longitude: -96.66029974899303, reference: 'A122' },
    { latitude: 33.10974858771374, longitude: -96.66022365060626, reference: 'S1_17' },
    { latitude: 33.10958554123231, longitude: -96.66007208594999, reference: 'S1_27' },
    { latitude: 33.10956281808866, longitude: -96.66010656220340, reference: 'A115' },
    { latitude: 33.10953469317669, longitude: -96.66014923418610, reference: 'A116' },
    { latitude: 33.10951890460532, longitude: -96.66017318909286, reference: 'A114' },
    { latitude: 33.10945358979121, longitude: -96.66027228674054, reference: 'A109' },
    { latitude: 33.10943889964120, longitude: -96.66029457508859, reference: 'A112' },
    { latitude: 33.10942311105261, longitude: -96.66031853002147, reference: 'A110' },
    { latitude: 33.10937330106562, longitude: -96.66039410326786, reference: 'A108' },
    { latitude: 33.10934872496921, longitude: -96.66043174485885, reference: 'A106' },
    { latitude: 33.10938202253659, longitude: -96.66046247353700, reference: 'A104' },
    { latitude: 33.10944234865774, longitude: -96.6605181455, reference: 'A MID' },
    { latitude: 33.109349413, longitude: -96.660664880, reference: 'S1_14' },

    { latitude: 33.10909604500765000000, longitude: -96.66043027455417000000, reference: 'S1_13' },
    { latitude: 33.10899494581290, longitude: -96.66058915467005, reference: 'GMID' },
    { latitude: 33.10905716275518, longitude: -96.66064685173170, reference: 'G104' },
    { latitude: 33.10908779885913, longitude: -96.66067426235244, reference: 'CORNERL' },
    { latitude: 33.10908272803921, longitude: -96.66068292314730, reference: 'G106' },
    { latitude: 33.10904394748081, longitude: -96.66074155382540, reference: 'G108' },
    { latitude: 33.10900927270076, longitude: -96.66079397715171, reference: 'G109' },
    { latitude: 33.10899806350948, longitude: -96.66081092385163, reference: 'G110' },
    { latitude: 33.10893509883007, longitude: -96.66090611747447, reference: 'S1_11' },
    { latitude: 33.10891446644129, longitude: -96.66093731070620, reference: 'G114' },
    { latitude: 33.10886377845569, longitude: -96.66101394371742, reference: 'G115' },
    { latitude: 33.10885542280503, longitude: -96.66102657627054, reference: 'DEL' },
    { latitude: 33.10881877723489, longitude: -96.66108197915065, reference: 'G117' },
    { latitude: 33.10881877723489, longitude: -96.66108197915065, reference: 'G118' },
    { latitude: 33.10880126526586, longitude: -96.66110845475237, reference: 'MIDCUTG1' },
    { latitude: 33.10863730352468, longitude: -96.66095707771076, reference: 'GMIDCUT2' },
    { latitude: 33.10880126526586, longitude: -96.66110845475237, reference: 'MIDCUTG1' },
    { latitude: 33.10875511428154, longitude: -96.66117822846417, reference: 'G121' },
    { latitude: 33.10872212289219, longitude: -96.66122810674361, reference: 'G122' },
    { latitude: 33.10870896327296, longitude: -96.66124800221266, reference: 'G123' },
    { latitude: 33.10864955009860, longitude: -96.66133782646597, reference: 'G125' },
    { latitude: 33.10862688506302, longitude: -96.66137209277000, reference: 'G126' },
    { latitude: 33.10861239099607, longitude: -96.66139400573383, reference: 'G127' },
    { latitude: 33.10853146243038, longitude: -96.66151635819290, reference: 'G128' },
    { latitude: 33.10851678364739, longitude: -96.66153855042106, reference: 'S1_5' },
    { latitude: 33.10835308826282, longitude: -96.66138774313453, reference: 'S1_19' },
    { latitude: 33.10836926588401, longitude: -96.66136322952454, reference: 'G138' },
    { latitude: 33.10841888660577, longitude: -96.66128804028583, reference: 'G139' },
    { latitude: 33.10844886016316, longitude: -96.66124262198313, reference: 'G140' },
    { latitude: 33.10846140386029, longitude: -96.66122361478202, reference: 'G142' },
    { latitude: 33.10852987099159, longitude: -96.66111986797432, reference: 'G145' },
    { latitude: 33.10854401599859, longitude: -96.66109843434197, reference: 'G146' },
    { latitude: 33.10856064517167, longitude: -96.66107323650486, reference: 'G147' },
    { latitude: 33.10860786380501, longitude: -96.66100168710037, reference: 'G148' },
    { latitude: 33.10863730352468, longitude: -96.66095707771076, reference: 'GMIDCUT2' },
    { latitude: 33.10868612343565, longitude: -96.66088310192384, reference: 'G153' },
    { latitude: 33.10869341155663, longitude: -96.66087205838704, reference: 'G154' },
    { latitude: 33.10870240350890, longitude: -96.66085843307040, reference: 'G155' },
    { latitude: 33.10877078826595, longitude: -96.66075481108268, reference: 'S1_15' },
    { latitude: 33.10881720612811, longitude: -96.66068447506993, reference: 'G160' },
    { latitude: 33.10883348617707, longitude: -96.66065980625330, reference: 'G161' },
    { latitude: 33.10884584511969, longitude: -96.66064107900681, reference: 'G162' },
    { latitude: 33.10889413114312, longitude: -96.66056791220850, reference: 'G164' },
    { latitude: 33.10892365295320, longitude: -96.66052380872497, reference: 'G165' },
    { latitude: 33.10899494581290, longitude: -96.66058915467005, reference: 'GMID' },
    { latitude: 33.10909604500765000000, longitude: -96.66043027455417000000, reference: 'S1_13' },
    { latitude: 33.10888318346311000000, longitude: -96.66023346097434000000, reference: 'S1_16' },
    { latitude: 33.10883392503870000000, longitude: -96.66018791621958000000, reference: 'K ENTRANCE' },
  { latitude: 33.10893343998354, longitude: -96.66004332519219, reference: 'K MID' },
  { latitude: 33.10899853172984, longitude: -96.66010402494138, reference: 'K130' },
  { latitude: 33.10903282294311, longitude: -96.66013597078240, reference: 'K126' },
  { latitude: 33.10908049290705, longitude: -96.66006305534230, reference: 'K124' },
  { latitude: 33.10911313509052, longitude: -96.66001428046337, reference: 'K123' },
  { latitude: 33.10916807276574, longitude: -96.65993219102654, reference: 'K122' },
  { latitude: 33.10918576936053, longitude: -96.65990574827129, reference: 'K120' },
  { latitude: 33.10922567925497, longitude: -96.65984611377192, reference: 'K117' },
  { latitude: 33.10928047281458, longitude: -96.65976423967675, reference: 'K118' },
  { latitude: 33.10930340456615, longitude: -96.65972997440133, reference: 'S1_29' },
  { latitude: 33.10913213359301, longitude: -96.65956880246307, reference: 'S1_25' },
  { latitude: 33.10911737272422, longitude: -96.65959119872659, reference: 'K112' },
  { latitude: 33.10906695174100, longitude: -96.65966770110893, reference: 'K110' },
  { latitude: 33.10905280681819, longitude: -96.65968916281443, reference: 'K113' },
  { latitude: 33.10900700503772, longitude: -96.65975865660644, reference: 'K109' },
  { latitude: 33.10895676869052, longitude: -96.65983487884557, reference: 'K108' },
  { latitude: 33.10894857742131, longitude: -96.65984730723488, reference: 'K106' },
  { latitude: 33.10886276303221, longitude: -96.65997743957256, reference: 'K100' },
  { latitude: 33.10893343998354, longitude: -96.66004332519219, reference: 'K MID' },
  { latitude: 33.10883392503870000000, longitude: -96.66018791621958000000, reference: 'K ENTRANCE' },
  // { latitude: 33.10856133683780, longitude: -96.65993588423450, reference: 'S1_21' },
];

const secondFloorCoordinates = [


  { latitude: 33.109971381724904, longitude: -96.66130147923262, reference: '2MAINHALL' },
  { latitude: 33.10952242109021, longitude: -96.66088922805024, reference: '2FENTRANCE' },
  { latitude: 33.109545215126175, longitude: -96.66085454284246, reference: 'S2_1' },
  { latitude: 33.10956921622493, longitude: -96.66081717996883, reference: '2ENTRANCE' },
  { latitude: 33.10945468699747, longitude: -96.66099546935033, reference: '2F MID FRONT' },
  { latitude: 33.10954500167219, longitude: -96.66108226076537, reference: 'F207' },
  { latitude: 33.10953483107906, longitude: -96.6610977603442, reference: 'F208' },
  { latitude: 33.10946539704782, longitude: -96.66120357504222, reference: 'F210' },
  { latitude: 33.10945784773486, longitude: -96.66121507989448, reference: 'F212' },
  { latitude: 33.109452122162395, longitude: -96.66122380543887, reference: 'F213' },
  { latitude: 33.109368113683416, longitude: -96.66135183101474, reference: 'F216' },
  { latitude: 33.10935343444692, longitude: -96.66137420158647, reference: 'F217' },
  { latitude: 33.1093251244839, longitude: -96.6614173448425, reference: 'F215' },
  { latitude: 33.10930855790873, longitude: -96.66144259164321, reference: 'S2_7' },
  { latitude: 33.10925549614271, longitude: -96.66152345566115, reference: 'MIDCUT1' },
  { latitude: 33.10909147837973, longitude: -96.66136975085195, reference: 'MIDCUT2' },
  { latitude: 33.10925549614271, longitude: -96.66152345566115, reference: 'MIDCUT1' },
  { latitude: 33.109224250296336, longitude: -96.66157107308649, reference: 'F222' },
  { latitude: 33.1092031527484, longitude: -96.66160322490923, reference: 'F224' },
  { latitude: 33.10914850258018, longitude: -96.66168650958885, reference: 'F223' },
  { latitude: 33.109128371004914, longitude: -96.66171718930771, reference: 'F226' },
  { latitude: 33.10910782001707, longitude: -96.66174850819462, reference: 'F227' },
  { latitude: 33.109039748725316, longitude: -96.66185224613196, reference: 'F228' },
  { latitude: 33.10903177996745, longitude: -96.66186439020154, reference: 'F229' },
  { latitude: 33.1090221335754, longitude: -96.6618790909188, reference: 'F230' },
  { latitude: 33.10896764835255, longitude: -96.66196212422827, reference: 'S2_20' },
  { latitude: 33.10880219053123, longitude: -96.661809713627, reference: 'S2_30' },
  { latitude: 33.10885407349071, longitude: -96.66173080754453, reference: 'F234' },
  { latitude: 33.1088667511467, longitude: -96.66171152675986, reference: 'S2_1' },
  { latitude: 33.10887335684002, longitude: -96.661701480506, reference: 'F236' },
  { latitude: 33.108949273233236, longitude: -96.66158602322979, reference: 'F238' },
  { latitude: 33.10896128996865, longitude: -96.66156774760472, reference: 'F239' },
  { latitude: 33.108982260399344, longitude: -96.66153585477227, reference: 'F241' },
  { latitude: 33.10904438696183, longitude: -96.66144136972915, reference: 'F242' },
  { latitude: 33.10905619398012, longitude: -96.66142341305189, reference: 'F243' },
  { latitude: 33.10909147837973, longitude: -96.66136975085195, reference: 'MIDCUT2' },
  { latitude: 33.10910835955181, longitude: -96.66134407715927, reference: 'FLY1' },
  { latitude: 33.10881966352259, longitude: -96.66108047573326, reference: "FLYCUT2" },
  { latitude: 33.10910835955181, longitude: -96.66134407715927, reference: 'FLY1' },
  { latitude: 33.10914197576989, longitude: -96.66129295200946, reference: 'S2_10' },
  { latitude: 33.10915944477946, longitude: -96.66126638430546, reference: 'F248' },
  { latitude: 33.10918823779095, longitude: -96.66122259451856, reference: 'F249' },
  { latitude: 33.109200527784935, longitude: -96.6612039033088, reference: 'F250' },
  { latitude: 33.10927004793607, longitude: -96.661098173743, reference: 'F252' },
  { latitude: 33.109283322849, longitude: -96.66107798462147, reference: 'F253' },
  { latitude: 33.10929575894579, longitude: -96.66105907121158, reference: 'F254' },
  { latitude: 33.10934455626815, longitude: -96.6609848579134, reference: 'F255' },
  { latitude: 33.109379913609914, longitude: -96.66093108477955, reference: 'TRC' },
  { latitude: 33.10945468699747, longitude: -96.66099546935033, reference: '2F MID FRONT' },
  { latitude: 33.10952242109021, longitude: -96.66088922805024, reference: '2FENTRANCE' },
  { latitude: 33.10931541294438, longitude: -96.66069914601121, reference: 'S2_14' },
  { latitude: 33.10906944131525, longitude: -96.66047328635425, reference: "GENTRANCE" },
  { latitude: 33.10900017535599, longitude: -96.66058231936353, reference: "GMID" },
  { latitude: 33.109058569591525, longitude: -96.66063592758371, reference: "G205" },
  { latitude: 33.1090913645899, longitude: -96.66066596996748, reference: "G206" },
  { latitude: 33.109073120338095, longitude: -96.6606940468132, reference: "G207" },
  { latitude: 33.109044117584695, longitude: -96.6607382654019, reference: "G209" },
  { latitude: 33.10901763127212, longitude: -96.66077864733893, reference: "G210" },
  { latitude: 33.108997919075314, longitude: -96.66080870122764, reference: "G211" },
  { latitude: 33.108939640217216, longitude: -96.66089755516573, reference: "S2_11" },
  { latitude: 33.108913719398785, longitude: -96.66093707493107, reference: "G213" },
  { latitude: 33.10888563793986, longitude: -96.66097988888274, reference: "G214" },
  { latitude: 33.10886781305446, longitude: -96.66100706531199, reference: "G215" },
  { latitude: 33.10881966352259, longitude: -96.66108047573326, reference: "FLYCUT2" },
  { latitude: 33.10879927752077, longitude: -96.6611115569281, reference: "G218" },
  { latitude: 33.10863610550598, longitude: -96.66095224283366, reference: "G247" },
  { latitude: 33.10879927752077, longitude: -96.6611115569281, reference: "G218" },
  { latitude: 33.10875741909612, longitude: -96.66117537571238, reference: "G220" },
  { latitude: 33.10872401243574, longitude: -96.66122630864811, reference: "G221" },
  { latitude: 33.10870675304451, longitude: -96.66125262290562, reference: "G222" },
  { latitude: 33.108676619115855, longitude: -96.66129856612275, reference: "G223" },
  { latitude: 33.10866040824057, longitude: -96.66132328177704, reference: "G224" },
  { latitude: 33.10862874277224, longitude: -96.66137156003188, reference: "G225" },
  { latitude: 33.108613014886394, longitude: -96.66139553930395, reference: "G226" },
  { latitude: 33.108581705223514, longitude: -96.66144327508565, reference: "G227" },
  { latitude: 33.10853124877592, longitude: -96.66152020270945, reference: "G228" },
  { latitude: 33.10851308693722, longitude: -96.66154789286921, reference: "S2_5" },
  { latitude: 33.10834535768775, longitude: -96.6613946199867, reference: "S2_19" },
  { latitude: 33.1083641486784, longitude: -96.66136620875649, reference: "G236" },
  { latitude: 33.10841559016205, longitude: -96.66128790580876, reference: "G237" },
  { latitude: 33.10844641688495, longitude: -96.66124098213743, reference: "G238" },
  { latitude: 33.10845990162788, longitude: -96.66122045599695, reference: "G239" },
  { latitude: 33.108540663924636, longitude: -96.66109752163636, reference: "G243" },
  { latitude: 33.10855681123405, longitude: -96.66107294260334, reference: "G244" },
  { latitude: 33.1085905548391, longitude: -96.66102157892652, reference: "G245" },
  { latitude: 33.10863610550598, longitude: -96.66095224283366, reference: "G247" },
  { latitude: 33.1086879026525, longitude: -96.66087339850478, reference: "G252" },
  { latitude: 33.1087003388336, longitude: -96.66085446845904, reference: "G253" },
  { latitude: 33.108717534638245, longitude: -96.66082829343264, reference: "G254" },
  { latitude: 33.108768893385836, longitude: -96.6607501164237, reference: "S2_15" },
  { latitude: 33.10881251197165, longitude: -96.6606837212966, reference: "G257" },
  { latitude: 33.10882956163746, longitude: -96.66065776871913, reference: "G258" },
  { latitude: 33.10884283661698, longitude: -96.66063756187529, reference: "G259" },
  { latitude: 33.10892506649267, longitude: -96.6605136299307, reference: "G261" },
  { latitude: 33.10896469384106, longitude: -96.6605499311982, reference: "G262" },
  { latitude: 33.10900017535599, longitude: -96.66058231936353, reference: "GMID" },
  { latitude: 33.10906944131525, longitude: -96.66047328635425, reference: "GENTRANCE" },
  { latitude: 33.10909243570212, longitude: -96.66043978999765, reference: "S2_13" },
  { latitude: 33.109116115103, longitude: -96.66039979772553, reference: "MIDGENTLATE" },
  { latitude: 33.10909243570212, longitude: -96.66043978999765, reference: "S2_13" },
  { latitude: 33.10906944131525, longitude: -96.66047328635425, reference: "GENTRANCE" },
  { latitude: 33.10886097025895, longitude: -96.66028186102025, reference: 'S2_16' },
  { latitude: 33.10890844171046, longitude: -96.66020960345315, reference: "HALLPT2" },
  { latitude: 33.10886097025895, longitude: -96.66028186102025, reference: 'S2_16' },
  { latitude: 33.108630171211225, longitude: -96.66006993335228, reference: '2HENTRANCE' },
  { latitude: 33.10867497158879, longitude: -96.65999863931151, reference: "K204" },
  { latitude: 33.10885838458248, longitude: -96.66016301902835, reference: "K ENTRANCE" },
  { latitude: 33.10896982964244, longitude: -96.65998494750866, reference: "K MID" },
  { latitude: 33.10900371784144, longitude: -96.6600158792806, reference: "K228" },
  { latitude: 33.10906480802483, longitude: -96.66007105066953, reference: "K222" },
  { latitude: 33.10910242757693, longitude: -96.66001164258827, reference: "K219" },
  { latitude: 33.10911136231943, longitude: -96.65999807723233, reference: "K220" },
  { latitude: 33.10918962651322, longitude: -96.65987925101595, reference: "K218" },
  { latitude: 33.10919885347937, longitude: -96.65986524198547, reference: "K216" },
  { latitude: 33.10921407932416, longitude: -96.65984212503454, reference: "K215" },
  { latitude: 33.109282569888094, longitude: -96.659738137832, reference: "K214" },
  { latitude: 33.10929611809012, longitude: -96.65971756799658, reference: "S2_29" },
  { latitude: 33.10912819010214, longitude: -96.6595629196543, reference: "S2_25" },
  { latitude: 33.10904976079582, longitude: -96.6596856200793, reference: "K211" },
  { latitude: 33.10904976079582, longitude: -96.65968562007973, reference: "K212" },
{ latitude: 33.10903424268949, longitude: -96.65970897630184, reference: "K210" },
{ latitude: 33.10900433751869, longitude: -96.6597539864208, reference: "K205" },
{ latitude: 33.108991755264015, longitude: -96.65977292390768, reference: "K208" },
{ latitude: 33.10894230292743, longitude: -96.65984735436545, reference: "K206" },
{ latitude: 33.10889616795223, longitude: -96.65991874948926, reference: "BRC" },
{ latitude: 33.108935522021554, longitude: -96.65995429069316, reference: "K202" },
{ latitude: 33.10896982964244, longitude: -96.65998494750866, reference: "K MID" },
{ latitude: 33.10885838458248, longitude: -96.66016301902835, reference: "K ENTRANCE" },
{ latitude: 33.10890844171046, longitude: -96.66020960345315, reference: "hallpt2" },
{ latitude: 33.10897834089072, longitude: -96.660272764514, reference: "K226" },
{ latitude: 33.109116115103, longitude: -96.66039979772553, reference: "midgentlate" },
{ latitude: 33.109362496538076, longitude: -96.66062614994448, reference: "A ENTRANCE" },
{ latitude: 33.10931541294438, longitude: -96.66069914601121, reference: 'S2_14' },
{ latitude: 33.109362496538076, longitude: -96.66062614994448, reference: "A ENTRANCE" },
{ latitude: 33.10943150607069, longitude: -96.66052024554845, reference: "A MID" },
{ latitude: 33.109506502881715, longitude: -96.66058874684992, reference: "A232" },
{ latitude: 33.10953758611639, longitude: -96.66054173865825, reference: "A230" },
{ latitude: 33.109589517655046, longitude: -96.66046197402315, reference: "A228" },
{ latitude: 33.10960342726715, longitude: -96.66044060945043, reference: "A226" },
{ latitude: 33.10961833666596, longitude: -96.66041770924784, reference: "A225" },
{ latitude: 33.10968408571622, longitude: -96.66031672150248, reference: "A224" },
{ latitude: 33.109697871058806, longitude: -96.66029554780245, reference: "A222" },
{ latitude: 33.10972692243588, longitude: -96.6602509261226, reference: "A221" },
{ latitude: 33.1097488297521, longitude: -96.66021727741645, reference: "S2_17" },
{ latitude: 33.10958652121709, longitude: -96.66006582712545, reference: "S2_27" },
{ latitude: 33.10956269539189, longitude: -96.66010141735043, reference: "A215" },
{ latitude: 33.10953360886999, longitude: -96.66014555950275, reference: "A216" },
{ latitude: 33.10951751328456, longitude: -96.6601699864104, reference: "A214" },
{ latitude: 33.10945247454838, longitude: -96.66026869019527, reference: "A209" },
{ latitude: 33.10943785159766, longitude: -96.66029088220984, reference: "A212" },
{ latitude: 33.1094241904692, longitude: -96.66031161454819, reference: "A210" },
{ latitude: 33.109372366980466, longitude: -96.66039026267057, reference: "A208" },
{ latitude: 33.10934287253986, longitude: -96.66043779561238, reference: "A206" },
{ latitude: 33.10938086656869, longitude: -96.66047284562576, reference: "A204" },
{ latitude: 33.10943150607069, longitude: -96.66052024554845, reference: "A MID" },
{ latitude: 33.109362496538076, longitude: -96.66062614994448, reference: "A ENTRANCE" },
{ latitude: 33.10956921622493, longitude: -96.66081717996883, reference: "mid somewhere" },
{ latitude: 33.11001916668614, longitude: -96.66122943705936, reference: "starttop" },
{ latitude: 33.10999358063734, longitude: -96.6612672276186, reference: "S2_9" },
{ latitude: 33.109971381724904, longitude: -96.66130147923262, reference: "STARTOFITALL" }



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
  CAFETERIA:{latitude: 33.1098803,longitude: -96.6613386},
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
  LIBRARY: { latitude: 33.11012281010883, longitude: -96.66112948128486 },
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
  // Convert the reference to a string (in case it's not already)
  reference = String(reference);

  // Check if the reference exists as a key in the roomCoordinates object
  if (roomCoordinates.hasOwnProperty(reference)) {
    return roomCoordinates[reference];
  }

  // If the reference is not found, return null
  return null;
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
function getSegmentDirections(currentSegment, nextSegment, previousSegment, isLast, destination) {
  const isCurrentStaircase = currentSegment.length === 2 && 
                            isValidStaircasePair(currentSegment[0], currentSegment[1]);
  const isNextStaircase = nextSegment && 
                         nextSegment.length === 2 && 
                         isValidStaircasePair(nextSegment[0], nextSegment[1]);
  const wasPreviousStaircase = previousSegment && 
                              previousSegment.length === 2 && 
                              isValidStaircasePair(previousSegment[0], previousSegment[1]);

  let text = '';
  let turn = 'straight';

  // Staircase approach
  if (isNextStaircase) {
    text = `Proceed to the stairs`;
    turn = 'stairs-start';
  }
  // Staircase climb
  else if (isCurrentStaircase) {
    const isGoingUp = currentSegment[0].reference.startsWith('S1');
    text = `Climb the stairs to ${isGoingUp ? 'second' : 'first'} floor`;
    turn = 'stairs-climb';
  }
  // Staircase exit
  else if (wasPreviousStaircase) {
    const distance = calculateTotalDistance(currentSegment);
    const distanceInFeet = Math.round(distance * 3.28084 / 5) * 5;
    
    // Handle zero-distance staircase transitions
    let distanceText = '';
    if (distanceInFeet > 0) {
      distanceText = `walk forward ${distanceInFeet} feet`;
    } else {
      distanceText = `proceed forward`; // Generic instruction for S1_14/S2_14 case
    }
    
    text = `From stairs, ${distanceText}`;

    // Only detect turns if there's actual movement
    if (distanceInFeet > 0 && currentSegment.length >= 2) {
      const start = currentSegment[0];
      const end = currentSegment[currentSegment.length - 1];
      const bearingStart = calculateBearing(start, currentSegment[1]);
      const bearingEnd = calculateBearing(currentSegment[currentSegment.length - 2], end);
      let bearingDifference = bearingEnd - bearingStart;

      if (bearingDifference > 180) bearingDifference -= 360;
      if (bearingDifference < -180) bearingDifference += 360;

      if (Math.abs(bearingDifference) >= 30) {
        const turnDirection = bearingDifference > 0 ? 'right' : 'left';
        text += `, then turn ${turnDirection}`;
        turn = turnDirection;
      }
    }
  }
  // Regular segment
  else {
    const distance = calculateTotalDistance(currentSegment);
    const distanceInFeet = Math.round(distance * 3.28084 / 5) * 5;
    text = `Go straight for ${distanceInFeet} feet`;

    if (currentSegment.length >= 3) {
      const start = currentSegment[0];
      const mid = currentSegment[Math.floor(currentSegment.length/2)];
      const end = currentSegment[currentSegment.length - 1];
      
      const initialBearing = calculateBearing(start, mid);
      const finalBearing = calculateBearing(mid, end);
      let bearingDifference = finalBearing - initialBearing;

      if (bearingDifference > 180) bearingDifference -= 360;
      if (bearingDifference < -180) bearingDifference += 360;

      if (Math.abs(bearingDifference) >= 30) {
        turn = bearingDifference > 0 ? 'right' : 'left';
        text += `, then turn ${turn}`;
      }
    }
  }

  // Final destination handling
  if (isLast) {
    const destCoords = findRoomCoordinates(destination);
    if (destCoords) {
      const finalBearing = calculateBearing(
        currentSegment[currentSegment.length - 2],
        currentSegment[currentSegment.length - 1]
      );
      const roomBearing = calculateBearing(
        currentSegment[currentSegment.length - 1],
        destCoords
      );
      let relativeAngle = roomBearing - finalBearing;
      if (relativeAngle < -180) relativeAngle += 360;
      if (relativeAngle > 180) relativeAngle -= 360;
      const side = relativeAngle > 0 ? 'right' : 'left';
      text += `. Destination will be on your ${side}`;
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








export default function Map({userId, navigation}) {
const { location, errorMsg, hasPermission, requestPermissions, updateLocation } = useContext(LocationContext);
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
// const [searchHistory, setSearchHistory] = useState([]);
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
const [email, setEmail] = useState('');
// Add to your state variables
const [directionsList, setDirectionsList] = useState([]);

const route_navigation = useRoute();
const { targetRoom, prevRoom } = route_navigation.params || {};

useEffect(() => {
  const fetchEmail = async () => {
    try {
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setEmail(userData.email);
        } else {
          console.log('No such document!');
        }
      } else {
        console.error('User ID is undefined');
      }
    } catch (error) {
      console.error('Error fetching document: ', error);
    }
  };

  fetchEmail();
  
}, [userId]);

// console.log(email)

useEffect(() => {
  if (targetRoom && prevRoom) {
    setStartingPointQuery(prevRoom);
    setSearchQuery(targetRoom);
  }
}, [targetRoom, prevRoom]);

useEffect(() => {
  if (startingPointQuery && searchQuery && targetRoom) {
    handleSearch();
    navigation.setParams({ targetRoom: undefined, prevRoom: undefined });
  }
}, [startingPointQuery, searchQuery]);





const handleEndSegment = useCallback(() => {
  if (currentSegmentIndex < routeSegments.length - 1) {
    const nextIndex = currentSegmentIndex + 1;
    setCurrentSegmentIndex(nextIndex);

    const nextSegment = routeSegments[nextIndex];
    const newBearing = calculateBearing(nextSegment[0], nextSegment[nextSegment.length - 1]);
    setBearing(newBearing);

    animateCamera(nextSegment[0], newBearing);

    // Use precomputed directions
    setDirections(directionsList[nextIndex]);

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
    // Route completion logic
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
}, [currentSegmentIndex, routeSegments, directionsList, currentFloor, calculateBearing, animateCamera, calculateTotalDistance]);
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

  // console.log(`Chosen route uses staircases: ${shortestRoute.startStaircase.reference} to ${shortestRoute.endStaircase.reference}`);
  return shortestRoute.route;
};

useEffect(() => {
  if (hasPermission === false) {
    // Handle case when permissions are denied
    setIsMapDisabled(true);
  } else if (hasPermission === true) {
    // Handle case when permissions are granted
    setIsMapDisabled(false);
    updateLocation();
  }
}, [hasPermission]);


useEffect(() => {
  let subscription;
  let lastUpdateTime = 0;
  const updateInterval = 500; 

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

  // Get segment start and end points regardless of segment type
  const segmentStart = currentSegment[0];
  const segmentEnd = currentSegment[currentSegment.length - 1];
  const segmentBearing = calculateBearing(segmentStart, segmentEnd);

  let difference = segmentBearing - heading;
  if (difference < -180) difference += 360;
  if (difference > 180) difference -= 360;

  return difference;
}, [isRouteActive, routeSegments, currentSegmentIndex, heading, calculateBearing]);

const getFirstHeadingDirection = useCallback(() => {
  const difference = getHeadingDifference(currentSegmentIndex);

  if (difference === null) {
    return 'Calculating direction...';
  }

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
      altitude: 1500,
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

// useEffect(() => {
//   const fetchHistory = async () => {
//     try {
//       const history = await loadSearchHistory(userId);
//       setSearchHistory(history);
//     } catch (error) {
//       console.error('Error fetching search history:', error);
//     }
//   };
//   fetchHistory();
// }, [userId]);








// const saveSearchHistory = async (uid, history) => {
//   try {
//     const jsonValue = JSON.stringify(history);
//     await AsyncStorage.setItem(`@search_history_${uid}`, jsonValue);
//   } catch (e) {
//     console.error('Failed to save search history.', e);
//   }
// };








// const loadSearchHistory = async (uid) => {
//   try {
//     const jsonValue = await AsyncStorage.getItem(`@search_history_${uid}`);
//     return jsonValue != null ? JSON.parse(jsonValue) : [];
//   } catch (e) {
//     console.error('Failed to load search history.', e);
//     return [];
//   }
// };





const handleSearch = useCallback(async () => {
  if (startingPointQuery && searchQuery) {
    Keyboard.dismiss();
    setShowSearch(false);

    // const newSearch = { query: searchQuery, timestamp: new Date().toISOString() };
    // const updatedHistory = [...searchHistory, newSearch];
    // setSearchHistory(updatedHistory);
    // await saveSearchHistory(userId, updatedHistory);
    // setShowHistory(false);

    setHasArrived(false);
    const newDestination = searchQuery.toUpperCase();
    const startPoint = [...firstFloorCoordinates, ...secondFloorCoordinates].find(point => 
      point.reference.toUpperCase() === startingPointQuery.toUpperCase()
    );
    const destinationPoint = [...firstFloorCoordinates, ...secondFloorCoordinates].find(point => 
      point.reference.toUpperCase() === newDestination
    );

    if (startPoint && destinationPoint) {
      setStartingPoint(startPoint);
      setDestination(destinationPoint);
      setIsRouteActive(true);

      const startFloor = firstFloorCoordinates.includes(startPoint) ? 1 : 2;
      setCurrentFloor(startFloor);
      setShowFirstFloor(startFloor === 1);

      const newRoute = calculateRoute(startPoint, destinationPoint);

      if (newRoute.length > 0) {
        const routeSegments = determineRealTurns(newRoute);

        // Precompute all directions
        const directionsList = routeSegments.map((segment, index) => {
          const nextSegment = routeSegments[index + 1];
          const previousSegment = routeSegments[index - 1];
          const isLast = index === routeSegments.length - 1;
          return getSegmentDirections(segment, nextSegment, previousSegment, isLast, newDestination);
        });

        setRoute(newRoute);
        setRouteSegments(routeSegments);
        setDirectionsList(directionsList); // Store precomputed directions
        setCurrentSegmentIndex(0);

        const estimatedTimeInMinutes = Math.ceil(calculateTotalDistance(newRoute) * 3.28084 / 250);
        setEstimatedTime(estimatedTimeInMinutes);

        if (routeSegments.length > 0) {
          const firstSegment = routeSegments[0];
          const newBearing = calculateBearing(firstSegment[0], firstSegment[firstSegment.length - 1]);
          setBearing(newBearing);
          setDirections(directionsList[0]); // Use precomputed first direction
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
  // searchHistory,
  userId,
  firstFloorCoordinates,
  secondFloorCoordinates,
  calculateRoute,
  calculateBearing,
  animateCamera,
  calculateTotalDistance,
  // saveSearchHistory,
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
    altitude: 1500,
  }, { duration: 1000 });
}, []);
return (
  <View style={styles.container}>
    <MapView
      ref={mapRef}
      style={styles.map}
      initialCamera={{
        center: {
          latitude: 33.1096996205575,
          longitude: -96.66076983204718,
        },
        pitch: 0,
        heading: 0,
        altitude: 1500,
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
        (currentFloor === 1 && firstFloorCoordinates.includes(point)) ||
        (currentFloor === 2 && secondFloorCoordinates.includes(point))
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
    {(() => {
      const { location } = useContext(LocationContext);
      
      const distance = useMemo(() => {
        if (!location?.coords) return null;
        return calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          33.1096996205575,
          -96.66076983204718
        );
      }, [location]);
    
      // Check if email matches rishi.nigam@student.allenisd.org (case-insensitive)
      const isRishiEmail = typeof email === "string" && email.trim().toUpperCase() === "RISHI.NIGAM@STUDENT.ALLENISD.ORG";
      
      if (distance === null || distance > 10000000) {
        return (
          <View style={styles.distanceOverlay}>
            <Text style={styles.distanceOverlayText}>
              Please enable location services in settings and reopen the app.
            </Text>
          </View>
        );
      }
    
      // Use different distance threshold based on email
      const distanceThreshold = isRishiEmail ? 10000000000000 : 1000;
    
      if (distance > distanceThreshold) {
        return (
          <View style={styles.distanceOverlay}>
            <Text style={styles.distanceOverlayText}>
              Please move closer to the building to use this feature.
              {'\n'}You are {Math.round(distance / 1609)} miles away.
            </Text>
          </View>
        );
      }
    
      return null;
    })()}

      {/* {showHistory && (
        <View style={styles.historyContainer}>
          {searchHistory.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleSearch(item.query)}>
              <Text style={styles.historyItem}>{item.query}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )} */}
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
    {hasPermission === false && (
  <View style={styles.permissionOverlay}>
    <View style={styles.permissionMessageContainer}>
      <Text style={styles.permissionMessageText}>
        Location permission is required to use this feature
      </Text>
      <TouchableOpacity 
        style={styles.permissionButton} 
        onPress={async () => {
          const granted = await requestPermissions();
          if (granted) {
            // Permission granted, update location
            await updateLocation();
          }
        }}
      >
        <Text style={styles.permissionButtonText}>Allow Location Access</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.permissionButton, { marginTop: 10, backgroundColor: '#FF3B30' }]}
        onPress={() => {
          // Open app settings so user can enable permissions
          Linking.openSettings();
        }}
      >
        <Text style={styles.permissionButtonText}>Open Settings</Text>
      </TouchableOpacity>
    </View>
  </View>
)}
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

// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
// import Svg, { Line, Circle, Text as SvgText, G } from 'react-native-svg';

// const MAP_WIDTH = 320;
// const MAP_HEIGHT = 640;

// // Floor configuration
// const floors = {
//   1: {
//     points: [
//       { id: 'A', x: -100, y: 200 },
//       { id: 'B', x: 100, y: 200 },
//       { id: 'C', x: 100, y: -200 },
//       { id: 'D', x: -100, y: -200 },
//       { id: 'E', x: 0, y: 0 }
//     ],
//     lines: [
//       { from: 'A', to: 'B' },
//       { from: 'B', to: 'C' },
//       { from: 'C', to: 'D' },
//       { from: 'D', to: 'A' },
//       { from: 'E', to: 'A' },
//       { from: 'E', to: 'B' },
//       { from: 'E', to: 'C' },
//       { from: 'E', to: 'D' }
//     ]
//   },
//   2: {
//     points: [
//       { id: 'F', x: 0, y: 150 },
//       { id: 'G', x: 100, y: -150 },
//       { id: 'H', x: -100, y: -150 },
//     ],
//     lines: [
//       { from: 'F', to: 'G' },
//       { from: 'G', to: 'H' },
//       { from: 'H', to: 'F' },
//     ]
//   }
// };

// // Pathfinding functions
// function buildWeightedGraph(lines, points) {
//   const graph = {};
//   const pointMap = Object.fromEntries(points.map(p => [p.id, p]));

//   lines.forEach(line => {
//     const fromPoint = pointMap[line.from];
//     const toPoint = pointMap[line.to];
    
//     const dx = fromPoint.x - toPoint.x;
//     const dy = fromPoint.y - toPoint.y;
//     const distance = Math.sqrt(dx * dx + dy * dy);

//     if (!graph[line.from]) graph[line.from] = [];
//     if (!graph[line.to]) graph[line.to] = [];
    
//     graph[line.from].push({ id: line.to, distance });
//     graph[line.to].push({ id: line.from, distance });
//   });
  
//   return graph;
// }

// function findShortestPath(graph, start, end) {
//   const distances = {};
//   const previous = {};
//   const unvisited = new Set();

//   Object.keys(graph).forEach(node => {
//     distances[node] = Infinity;
//     unvisited.add(node);
//   });
//   distances[start] = 0;

//   while (unvisited.size > 0) {
//     const current = Array.from(unvisited).reduce((minNode, node) => 
//       distances[node] < distances[minNode] ? node : minNode
//     );

//     if (current === end) break;
//     unvisited.delete(current);

//     graph[current].forEach(neighbor => {
//       const alt = distances[current] + neighbor.distance;
//       if (alt < distances[neighbor.id]) {
//         distances[neighbor.id] = alt;
//         previous[neighbor.id] = current;
//       }
//     });
//   }

//   const path = [];
//   let current = end;
//   while (current !== undefined) {
//     path.unshift(current);
//     current = previous[current];
//   }

//   return path.length > 1 ? path : null;
// }

// // Navigation functions
// function getRouteSegments(route, points) {
//   const segments = [];
//   if (route.length < 2) return segments;

//   let currentSegment = [route[0]];
  
//   for (let i = 1; i < route.length; i++) {
//     currentSegment.push(route[i]);
//     if (i === route.length - 1) {
//       segments.push(currentSegment);
//     }
//   }
  
//   return segments;
// }

// export default function MapScreen() {
//   const [currentFloor, setCurrentFloor] = useState(1);
//   const [startInput, setStartInput] = useState('');
//   const [endInput, setEndInput] = useState('');
//   const [route, setRoute] = useState([]);
//   const [error, setError] = useState('');
//   const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
//   const [rotationAngle, setRotationAngle] = useState(0);
//   const [userPosition, setUserPosition] = useState(null);

//   const { points, lines } = floors[currentFloor];
//   const floorOnePoints = floors[1].points;
//   const routeSegments = getRouteSegments(route, floorOnePoints);

//   useEffect(() => {
//     if (route.length > 0) {
//       setCurrentSegmentIndex(0);
//       updateRotationAndPosition(0);
//     }
//   }, [route]);

//   const validatePoint = (input) => {
//     return floorOnePoints.some(p => p.id === input.toUpperCase());
//   };

//   const calculateRoute = () => {
//     setError('');
//     const start = startInput.toUpperCase();
//     const end = endInput.toUpperCase();
    
//     if (!validatePoint(start) || !validatePoint(end)) {
//       setError('Invalid point ID');
//       return;
//     }
  
//     if (start === end) {
//       setError('Start and end points are the same');
//       setRoute([]);
//       return;
//     }
  
//     const graph = buildWeightedGraph(floors[1].lines, floors[1].points);
//     const path = findShortestPath(graph, start, end);
    
//     if (!path) {
//       setError('No path found');
//       setRoute([]);
//       return;
//     }
    
//     setRoute(path);
//   };

//   const updateRotationAndPosition = (segmentIndex) => {
//     if (routeSegments[segmentIndex]) {
//       const segment = routeSegments[segmentIndex];
//       const startPoint = floors[1].points.find(p => p.id === segment[0]);
//       const endPoint = floors[1].points.find(p => p.id === segment[segment.length - 1]);
      
//       const dx = endPoint.x - startPoint.x;
//       const dy = endPoint.y - startPoint.y;
//       const angle = Math.atan2(dy, dx) * (180 / Math.PI);
//       setRotationAngle(-angle + 90);
      
//       setUserPosition(startPoint);
//     }
//   };

//   const handleEndSegment = () => {
//     if (currentSegmentIndex < routeSegments.length - 1) {
//       const newIndex = currentSegmentIndex + 1;
//       setCurrentSegmentIndex(newIndex);
//       updateRotationAndPosition(newIndex);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity 
//         style={styles.floorButton} 
//         onPress={() => setCurrentFloor(p => p === 1 ? 2 : 1)}
//       >
//         <Text style={styles.buttonText}>Switch to Floor {currentFloor === 1 ? 2 : 1}</Text>
//       </TouchableOpacity>

//       <View style={styles.mapContainer}>
//         <View style={styles.mapBackground}>
//           <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
//             <G
//               rotation={rotationAngle}
//               origin={`${MAP_WIDTH/2}, ${MAP_HEIGHT/2}`}
//             >
//               {/* Base lines */}
//               {lines.map((line, i) => {
//                 const from = points.find(p => p.id === line.from);
//                 const to = points.find(p => p.id === line.to);
//                 const start = convertCoordinate(from.x, from.y, MAP_WIDTH, MAP_HEIGHT);
//                 const end = convertCoordinate(to.x, to.y, MAP_WIDTH, MAP_HEIGHT);
                
//                 return (
//                   <Line
//                     key={`line-${i}`}
//                     stroke="#fff"
//                     strokeWidth="2"
//                     x1={start.x}
//                     y1={start.y}
//                     x2={end.x}
//                     y2={end.y}
//                   />
//                 );
//               })}

//               {/* Full route */}
//               {routeSegments.map((segment, i) => (
//                 segment.slice(1).map((pointId, j) => {
//                   const prevPoint = floorOnePoints.find(p => p.id === segment[j]);
//                   const currentPoint = floorOnePoints.find(p => p.id === pointId);
//                   const start = convertCoordinate(prevPoint.x, prevPoint.y, MAP_WIDTH, MAP_HEIGHT);
//                   const end = convertCoordinate(currentPoint.x, currentPoint.y, MAP_WIDTH, MAP_HEIGHT);

//                   return (
//                     <Line
//                       key={`route-${i}-${j}`}
//                       stroke="#666"
//                       strokeWidth="4"
//                       x1={start.x}
//                       y1={start.y}
//                       x2={end.x}
//                       y2={end.y}
//                     />
//                   );
//                 })
//               ))}

//               {/* Active segment */}
//               {routeSegments[currentSegmentIndex]?.slice(1).map((pointId, j) => {
//                 const prevPoint = floorOnePoints.find(p => p.id === routeSegments[currentSegmentIndex][j]);
//                 const currentPoint = floorOnePoints.find(p => p.id === pointId);
//                 const start = convertCoordinate(prevPoint.x, prevPoint.y, MAP_WIDTH, MAP_HEIGHT);
//                 const end = convertCoordinate(currentPoint.x, currentPoint.y, MAP_WIDTH, MAP_HEIGHT);

//                 return (
//                   <Line
//                     key={`active-${j}`}
//                     stroke="#00f"
//                     strokeWidth="4"
//                     x1={start.x}
//                     y1={start.y}
//                     x2={end.x}
//                     y2={end.y}
//                   />
//                 );
//               })}

//               {/* User position */}
//               {userPosition && (
//                 <Circle
//                   cx={convertCoordinate(userPosition.x, userPosition.y, MAP_WIDTH, MAP_HEIGHT).x}
//                   cy={convertCoordinate(userPosition.x, userPosition.y, MAP_WIDTH, MAP_HEIGHT).y}
//                   r="8"
//                   fill="#00f"
//                   stroke="#fff"
//                   strokeWidth="2"
//                 />
//               )}

//               {/* Points and labels */}
//               {points.map((point, i) => {
//                 const coord = convertCoordinate(point.x, point.y, MAP_WIDTH, MAP_HEIGHT);
//                 return (
//                   <React.Fragment key={`point-${i}`}>
//                     <Circle cx={coord.x} cy={coord.y} r="5" fill="#fff" />
//                     <SvgText
//                       x={coord.x + 8}
//                       y={coord.y - 8}
//                       fill="#fff"
//                       fontSize="12"
//                       fontWeight="bold"
//                     >
//                       {point.id}
//                     </SvgText>
//                   </React.Fragment>
//                 );
//               })}
//             </G>
//           </Svg>
//         </View>
//       </View>

//       {/* Controls */}
//       <View style={styles.controls}>
//         <Text style={styles.label}>Start Point:</Text>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Enter start (A-E)"
//           value={startInput}
//           onChangeText={text => setStartInput(text.toUpperCase())}
//           maxLength={1}
//           autoCapitalize="characters"
//         />

//         <Text style={styles.label}>End Point:</Text>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Enter end (A-E)"
//           value={endInput}
//           onChangeText={text => setEndInput(text.toUpperCase())}
//           maxLength={1}
//           autoCapitalize="characters"
//         />

//         {error ? <Text style={styles.errorText}>{error}</Text> : null}

//         <TouchableOpacity
//           style={[styles.searchButton, (!startInput || !endInput) && styles.disabledButton]}
//           onPress={calculateRoute}
//           disabled={!startInput || !endInput}
//         >
//           <Text style={styles.buttonText}>Find Route</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.segmentButton, !route.length && styles.disabledButton]}
//           onPress={handleEndSegment}
//           disabled={!route.length}
//         >
//           <Text style={styles.buttonText}>Next Segment</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // utils.js
// export const convertCoordinate = (x, y, containerWidth, containerHeight) => {
//   return {
//     x: (x + containerWidth/2),
//     y: (containerHeight/2 - y)
//   };
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingTop: 50
//   },
//   mapContainer: {
//     width: 320,
//     height: 640,
//     alignSelf: 'center',
//     marginTop: 20
//   },
//   mapBackground: {
//     flex: 1,
//     backgroundColor: 'black',
//     borderRadius: 8
//   },
//   floorButton: {
//     position: 'absolute',
//     top: 10,
//     alignSelf: 'center',
//     backgroundColor: '#2196F3',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     zIndex: 1
//   },
//   controls: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(51, 51, 51, 0.9)',
//     borderRadius: 10,
//     padding: 15
//   },
//   searchInput: {
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 15,
//     fontSize: 16
//   },
//   searchButton: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center'
//   },
//   segmentButton: {
//     backgroundColor: '#FF5722',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10
//   },
//   disabledButton: {
//     opacity: 0.5
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16
//   },
//   label: {
//     color: '#fff',
//     marginBottom: 5,
//     fontWeight: 'bold'
//   },
//   errorText: {
//     color: '#ff4444',
//     textAlign: 'center',
//     marginBottom: 10
//   }
// });

