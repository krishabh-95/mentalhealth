import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import db from './AddData.js';
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

function HeartInfo(props)
{
  return (
    props.values.heartbeat.map((value, ind) => { 
     return (<Text style={{fontSize: 15}} key={ind}>{value} bpm</Text>);
   })
 );
}

function HeartRate() {
  const devices = ['Apple Smartwatch','Google Fitbit'];
  var [heartInfo, setHeartinfo] = useState(null);

  const addDeviceToDB = async(item) => {
    let userId = await AsyncStorage.getItem("USER_ID");
    await setDoc(doc(db, "heart_rate_device", userId.toString()), {
      device: item
   });

    alert("Device configured successfully!");
  };
  
  const configureDevice = (item) => {
    console.log("Going to configure device "+item);
    addDeviceToDB(item);
  };

  let heartRateInfo = null, hbHead = null;

  const getHeartRateInfo = async() => {
    const querySnapshot = await getDocs(collection(db, "heart_rate"));
    let maxId = AsyncStorage.getItem("USER_ID");
    querySnapshot.forEach((doc) => {
        if(!isNaN(doc.id.trim()) && maxId === parseInt(doc.id.trim()))
        {
          setHeartinfo(doc.data());
        }
    });
  };

  getHeartRateInfo();
  if(heartInfo!==null)
    hbHead = <Text style={{fontWeight:'bold', fontSize: 20, color:'red'}}>Your heart rate information:</Text>
  if(heartInfo!==null)
    heartRateInfo=<HeartInfo values = {heartInfo}/>
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.textStyle}>Choose device from which the heart rate needs to be fetched:</Text>
      <SelectDropdown data={devices} onSelect={(selectedItem, index) => configureDevice(selectedItem)}	buttonTextAfterSelection={(selectedItem, index) => {
        // text represented after item is selected
        // if data array is an array of objects then return selectedItem.property to render after item is selected
        return selectedItem
      }}
      defaultButtonText={'Choose a device'}
      buttonStyle={styles.dropdown4BtnStyle}
      renderDropdownIcon={isOpened => {
        return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
      }}
      rowTextForSelection={(item, index) => {
        // text represented for each item in dropdown
        // if data array is an array of objects then return item.property to represent item in dropdown
        return item
      }}
    />
    {hbHead}
    {heartRateInfo}
    </View>
  );  
}

export default HeartRate;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    marginTop: 40,
    padding: 10,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    color: "blue",
  },
  dropdown4BtnStyle: {
    width: '50%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  }
});