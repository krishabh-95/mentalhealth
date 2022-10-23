import React, { useState } from "react";

import { Text, TextInput, View , Button, SafeAreaView, AsyncStorage} from "react-native";

import { StyleSheet } from "react-native";
import db from './AddData.js';
import { collection, getDocs, setDoc, doc } from "firebase/firestore";


const MediumStressQuestions = () => {

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
            
            await setDoc(doc(db, "mediumStressQuestions", userId.toString()), {
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
  return (

    <SafeAreaView>

     <Text style={{ fontWeight: 'bold', color: 'blue', fontSize: 20, textAlign: 'center' }}>STRESS LEVEL - MEDIUM</Text>

     

      <Text style={styles.text}> Do you feel sick and stressed all the time?</Text>

      <View style={styles.fixToText}>
     <Button
          value="Yes"
          id="Yes"
          title="Yes"
          onPress={() => setQ1("Yes")}
        />
        <Button
          value="No"
          id="No"
          title="No"
          onPress={() => setQ1("No")}
        />
        </View>

      <Text style={styles.text}> Do you feel you are no good anymore?</Text>

      <View style={styles.fixToText}>
     <Button
          value="Yes"
          id="Yes"
          title="Yes"
          onPress={() => setQ2("Yes")}
        />
        <Button
          value="No"
          id="No"
          title="No"
          onPress={() => setQ2("No")}
        />
        </View>

      <Text style={styles.text}>  Do you feel lonely? </Text>

      <View style={styles.fixToText}>
     <Button
          value="Rarely"
          id="Rarely"
          title="Rarely"
          onPress={() => setQ3("Rarely")}
        />
        <Button
          value="Occasionally"
          id="Occasionally"
          title="Occasionally"
          onPress={() => setQ3("Occasionally")}
        />
        </View>

      <Text style={styles.text}>  Do you feel like you hate yourself?

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

      <Text style={styles.text}> Do you think you do wrong things?


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

    height: 10,

    margin: 10,

    borderWidth: 0.5,

    padding: 10,

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



export default MediumStressQuestions;