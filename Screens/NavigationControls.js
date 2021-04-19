
import React, { useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Platform, StyleSheet } from "react-native";
import { NavigationContainer, useNavigation,  RouteProp,} from "@react-navigation/native";

import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import SearchLayout from "react-navigation-addon-search-layout";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

import Home from './Home';
import ExploreBeer from './ExploreBeer';
import UserProfile from './UserProfile';
import IndividualBeer from './IndividualBeer';
import commentLayout from './commentLayout';
import SearchBeer from './SearchBeer'

//------------------------------------------------------------------
type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Result: { text: string };
};

type ResultScreenRouteProp = RouteProp<RootStackParamList, "SearchBeer">;

function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();

  const _handleQueryChange = (searchText: string) => {
    setSearchText(searchText);
  };

  const _executeSearch = () => {
     navigation.navigate("SearchBeer", {
              text: searchText,
            })
  };

  return (
    <SearchLayout onChangeQuery={_handleQueryChange} onSubmit={_executeSearch}>
      {searchText ? (
        <RectButton
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#eee",
            paddingVertical: 20,
            paddingHorizontal: 15,
          }}
          onPress={() =>
            navigation.navigate("SearchBeer", {
              text: searchText,
            })
          }
        >
          <Text style={{ fontSize: 14 }}>{searchText}!</Text>
        </RectButton>
      ) : null}
    </SearchLayout>
  );
}

// function ResultScreen(props: ResultScreenRouteProp) {
//   return (
//     <View style={styles.container}>
//       <Text>{props.params.text} result!</Text>
//     </View>
//   );
// }







//------------------------------------------------------------------

const Tab = createMaterialBottomTabNavigator();


function NavigationControls() {
  return (
    <SafeAreaProvider>            
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#fff"
        labelStyle={{ fontSize: 12 }}
        barStyle={{ backgroundColor: '#009688' } }
      >
        <Tab.Screen
            name="Mitt konto"
            component={UserProfile}
            options={{
              tabBarLabel: 'Mitt konto',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="person-outline" size={25} color={color} />
              ),
            }}
          /> 
        <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: 'Startsida',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={25}
                />
              ),
            }}
        />
        <Tab.Screen
            name="Utforska"
            component={ExploreBeerStackScreen}
            options={{
              tabBarLabel: 'Utforska',
              tabBarIcon: ({ color }) => (
                <Ionicons name="beer-outline" size={25} color={color} />
              ),
            }}
          />
      </Tab.Navigator>
  </SafeAreaProvider>
);
}

const ExploreBeerStack = createStackNavigator();

function ExploreBeerStackScreen() {
  return (
    <ExploreBeerStack.Navigator>  
        <ExploreBeerStack.Screen
          name="Utforska" 
          component={ExploreBeer}  
          options={{ 

            //-----
            headerRight: (props) => {
              const navigation = useNavigation();
              return (
                <BorderlessButton
                  onPress={() => navigation.navigate("Search")}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons
                    name="md-search"
                    size={Platform.OS === "ios" ? 22 : 25}
                    color={SearchLayout.DefaultTintColor}
                  />
                </BorderlessButton>
              );
            },
            //----
            title: 'Utforska',
            headerTitleStyle: { alignSelf: 'center' },
            headerStyle: {
              backgroundColor: '#fff',
              height: 75,
              }}
            }
        />


        <ExploreBeerStack.Screen
            name="Search"
            component={SearchScreen}
            options={{
              headerShown: false,
              gestureEnabled: false,
              animationEnabled: false,
            }}
          />

        <ExploreBeerStack.Screen 
          name="SearchBeer" 
          component={SearchBeer} 
        />
            

        <ExploreBeerStack.Screen 
          name="IndividualBeer" 
          component={IndividualBeer}
          options={{ 
            title: 'Info' ,
            headerTitleStyle: { alignSelf: 'flex-start' },
            headerStyle: {
              backgroundColor: '#fff',
              }}
            } 
         />
        <ExploreBeerStack.Screen 
          name="commentLayout" 
          component={commentLayout}
          options={{ 
            title: 'Ge betyg' ,
            headerTitleStyle: { alignSelf: 'flex-start' },
            headerStyle: {
              backgroundColor: '#fff', 
              }}
            } 
         />
    </ExploreBeerStack.Navigator>
  );
}

export default NavigationControls