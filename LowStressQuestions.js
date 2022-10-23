import React, { useState } from "react";

import { Text, TextInput, View , Button, SafeAreaView, AsyncStorage} from "react-native";

import { StyleSheet } from "react-native";
import db from './AddData.js';
import { collection, getDocs, setDoc, doc } from "firebase/firestore";



const LowStressQuestions = () => {

  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");

  const uploadAnswers = (q1,q2,q3,q4,q5) => {
    if(q1==="" || q2==="" || q3==="" || q4==="" || q5==="")
    {
        alert("Please answer all the questions.");
        return;
    }

    addAnswersToDB(q1,q2,q3,q4,q5);
  };

  const addAnswersToDB = async(q1,q2,q3,q4,q5) => {
    try
    {
        const userId = await AsyncStorage.getItem("USER_ID");
        
        await setDoc(doc(db, "lowStressQuestions", userId.toString()), {
            q1: q1,
            q2: q2,
            q3: q3,
            q4: q4,
            q5: q5
        });
        
        alert("Answers uploaded successfully!");
        
    } catch(error)
    {
        console.log(error);
        alert('Network issue. Please check your internet connectivity.');
    }
  };

  const setQ1Data = (val) =>
  {
    console.log("Going to set the value of Q1");
    setQ1(val);
    console.log("Value is ",q1);
    console.log('Q2 is',q2);
    this.StyleSheet = StyleSheet.create({color: 'red'});
  }

  return (

    <SafeAreaView>

     <Text style={{ fontWeight: 'bold', color: 'blue', fontSize: 20, textAlign: 'center' }}>STRESS LEVEL - LOW</Text>

      <Text style={styles.text}> Do you feel miserable or unhappy? </Text>

      <View style={styles.fixToText}>
     <Button
          value="Yes"
          id="Yes"
          title="Yes"
          onPress={() => setQ1Data("Yes")}
        />
        <Button
          value="No"
          id="No"
          title="No"
          onPress={() => setQ1Data("No")}
          
        />
        </View>

      <Text style={styles.text}> How often do you go out with family or friends?</Text>

      <View style={styles.fixToText}>
     <Button
          value="Rarely"
          id="Rarely"
          title="Rarely"
          onPress={() => setQ2("Rarely")}
        />
        <Button
          value="Sometimes"
          id="Sometimes"
          title="Sometimes"
          onPress={() => setQ2("Sometimes")}
        />
        </View>

      <Text style={styles.text}>  Do you feel restless throughout the day?</Text>

      <View style={styles.fixToText}>
     <Button
          value="Yes"
          id="Yes"
          title="Yes"
          onPress={() => setQ3("Yes")}
        />
        <Button
          value="No"
          id="No"
          title="No"
          onPress={() => setQ3("No")}
        />
        </View>

      <Text style={styles.text}>  Is it hard for you to concentrate on your work?

</Text>

<View style={styles.fixToText}>
     <Button
          value="Yes"
          id="Yes"
          title="Yes"
          onPress={() => setQ4("Yes")}
        />
        <Button
          value="No"
          id="No"
          title="No"
          onPress={() => setQ4("No")}
        />
        </View>

      <Text style={styles.text}> Do you feel like nobody loves you?


</Text>

<View style={styles.fixToText}>
     <Button
          value="Rarely"
          id="Rarely"
          title="Rarely"
          onPress={() => setQ5("Rarely")}
        />
        <Button
          value="Occasionally"
          id="Occasionally"
          title="Occasionally"
          onPress={() => setQ5("Occasionally")}
        />
        </View>
      <Button

        title="Submit"

        color="blue"

        onPress={() => uploadAnswers(q1,q2,q3,q4,q5)}

      />

    </SafeAreaView>

  );

};



const styles = StyleSheet.create({

  input: {

    height: 12,

    margin: 5,

    borderWidth: 0.5,

    padding: 12,

    backgroundColor: "#DDDDDD",

  },



  text:{

    marginTop:15

  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

});



export default LowStressQuestions;