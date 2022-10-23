import React, { useState } from "react";

import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import LowStressQuestions from './LowStressQuestions.js';
import MediumStressQuestions from './MediumStressQuestions.js';
import HighStressQuestions from './HighStressQuestions.js';

const Separator = () => (

  <View style={styles.separator} />

);



const QuestionsHomePage = () => {
    var [lowStress, loadLowStress] = useState(null);
    var [mediumStress, loadMediumStress] = useState(null);
    var [highStress, loadHighStress] =useState(null);

    const setLowStress = () =>
    {
        loadLowStress(true);
        loadMediumStress(null);
        loadHighStress(null);
    };

    const setMediumStress = () =>
    {
        loadMediumStress(true);
        loadLowStress(null);
        loadHighStress(null);
    };

    const setHighStress = () =>
    {
        loadHighStress(true);
        loadLowStress(null);
        loadMediumStress(null);
    };

    if(lowStress)
    {
        //Displays the questions for users who are not that stressed out
        return <LowStressQuestions/>;
    }

    if(mediumStress)
    {
        //Displays the questions for users who are slightly stressed out
        return <MediumStressQuestions/>;
    }

    if(highStress)
    {
        //Displays the questions for users who are highly stressed out
        return <HighStressQuestions/>;
    }

  return (

    <View style={styles.container}>

      <View style={styles.heading}>

        <Text style={{ fontWeight: 'bold', color: 'blue', fontSize: 28 }}>STRESS HELPER</Text>

      </View>

      <Separator />

      <TouchableOpacity

        style={styles.button}

        onPress={setLowStress}

      >

        <Text>Low</Text>

      </TouchableOpacity>



      <Separator />



      <TouchableOpacity

        style={styles.button}

        onPress={setMediumStress}

      >

        <Text>Medium</Text>

      </TouchableOpacity>



      <Separator />



      <TouchableOpacity

        style={styles.button}

        onPress={setHighStress}

      >

        <Text>High</Text>

      </TouchableOpacity>

    </View>

  );

};



const styles = StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: "center",

    paddingHorizontal: 10

  },

  heading: {

    alignItems: 'center',

    justifyContent: 'center',

  },

  button: {

    alignItems: "center",

    backgroundColor: "#DDDDDD",

    padding: 10

  },

  countContainer: {

    alignItems: "center",

    padding: 10

  },

  separator: {

    marginVertical: 10

  },

});


export default QuestionsHomePage;