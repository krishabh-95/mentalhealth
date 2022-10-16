import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import App from './App';
import db from './AddData.js';
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

function InputForm(props)
{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [userType, setType] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    return (
        <View styles={styles.inputParent}>
            <TextInput style={styles.input} placeholder="Name" placeholderTextColor="purple" onChangeText={(name) => setName(name)}/>
            <TextInput style={styles.input} placeholder="Email ID" placeholderTextColor="purple" onChangeText={(mail) => setEmail(mail)}/>
            <TextInput style={styles.input} placeholder="User Type" placeholderTextColor="purple" onChangeText={(type) => setType(type)}/>
            <TextInput style={styles.input} secureTextEntry={true} placeholder="Password" placeholderTextColor="purple" onChangeText={(pass) => setPassword(pass)}/>
            <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter the password again" placeholderTextColor="purple" onChangeText={(pass2) => setPassword2(pass2)}/>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => pushData(name, email, userType, password, password2, props)}>
            <Text style={{fontWeight: "bold", fontSize: 25, alignContent: 'center', color: "white"}}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPassword}>
            <Text style={{fontSize: 17, alignContent: 'center', fontWeight: 'bold'}} onPress={props.object.goHome}>Go back</Text>
            </TouchableOpacity>
        </View>
    );
}

function pushData(name, email, userType, password, password2, props)
{
    if(name==="")
    {
        alert("Please enter your name.");
        return;
    }
    
    if(email==="")
    {
        alert("Please enter your email ID.");
        return;
    }

    if(!/\S+@\S+\.\S+/.test(email))
    {
        alert("Please enter a valid email ID.");
        return;
    }

    if(userType==="")
    {
        alert("Please enter your user type.");
        return;
    }

    if(userType!=="Admin" &&  userType!=="Guest")
    {
        alert("The user type can either be \"Admin\" or \"Guest\"");
        return;
    }

    if(password==="")
    {
        alert("Please enter a password.");
        return;
    }

    if(password2 === "")
    {
        alert("Please enter the same password again.");
        return;
    }

    if(password!==password2)
    {
        alert("Please enter the same password in both the fields.");
        return;
    }

    getUsersInfoAndAddData(name, email, userType, password, props);
}

getUsersInfoAndAddData = async(name, email, userType, password, props) => {
    try
    {
        const querySnapshot = await getDocs(collection(db, "users"));
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

        await setDoc(doc(db, "users", maxId.toString()), {
            name: name,
            email: email,
            userType: userType,
            password: password
        });
        
        await AsyncStorage.setItem("USER_ID", maxId.toString());
        props.object.setState({page: 'go_home'});
    } catch(error)
    {
        console.log(error);
    }
}

//This is the component that will be rendered when a new user tries to sign up
class SignUp extends React.Component {     
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
                    <Text style={{fontWeight:'bold', color:'blue', fontSize: 25, marginTop: 10}}>Create account</Text>
                    <InputForm object={this}/>
                </View>
            );
        }
        else if(this.state.page==='go_home')
            return <App/>;
    }
  
}

export default SignUp;

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
