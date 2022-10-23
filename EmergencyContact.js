import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, AsyncStorage, Image, ScrollView } from 'react-native';
import App from './App';
import db from './AddData.js';
import { collection, getDocs, setDoc, doc, aggregateQuerySnapshotEqual } from "firebase/firestore";



let EmergencyContact = (props) => {  
    
    let [emergencyContactData,setEmergencyContactData] = useState([])
    let [successText, setSuccessText] = useState("")
    
    
    const [name, setName] = useState(name);
    const [email, setEmail] = useState(email);
    const [phoneNumber, setPhoneNumber] = useState(phoneNumber);

    useEffect(() => {
        getEmergencyContacts()
    },[])

    getEmergencyContacts = async() => {
        console.log("YOUR USER ID: " ,await AsyncStorage.getItem("USER_ID"))
        console.log('getting db emergency contacts')
        try{
            let emergencyContactDocuments = await getDocs(collection(db, "emergencyContact"))
            let temp = []
            emergencyContactDocuments.forEach((doc) => {
                console.log("Doc ID: ",doc.id)
                console.log(doc.data())
                temp.push(doc.data())
            });
            setEmergencyContactData(temp)

        }catch(error){
            console.log(error)
        }
    }

    setEmergencyContact = async(name, email, phoneNumber) => {
        try{
            const querySnapshot = await getDocs(collection(db, "emergencyContact"));
            let maxId = 1;
            querySnapshot.forEach((doc) => {
                if(!isNaN(doc.id.trim()))
                {
                    if(maxId<= parseInt(doc.id.trim()))
                    {
                        maxId=parseInt(doc.id.trim())+1;
                    }
                }
            });
            console.log(maxId)

            await setDoc(doc(db, "emergencyContact", maxId.toString()), {

                user_id:await AsyncStorage.getItem("USER_ID"),
                name: name || "Name",
                email: email || "Email",
                phoneNumber: phoneNumber || "Phone"


            });
            setSuccessText("Contact successfully added, please refresh page")
            

        }catch(error){
            console.log(error)
        }

    }

    console.log(emergencyContactData)


    return (
        <>
        <ScrollView>
            <Text style={styles.titleText}>Emergency Contacts</Text>

           


            {emergencyContactData.length > 0 ?
                emergencyContactData.map((item, item_index) => {
                return (<>
                    <View style={styles.contactBox}>
                        <Text style={styles.contactTitleStyle}>Contact {item_index + 1}</Text>
                        <Text style={styles.textStyle}>Name: {item.name}</Text>
                        <Text style={styles.textStyle}>Email: {item.email}</Text>
                        <Text style={styles.textStyle}>Phone Number: {item.phoneNumber}</Text>
                    </View>
                </>)
            })
            
            : null}
            <Text style={styles.titleSecondText}>Add New Emergency Contact</Text>
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
            </TouchableOpacity>
        </ScrollView>
        </>
    )

        

    
}



export default EmergencyContact;



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