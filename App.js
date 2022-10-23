import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, AsyncStorage, Image, TouchableOpacity, TextInput } from 'react-native';
import HomePage from './HomePage.js';
import SignUp from './SignUp.js';
import ForgotPass from './ForgotPass.js';
import db from './AddData.js';
import { collection, getDocs, query, where } from "firebase/firestore";
import * as Notifications from "expo-notifications";

function Credentials(props)
{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.inputParent}>
    <TextInput style={styles.input} placeholder="Email ID" placeholderTextColor="purple" onChangeText={(email) => setEmail(email)}/>
    <TextInput style={styles.input} secureTextEntry={true} placeholder="Password" placeholderTextColor="purple" onChangeText={(password) => setPassword(password)}/>
    <TouchableOpacity style={styles.buttonStyle} onPress={() => props.object.login(email, password)}>
        <Text style={{fontWeight: "bold", fontSize: 25, alignContent: 'center', color: "white"}}>Login</Text>
    </TouchableOpacity>
    </View>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class App extends React.Component
{
  constructor()
  {
    super();
    this.state = {page: "default"};//This state variable is used to determine if a user is already logged in or not when the app is opened
  }

  fetchLoginId = async() => {
    try
    {
      let userId =  await AsyncStorage.getItem("USER_ID");

      if(userId!==null)
      {
        this.setState({page: "home_page"});
      }
    } catch(error)
    {
      console.log(error);
    }
  }

  login = async(email, password) => {
    const data = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(data);
    let userId = null;
    let valid = false;
    querySnapshot.forEach((doc) => {
      userId= doc.id;
      if(doc.data().password !== null)
      {
        if(password === doc.data().password)
          valid= true;
      }   
    });

    if(!valid)
    {
      //Invalid credentails have been entered
      alert("Please enter valid credentails to log in!");
      return;
    }

    await AsyncStorage.setItem("USER_ID", userId.toString());
    this.setState({page: "home_page"});
  }

  componentWillUnmount()
  {
    console.log("The component App is going to unmount!");
  }

  updateState = (status) => {
    this.setState({page: status});
  }

  render()
  {    
    if(this.state.page==="default")
    {
      this.fetchLoginId();
      return (
        <View style={styles.container}>
          <Image style={styles.logoStyle} source={require("./assets/logo.png")}/>
          <Credentials object={this}/>
          <TouchableOpacity style={styles.forgotPassword} onPress={() => this.updateState("forgot_pass")}>
          <Text style={{fontSize: 15, alignContent: 'center'}}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUp} onPress={() => this.updateState("signup")}>
          <Text style={{fontSize: 15, color: 'black'}}>Don't have an account? </Text>
          <Text style={{fontSize: 15, color: 'blue', fontWeight: 'bold'}}>Signup</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if(this.state.page==="signup")
      return <SignUp/>;
    else if(this.state.page==="forgot_pass")
      return <ForgotPass/>;
    else
     return <HomePage/>; 
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  logoStyle: {
    flex: 5,
    width: "80%",
    resizeMode: 'contain',
  },
  inputParent: {
    flex: 2,
    padding: 20,
    justifyContent:"center",
  },
  input: {
    width: 250,
    alignItems: 'center', 
    borderWidth: 1,
    height: 60,
    marginTop: 10,
    fontSize: 17,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#d3d3d3",
  },
  buttonStyle: {
    padding: 15,
    marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: 250,
    justifyContent: "center",
    backgroundColor: "blue",
  },
  forgotPassword: {
    flex: 1,
    marginTop: 5,
    alignItems: 'center',
    width: "50%",
    padding: 10,
  },
  signUp: {
    flex: 1,
    alignItems: 'center',
    width: "80%",
    padding: 10,
  }
});
