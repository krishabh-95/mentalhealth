import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, AsyncStorage, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import UploadMaterials from './UploadMaterials.js';
import App from './App.js';
import HeartRate from './FetchHeartRate.js';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import db from './AddData.js';
import * as Animatable from 'react-native-animatable';
import AppleHealthKit from 'react-native-health';
import { list } from 'firebase/storage';
import SettingsPage from './SettingsPage.js';
import * as Notifications from "expo-notifications";

var parentState = null;

export async function sendPushNotif() {
  const trigger = new Date(Date.now() + 10 * 1000);
  console.log("Going to send notifications!");
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "How are you feeling?",
      body: "Hey there, you seem to be a bit stressed out. Check out some of our self-help materials to self-soothe.",
      // sound: 'default',
    },
    trigger,
  });
  console.log("notif id on scheduling"+id)
  return id;
}

function HomeScreen() {
  var [heartRate, setHeartRate] = useState(0);
  var [logStyle, setStyle] = useState(styles.logoStyle);
  var count =1;

  const fetchHeartRate = async() => {
    //configureAndFetchdataForGoogleFit();
   // getHeartRateFromApple();
  };

  const modifyStyle = async() => {
  if(count % 2 === 1)
    {
      setStyle(styles.logoStyle2);
      count++;
    }    else
    {
    setStyle(styles.logoStyle);
    count++;      
  }
  };

  const configureAndFetchdataForGoogleFit = async() => {
    console.log("Fetching the heart rate!");
    GoogleFit.checkIsAuthorized().then(() => {
      var authorized = GoogleFit.isAuthorized;
      console.log(authorized);
      if (authorized) {
        getHeartRate();
      } else {
        // Authentication if already not authorized for a particular device
        GoogleFit.authorize(options)
          .then(authResult => {
            if (authResult.success) {
              console.log('AUTH_SUCCESS');
  
              getHeartRate();
            } else {
              console.log('AUTH_DENIED ' + authResult.message);
            }
          })
          .catch(() => {
            dispatch('AUTH_ERROR');
          });
      }
  });
  };

  const getHeartRate = async() => {
    console.log("Success!");
    const opt = {
      startDate: lastWeekDate.toISOString(), // required ISO8601Timestamp
      endDate: today.toISOString(), // required ISO8601Timestamp
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };

      const res = await GoogleFit.getHeartRateSamples(opt);
      let data = res.reverse();
      if (data.length === 0) {
        setHeartRate('Not Found');
      } else {
        setHeartRate(data[0].value);
        //Add it to the database
        let userId = await AsyncStorage.getItem("USER_ID");
        await setDoc(doc(db, "heart_rate"), {
          user_id: userId,
          heartbeat: data[0].value
      });
        alert("Heart beat information added successfully!");
      }
  };

  useEffect(() => {
    setInterval(() => {
      fetchHeartRate();
    }, 20000);

    setInterval(() => {
      modifyStyle();
    }, 1000);
  }, []);

  const isPersonStressed = async(hb) => {
    if(hb<60 || hb>90)
    {
      //The person could be stressed out
      //Check the answers of their questionnaires
      let userId = await AsyncStorage.getItem("USER_ID");
      let isUserStressed = false;
      let isDataPresent = false;

      const data = query(collection(db, "highStressQuestions"));
      const querySnapshot = await getDocs(data);
      
      querySnapshot.forEach((doc) => {
        if(doc.id === userId)
        {
          isUserStressed = true;
          isDataPresent = true;
        }
      });

      if(!isUserStressed)
      {
        const data = query(collection(db, "mediumStressQuestions"));
        const querySnapshot = await getDocs(data);
        
        querySnapshot.forEach((doc) => {
          if(doc.id === userId)
          {
            isUserStressed = true;
            isDataPresent = true;
          }
        });

        if(!isUserStressed)
        {
          const data = query(collection(db, "lowStressQuestions"));
          const querySnapshot = await getDocs(data);
          
          querySnapshot.forEach((doc) => {
            if(doc.id === userId)
            {
              isDataPresent = true;
              let q1= doc.data().q1;
              let q2= doc.data().q2;
              let q3= doc.data().q3;
              let q4= doc.data().q4;
              let q5= doc.data().q5;
              let count =0;

              if(q1==="yes" || q1 === "Yes")
                count++;
              if(q2==="yes" || q2 === "Yes")
                count++;
              if(q3==="yes" || q3 === "Yes")
                count++;
              if(q4==="rarely" || q4 === "Rarely" || q4 === "Occasionally" || q4 === "occasionally")
                count++;
                if(q5==="rarely" || q5 === "Rarely" || q5 === "Occasionally" || q5 === "occasionally")
                count++;

              if(count>=4)
              {
                isPersonStressed = true;
              }
            }
          });
        }
      }

      if(isPersonStressed || !isDataPresent)
      {
        sendPushNotif();
      }
    }
  };

  if(heartRate!==0)
  {
    //Check if the person is stressed
    isPersonStressed(heartRate);
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image style={logStyle} source={require("./assets/heart.png")}/>
      <Text style = {{fontSize: 18, fontWeight: 'bold'}}>Feeling stressed? Feeling frustrated? Feeling angry?</Text>
      <Text></Text>
      <Text style = {{fontSize: 18, fontStyle: 'italic'}}>Don't worry. We got you covered. This amazing app helps track your heart rate and analyze your mood. It also provides assistance as and when required.</Text>
    </View>
  );
}

/*
function SettingsScreen() {
    const logout = async() => {
      await AsyncStorage.removeItem("USER_ID");
      if(parentState!==null)
      {
        parentState.setState({page: 'logout'});
      }
    };

    return (
        <View>
          <TouchableOpacity style={styles.buttonStyle} onPress={logout}>
            <Text style={{fontWeight: "bold", fontSize: 25, alignContent: 'center', color: "white"}}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
}*/

const Tab = createBottomTabNavigator();

class Application extends React.Component
{
  constructor()
  {
    super();
    this.state = {page:'default'};
  }

  componentWillUnmount()
  {
    console.log("The component HomePage will unmount!");
  }

  render()
  {
    parentState = this;

    if(this.state.page==='logout')
      return <App/>;  
    
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                iconName = focused
                  ? 'ios-information-circle'
                  : 'ios-information-circle-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'ios-list' : 'ios-list';
              }
              else if (route.name === 'Upload content')
              {
                  iconName = 'image-outline';
              }
              else if (route.name === 'Heart rate')
              {
                  iconName = 'pulse-outline';
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'red',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Upload content" component={UploadMaterials} />
          <Tab.Screen name="Heart rate" component={HeartRate}/>
          <Tab.Screen name="Settings" component={SettingsPage} initialParams={{ object : this}}></Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default Application;

const styles = StyleSheet.create({
    textStyle: {
      fontSize: 25,
      marginTop: 50,
      padding: 10,
      fontWeight: 'bold',
      alignItems: 'flex-start',
      color: "blue",
    },
    logoStyle: {
        width: "50%",
        resizeMode: 'contain',
      },
      logoStyle2: {
        width: "70%",
        resizeMode: 'contain',
      },
    buttonStyle: {
        padding: 15,
        marginTop: 10,
        borderRadius: 20,
        alignItems: 'center',
        width: 250,
        justifyContent: "center",
        backgroundColor: "red",
      }
  });