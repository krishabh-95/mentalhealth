import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { Formik } from 'formik';

//This is the component that will be rendered when a new user signs up
class SignUp extends React.Component {
  render()
  {        
    return (
        <Formik>
            <View style={styles.container}>
            <StatusBar backgroundColor="#f5fffa" />
            <Text style={{fontWeight:'bold', color:'blue', fontSize: 30}}>CREATE ACCOUNT</Text>
            
    		<TextInput style={styles.input} placeholder="Name" />
            <TextInput style={styles.input} placeholder="Email ID" />
            <TextInput style={styles.input} placeholder="User Type" />
            <TextInput style={styles.input} secureTextEntry={true} placeholder="Password"/>
            <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter the password again"/>
            <Button style={{fontWeight:'bold', color:'blue', fontSize: 20}} title="Submit"/>  
            </View>
          </Formik>
        );
  }
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#f5fffa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 30,
    margin: 10,
    width: 190,
    borderWidth: 1,
    padding: 5,
  }
});
