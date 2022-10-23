import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import App from './App';
import db from './AddData.js';
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import email from 'react-native-email'; 

function InputForm(props)
{
    const [name, setName] = useState("");

    return (
        <View styles={styles.inputParent}>
            <TextInput style={styles.input} placeholder="Enter your email ID" placeholderTextColor="purple" onChangeText={(name) => setName(name)}/>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => pushData(name, props)}>
            <Text style={{fontWeight: "bold", fontSize: 25, alignContent: 'center', color: "white"}}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPassword}>
            <Text style={{fontSize: 17, alignContent: 'center', fontWeight: 'bold'}} onPress={props.object.goHome}>Go back</Text>
            </TouchableOpacity>
        </View>
    );
}

function pushData(name, props)
{
    if(name==="")
    {
        alert("Please enter your email ID.");
        return;
    }
    
    getUsersInfoAndAddData(name, props);
}

sendEmail = async(mail) => {
    console.log("Going to send an email to reset password.");
    console.log(mail);
    const to = [mail]; // string or array of email addresses
    email(to, {
        subject: 'Password has been reset!',
        body: 'Your password has been reset. Your new password is: test',
        checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
    
  }

getUsersInfoAndAddData = async(mail, props) => {
    try
    {
        const querySnapshot = await getDocs(collection(db, "users"));
        let maxId = 0;
        let name = "", uType= "", pass ="";
        querySnapshot.forEach((doc) => {
            if(!isNaN(doc.id.trim()))
            {
                if(doc.data().email === mail)
                {
                    maxId = parseInt(doc.id.trim());
                    name = doc.data().name;
                    uType = doc.data().userType;
                    pass = doc.data().password;
                }
            }
        });
        
        console.log("The ID is "+maxId);

        if(maxId !== 0)
        {
            await setDoc(doc(db, "users", maxId.toString()), {
                name: name,
                email: mail,
                userType: uType,
                password: "test"
            });

            console.log("Password has been reset. Going to send the mail!");

            sendEmail(mail);
        }
        
        //await AsyncStorage.setItem("USER_ID", maxId.toString());
        props.object.setState({page: 'go_home'});
    } catch(error)
    {
        console.log(error);
    }
}

//This is the component that will be rendered when a new user tries to sign up
class ForgotPass extends React.Component {     
    constructor()
    {
        super();
        this.state = {page: 'default'};
    }
    
    goHome = () => {
        this.setState({page: 'go_home'});
    }

    render()
    {   
        //addData();

        if(this.state.page==='default')
        {
            return (
                <View style={styles.container}>
                    <Image style={styles.logoStyle} source={require("./assets/logo.png")}/>
                    <Text style={{fontWeight:'bold', color:'blue', fontSize: 25, marginTop: 10}}>Reset password</Text>
                    <InputForm object={this}/>
                </View>
            );
        }
        else if(this.state.page==='go_home')
            return <App/>;
    }
  
}

export default ForgotPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyle: {
    flex: 2,
    width: "80%",
    resizeMode: 'contain',
  },
  inputParent: {
    flex: 7,
    padding: 10,
    alignItems: "flex-start",
  },
  input: {
    width: 250,
    alignItems: 'center', 
    borderWidth: 1,
    height: 40,
    marginTop: 10,
    fontSize: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#d3d3d3",
  },
  buttonStyle: {
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
    width: 250,
    justifyContent: "center",
    backgroundColor: "blue",
  },
  forgotPassword: {
    alignContent: 'center',
    width: "50%",
    padding: 10,
    justifyContent: 'center',
  }
});
