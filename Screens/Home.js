

import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Button, FlatList, Image, Alert} from 'react-native';
import {Card, FAB} from 'react-native-paper';


function Home() {

    const [data, setData] = useState([])

    useEffect(() => {

        fetch("http://127.0.0.1:8000/beer/",  {
            method:"GET"

        })
        
        .then(resp => resp.json())
        .then(data => {
                setData(data.results)
        })
       
        .catch(error => Alert.alert("Error", error))

    }, [] )

    const renderData = (item) => {
        return(

         <Card  style = {styles.cardStyle}>
    
              <Text style = {styles.textStyles}>{item.name}</Text>
              <Image source={{uri: item.picture_url + '_100.png' }} style={{flex: 1,width: 100,height: 200,resizeMode: 'contain'}} />
              <Text style = {styles.textStyles}>{item.container_type}</Text>
              <Text style = {styles.textStyles}>{item.volume + ' ml'}</Text>
              <Text style = {styles.textStyles}>{item.alcohol_percentage + ' vol'}</Text>
    
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
          keyExtractor = {item => `${item.id}`}
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
        borderRadius: 60
    },

    textStyles : {
        fontSize:25,
        textAlign: 'center',
      },
})

export default Home
