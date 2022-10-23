import React, { Fragment, Component, useState, useEffect } from 'react';
import {
   SafeAreaView,
   StyleSheet,
   ScrollView,
   View,
   Text,
   AsyncStorage,
   StatusBar,
   Image,
   Button,
   Dimensions,
   TouchableOpacity,
   Platform
 } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
import storage from './CloudStorage.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import db from './AddData.js';
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { isAdmin } from '@firebase/util';
import QuestionsHomePage from './QuestionsHomePage.js';
import email from 'react-native-email';
import * as Notifications from "expo-notifications";

export async function schedulePushNotification() {
  const trigger = new Date(Date.now() + 10 * 1000);
  console.log("Going to send notifications!");
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "New self-help video uploaded",
      body: "Hey there, do check out the new self-help videos that the admin has uploaded!",
      // sound: 'default',
    },
    trigger,
  });
  console.log("notif id on scheduling"+id)
  return id;
}

var index = 1;
var firstTime = true;

//This will show the images and videos that have been uploaded to the firebase database
function UploadedFiles()
{
  var [urls, setUrls] = useState([]);

  const getUrls = async() => {
    var urlVals = [];
    var file = null;
    let error = false;

    while(error===false)
    {
      try {
      var fileName = "/sample"+index+".png";
      file = ref(storage, fileName);
      await getDownloadURL(file).then((x) => {  urlVals[index-1] = x; index++; })
      } catch(err)
      {
        error = true;
        console.log(err);
        break;
      }
    }

    console.log("Going to set a value for the state variable urls");
    firstTime = false;
    console.log(urlVals);
    setUrls(urlVals);
  };

  if(firstTime)
  {
    getUrls();
    console.log("Testing");
    console.log(urls); 
    firstTime = false; 
  }

  return (
     urls.map((image, ind) => { 
      return (<View key={ind}><Image source={{ uri: image }} style={{resizeMode: 'contain', width: 240, height: 190}}/><Text>{"\n"}</Text></View>);
    })
  );
}

//This is the component that will be rendered when the admin wants to upload some material
function UploadMaterials()
{
  var [image, setImage] = useState(null);
  var [isAdmin, setAdmin] = useState(null);
  var [questionnaires, setQuestions] = useState(null);

  const isAdministrator = async() => {
    console.log("Checking if the user is an admin");
    let uid = await AsyncStorage.getItem("USER_ID");
    console.log("User ID is "+uid);
    const querySnapshot = await getDocs(collection(db, "users"));
  
    querySnapshot.forEach((doc) => {
      let userId= doc.id;
      if(userId ===  uid)
      {
        if(doc.data().userType === "Admin")
        {
          setAdmin(true);
        }
        else
          setAdmin(false);
      }
    });
  };

  const chooseImage = async () => {
    
    let status = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log(status);

    if(status.status!=="granted")
    {
      alert("Sorry, we need to access your phone's gallery for this functionality to work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const resetQuestionnaires = () => {
    setQuestions(null);
  };

  const loadTheQuestions = () => {
    setQuestions("yes");
  };

  const uploadImage = () => {
      if(image===null)
      {
        alert("Please select the image/video that needs to be uploaded first!");
        return;
      }

      var url = uploadImageToCloud(image);
      console.log(url);
  };

  const getHighestIndex = async() => {
    var file = null;
    let error = false;
    let indVal = 1;

    while(error===false)
    {
      try {
      var fileName = "/sample"+indVal+".png";
      file = ref(storage, fileName);
      await getDownloadURL(file).then((x) => { indVal++; })
      } catch(err)
      {
        error = true;
        console.log(err);
        break;
      }
    }

    return indVal;
  };

  const sendEmails = async() => {
    const querySnapshot = await getDocs(collection(db, "users"));
    let mailIds = [];
    querySnapshot.forEach((doc) => {
        if(doc.data().userType==="Guest")
          mailIds.concat(doc.data().email);
    });

    console.log("Going to send an email.");
    console.log(mailIds);
    const to = mailIds; // string or array of email addresses
    email(to, {
        subject: 'New self-help videos uploaded',
        body: 'Some new self help videos have been uploaded. Please have a look.',
        checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
    
  };

  const uploadImageToCloud = async(image) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      //image=image.replace("file://", "/private");
      console.log("URL is "+image);
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    
    let highestIndex = await getHighestIndex();
    console.log("The highest index is "+highestIndex);
    const fileRef = ref(storage, 'sample'+highestIndex+'.png');
    index++;
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();  
    alert("Image/video uploaded successfully.");
    schedulePushNotification();
    setImage(null);
    //sendEmails();

    return await getDownloadURL(fileRef);
  };

  if(questionnaires!==null)
  {
    return (<ScrollView style={{height: '100%'}}><QuestionsHomePage/>
      <TouchableOpacity style={[styles.buttonStyle, {width: 250, backgroundColor: 'blue'}]} onPress={resetQuestionnaires}>
        <Text style={{fontWeight: "bold", fontSize: 18, alignContent: 'center', color: "white", padding: 10}}>Go back to self-help page</Text>
      </TouchableOpacity>
      </ScrollView>);
  }

  let uploadStuff="";
  isAdministrator();
  console.log('Is admin :'+ isAdmin);
  if(isAdmin!==null)
  {
    if(isAdmin)
    {
      uploadStuff = (<View><Text style={styles.textStyle}>Upload self-help videos and soothing images (should not exceed 1 mb):</Text>
      <TouchableOpacity style={styles.buttonStyle} onPress={chooseImage}>
        <Text style={{fontWeight: "bold", fontSize: 18, alignContent: 'center', color: "black", padding: 10}}>Choose a video/image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

      <TouchableOpacity style={[styles.buttonStyle, {width: 220}]} onPress={uploadImage}>
        <Text style={{fontWeight: "bold", fontSize: 18, alignContent: 'center', color: "black", padding: 10}}>Upload the video/image</Text>
      </TouchableOpacity>
      </View>);
    }

    firstTime = true;
    index = 1;

    return (
      <ScrollView style= {{height : '100%'}}>
      {uploadStuff}
      <TouchableOpacity style={[styles.buttonStyle, {width: 220, backgroundColor: 'blue'}]} onPress={loadTheQuestions}>
        <Text style={{fontWeight: "bold", fontSize: 18, alignContent: 'center', color: "white", padding: 10}}>Answer questionnaires</Text>
      </TouchableOpacity>
      <Text style={styles.textStyle}>Uploaded images/videos:</Text>
      <UploadedFiles/>
      </ScrollView>
      );
  } 
  else
    return <View/>;
}

export default UploadMaterials;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    marginTop: 50,
    padding: 10,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    color: "blue",
  },
  buttonStyle: {
    borderRadius: 20,
    marginTop: 20,
    width:210,
    backgroundColor: "gray",
    height: 50,
    marginBottom: 10,
    shadowColor: '#a9a9a9',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 25,
    shadowOpacity: 0.45,
  }
});
