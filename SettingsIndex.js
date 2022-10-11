import React from "react";
import {View, Text} from "react-native";
import SettingsPage from "./SettingsPage.js";

const Settings = () => {

    const settingsOptions=[

        {title:"My Info", subtitle:"Manage your profile", onPress:()=>{}}


    ];

    return <SettingsPage settingsOptions={settingsOptions} />

};

export default Settings;
