import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, AsyncStorage, Image, ScrollView } from 'react-native';
import App from './App';
import db from './AddData.js';
import { collection, getDocs, setDoc, doc, aggregateQuerySnapshotEqual } from "firebase/firestore";
import storage from './CloudStorage.js';

let AccountDetails = (props) => {

    let [accountData,setAccountData] = useState([])

    const [name, setName] = useState(name);
    const [email, setEmail] = useState(email);
    const [password, setPhoneNumber] = useState(password);
    const [userType, setUserType] = useState(userType);


    useEffect(() => {
        getAccountDetails()
    },[])

    getAccountDetails = async() => {
        console.log("YOUR USER ID: " ,await AsyncStorage.getItem("USER_ID"))
        let user_id = await AsyncStorage.getItem("USER_ID")
        let user = {}
        try{
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                if(doc.id == user_id)
                {
                    console.log(doc.data())
                    user = doc.data()
                }
            });

        }catch(error){
            console.log(error)
        }
    }





    return (
        <>
        <ScrollView>
            <Text style={styles.titleText}>Profile</Text>

           


            {accountData.length > 0 ?
                accountData.map((item, item_index) => {
                return (<>
                    <View style={styles.contactBox}>
                        <Text style={styles.contactTitleStyle}>Profile</Text>
                        <Text style={styles.textStyle}>Name: {item.name}</Text>
                        <Text style={styles.textStyle}>Email: {item.email}</Text>
                        <Text style={styles.textStyle}>Password: {item.password}</Text>
                        <Text style={styles.textStyle}>User Type: {item.userType}</Text>
                    </View>
                </>)
            })
            
            : null}

             
            {/* <Text style={styles.titleSecondText}>Add New Emergency Contact</Text> 
            <View styles={styles.inputParent}>
                <TextInput style={styles.input} in='input' placeholder="Name" placeholderTextColor="black" onChangeText={(name) => setName(name)}/>
                <TextInput style={styles.input} id='input' placeholder="Email ID" placeholderTextColor="black" onChangeText={(mail) => setEmail(mail)}/>
                <TextInput style={styles.input} id='input' placeholder="Phone Number" placeholderTextColor="black" onChangeText={(phone) => setPhoneNumber(phone)}/>

                <Text style={{fontSize: 16, textAlign:'left', marginHorizontal:10, color: "black"}}>{successText}</Text>

                <TouchableOpacity style={styles.buttonStyle} onPress={() => setEmergencyContact(name, email, phoneNumber)} >
                <Text style={styles.buttonAddStyle}>Add New Contact</Text>
                </TouchableOpacity>
                
            </View>
            <TouchableOpacity onPress={() => props.onBackClick()}>
                <Text style={styles.buttonBack}> Back </Text>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => props.onBackClick()}>
                <Text style={styles.buttonBack}> Back </Text>
            </TouchableOpacity>
        </ScrollView>
        </>
    )
}









export default AccountDetails;


const styles = StyleSheet.create({
    textStyle: {
    fontSize: 14,
    marginTop: 3,
    textAlign: 'left',
    marginLeft: 4,
    opacity: 0.8,
    
    },
    
    buttonAddStyle: {
        padding: 10,
        marginHorizontal: 10,
        marginTop:5,
        marginBottom: 5,
        borderRadius: 8,
        alignItems: 'center',
        // width: 70,
        backgroundColor: "red",
        color: 'white',
        textAlign: 'center',
        fontWeight: '700',
      
    },
    buttonBack: {
        padding: 10,
        marginHorizontal: 10,
        marginBottom:10,
        marginTop:5, 
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: "red",
        color: 'white',
        textAlign: 'center',
        fontWeight: '700',
    },
    titleText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'blue', 
        fontSize: 27,
        marginTop: 15,
        marginBottom: 15,

    },
    titleSecondText: {
        textAlign: 'left',
        fontWeight: 'bold',
        color: 'blue', 
        fontSize: 21,
        marginTop: 15,
        marginBottom: 4,
        marginHorizontal: 10,

    },
    contactTitleStyle: {
        fontWeight: "bold", 
        fontSize: 18, 
        textAlign: 'left', 
        color: "blue",
        opacity: 0.65,
        marginHorizontal: 4,
        marginTop: 3,

    },

    contactBox: {
        margin: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        textAlign: 'left',
        borderColor: '#000',

    },


    input:{
        fontSize: 13,
        fontWeight: '500',
        opacity: 0.6,
        marginHorizontal: 10,
        margin: 10,
        paddingHorizontal: 10,
        paddingBottom: 4,
        borderRadius: 5,
        borderWidth: 1,
        textAlign: 'left',
        borderColor: '#000',
        width: 200,
    },

    success: {

    }




});