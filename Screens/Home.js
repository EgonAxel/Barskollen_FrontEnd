

import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, FlatList, Image, Alert} from 'react-native';
import {Card, FAB} from 'react-native-paper';


function Home() {

    const [data, setData] = useState([])

    useEffect(() => {

        fetch("http://192.168.1.73/beer/",  {
            method:"GET"

        })
        
        .then(resp => resp.json())
        .then(data => {
                setData(data.results)       
        })
       
        .catch(error => Alert.alert("Error", error.message))
        
    }, [] )

    const renderData = (item) => {
        return(
   
         <Card  style = {styles.cardStyle}>
    
              <Text style = {styles.textStyles}>{item.name}</Text>
              <Text style = {styles.textStyles}>{item.beer_type}</Text>
              <Image source={{uri: item.picture_url + '_100.png' }} style={styles.imageStyle} />
              <Text style = {styles.textStyles}>{item.container_type}</Text>
              <Text style = {styles.textStyles}>{item.volume + ' ml'}</Text>
              <Text style = {styles.textStyles}>{item.alcohol_percentage + '% vol'}</Text>
    
        </Card>
   
        )   
    }
    return (
 <View>
    
         <FlatList 
             data = {data}
             renderItem = {({item}) => {
            return renderData(item)
          }}
          keyExtractor = {item => `${item.beer_ID}`}
     />

</View>
    )
}

const styles = StyleSheet.create({
    cardStyle: {
        padding:20,
        margin:40,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'grey',
        borderRadius: 60,
       
    },
    imageStyle: {
        flex: 1,
        width: 100,
        height: 200,
        resizeMode: 'contain',
        alignSelf: 'center'
    },

    textStyles : {
        fontSize:25,
        textAlign: 'center',
      },
})

export default Home
