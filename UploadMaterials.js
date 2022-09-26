import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

//This is the component that will be rendered when the admin wants to upload some material
class UploadMaterials extends React.Component {

    selectFile = () => {
        var options = {
          title: 'Select Image',
          customButtons: [
            { 
              name: 'customOptionKey', 
              title: 'Choose file from Custom Option' 
            },
          ],
          
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
    
        ImagePicker.showImagePicker(options, response => {
          console.log('responseponse=', response);
          if (response.didCancel) 
          {
            console.log('User cancelled image picker');
          } else if (response.error) 
          {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) 
          {
            console.log('User tapped custom button: ', response.customButton);
            alert(response.customButton);
          } else 
          {
            let source = response;
            this.setState({
              responseourcePath: source,
            });
          }
        });
      };

  render()
  {      
    return (
        <View>
        <Text style={styles.textStyle}>Upload self-help videos</Text>
        <TouchableOpacity style={styles.buttonStyle} onPress={this.selectFile}>
            <Image style={{width: 90, height: 90}} source={require("./assets/video.png")}/>
        </TouchableOpacity>
        </View>
        );
  }
}

export default UploadMaterials;

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
    borderRadius: 55,
    marginTop: 30,
    width: 90,
    height: 90,
    marginBottom: 10,
    shadowColor: '#a9a9a9',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 25,
    shadowOpacity: 0.45,
  }
});
