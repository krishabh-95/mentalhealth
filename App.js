import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import UploadMaterials from './UploadMaterials.js';
import SignUp from './SignUp.js';
import SettingsPage from './SettingsPage.js';
import SettingsComponent from './SettingsComponent.js';

//This is the main component of this app
class App extends React.Component {
  constructor()
  {
    super();
    this.state = {page : "settings_page"}; //The state variable page keeps track of the page that should be opened in the app
  }

  updatePage = (newPage) => {
    this.setState({page:newPage});
  }

  render()
  {  
    let pageContent = null;

    if(this.state.page==="upload_content")
      pageContent = <UploadMaterials/>;
    else if(this.state.page ==="settings_page")
      pageContent = <SettingsComponent/>;
    else if(this.state.page==="signup")
      return <SignUp/>;
      
    return (
          <View style={styles.container}>
            <StatusBar backgroundColor="#f5fffa" />
            {pageContent}
            <View style={styles.menuBar}>
              <Button title="Home" style={styles.buttonStyle}>
              </Button>
              <Button title="Upload content" style={styles.buttonStyle} onPress={() => this.updatePage("upload_content")}>
              </Button>
              <Button title="Self-help" style={styles.buttonStyle}>
              </Button>
              <Button title="Profile" style={styles.buttonStyle} onPress={() => this.updatePage("signup")}>
              </Button>
              <Button title="Settings" style={styles.buttonStyle} onPress={() => this.updatePage("settings_page")}>
              </Button>
            </View>
          </View>
        );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: '#f5fffa',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  menuBar:
  {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  buttonStyle:
  {
    color: '#b22222',
  },
});
