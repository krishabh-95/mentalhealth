import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import UploadMaterials from './UploadMaterials.js';
import App from './App.js';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home page content will appear over here!</Text>
    </View>
  );
}


class SettingsScreen extends React.Component {
    constructor()
    {
        super();
        this.state = {page: "default"};
    }

    logout = async() => {
        await AsyncStorage.removeItem("USER_ID");
        this.setState({page : "logout"});
    }
    

    render()
    {
        if(this.state.page === "default")
            return (
                <View>
                <Text style={styles.textStyle}>Choose device from which the heart rate needs to be fetched</Text>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.logout}>
                    <Text style={{fontWeight: "bold", fontSize: 25, alignContent: 'center', color: "white"}}>Logout</Text>
                </TouchableOpacity>
                </View>
            );
        else
            return <App/>;
    }
}

const Tab = createBottomTabNavigator();

export default function Application() {
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

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Upload content" component={UploadMaterials} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    textStyle: {
      fontSize: 25,
      marginTop: 50,
      padding: 10,
      fontWeight: 'bold',
      alignItems: 'flex-start',
      color: "blue",
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