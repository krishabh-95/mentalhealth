import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, AsyncStorage, Image, ScrollView, Modal } from 'react-native';
// import { NavigationContainer, StackActions, useNavigation } from '@react-navigation/native';
//import OptionsStackNavigator from './OptionsStackNavigator.js';
// import {createStackNavigator} from '@react-navigation/stack';
import EmergencyContact from './EmergencyContact.js';
import AccountDetails from './AccountDetails.js';
import NotificationSettings from './NotificationSettings.js';



function SettingsScreen({route, navigation}) {

    //Creating our list of functions that will be used on the settings screen

    const logout = async(properties) => {
        console.log("Going to logout");
        await AsyncStorage.removeItem("USER_ID");
        properties.setState({page: 'logout'});
    };

    const [showSettingsList, setShowSettingsList] = useState(true)
    const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)
    const [showAccountDetails, setShowAccountDetails] = useState(false)
    const [showNotificationSettings, setShowNotificationSettings] = useState(false)



    useEffect(()=> {
        if(showEmergencyContacts || showAccountDetails || showNotificationSettings){
            setShowSettingsList(false)
        } else{
            setShowSettingsList(true)
        }
        
        // if(showAccountDetails){
        //     setShowSettingsList(false)
        // } else{
        //     setShowSettingsList(true)
        // }

        // if(showNotificationSettings){
        //     setShowSettingsList(false)
        // } else{
        //     setShowSettingsList(true)
        // }

    })

    let name = 'Goomby'
    var { object, otherParam } = route.params;

//This is what is coming out on the screen
    return (
        <>

            {showSettingsList ? 
                <ScrollView>

                    <TouchableOpacity style={styles.buttonStyleNoBorder} onPress={() => setShowAccountDetails(true)}>
                        <Text style={styles.buttonText}>Account Details</Text>
                        <Text style={styles.subtitles}>View and edit your profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle} onPress={() => setShowEmergencyContacts(true)}>
                        <Text style={styles.buttonText}>Emergency Contacts</Text>
                        <Text style={styles.subtitles}>Edit your contacts</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyleNoBorder} onPress={() => setShowNotificationSettings(true)}>
                        <Text style={styles.buttonText}>Notification Settings</Text>
                        <Text style={styles.subtitles}>Customise alerts and popups</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.logoutButtonStyle} onPress={() => logout(object)}>
                        <Text style={styles.logoutText}>Logout</Text>
                    
                    </TouchableOpacity>

                    
                </ScrollView>
            : null}

            {showEmergencyContacts ? 
                <EmergencyContact 
                    name={name}
                    onBackClick={() => setShowEmergencyContacts(false)}
                />
            : null}
            {showAccountDetails ? 
                <AccountDetails
                    name={name}
                    onBackClick={() => setShowAccountDetails(false)}
                />
            : null}
            {showNotificationSettings ? 
                <NotificationSettings
                    name={name}
                    onBackClick={() => setShowNotificationSettings(false)}
                />
            : null}
        </>
    );
}



export default SettingsScreen;



const styles = StyleSheet.create({
    textStyle: {
    fontSize: 25,
    marginTop: 50,
    padding: 10,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    color: "blue",
    },
    
    buttonStyle: {
        paddingHorizontal: 10,
        paddingBottom: 50,
        paddingTop: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
  
    },

    logoutButtonStyle: {
        paddingHorizontal: 10,
        paddingBottom: 50,
        paddingTop: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor:'##ff1904',
        opacity:0.8,
  
    },

    buttonStyleNoBorder: {
        paddingHorizontal: 10,
        paddingBottom: 35,
        paddingTop: 35,
        width: '100%',
        // borderWidth: 1,
        // borderColor: '#000',
        

    },

    buttonText:{
        textAlign: 'left',
        marginLeft: 10,
        fontWeight:'600',
        paddingBottom: 5,
        fontSize:18,
    },

    logoutText:{
        textAlign: 'left',
        marginLeft: 10,
        fontWeight:'600',
        paddingBottom: 5,
        fontSize:18,
        color: 'black',
    },

    subtitles:{
        marginLeft:10,
    }


   


});