import React from 'react';
import {ScrollView, View, Text, FlatList, Image, StyleSheet, Touch} from 'react-native';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


class commentLayout extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
          stars:0,
          beer_ID: this.props.route.params.beer_ID,
          beer_pic: this.props.route.params.beer_pic,
          beer_name: this.props.route.params.beer_name
       
      };
    }
    
   

  commentLayout(){
    
  
  
  }

  render() {
  
  return (
      
    <View style = {styles.viewStyle}>
        <Text style = {styles.productNameBold}>{this.state.beer_name}</Text>
        <Image source={{uri: this.state.beer_pic + '_100.png' }} style={styles.beerImage} />   
    <View style={{alignItems:'center'}}>
    <Stars
      default={2.5}
      count={5}
      half={true}
      fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
      emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
      halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
      />
      </View>
      </View> 
      
         
          
         
        
      );
      
    }
  }
  
  const styles = StyleSheet.create({
  
    viewStyle: {
      marginTop: 15,
      width: 400,
      height: 720,
      backgroundColor: '#effce8',
      borderRadius: 15,
      borderStyle: 'solid', 
      borderColor: '#e3e3e3',
      borderWidth: 3,
      marginBottom: 15,
    },
  
    productNameBold: {
      fontSize: 25,
      fontWeight: '700',
      marginTop: 25,
      textAlign: 'center',
      marginBottom: 15
    },
  
    productNameThin: {
      fontSize: 18,
      fontWeight: '400',
      textAlign: 'center',
      marginBottom: 20,
    },
  
    beerImage: {
        width: 200,
        height: 300,
        marginBottom: 20,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
  
  
    alcoholPercentageStyle: {
      fontSize: 22,
      textAlign: 'center',
      fontWeight: '500',
      marginBottom: 10,
    },
  
    containerAndVolumeStyle: {
      fontSize: 20,
      textAlign: 'center',
  
    },
  
    tasteClockWrap: {
      flex: 1,
      marginTop: 50,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
  
    tasteClockStyle : {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      myStarStyle: {
        color: 'black',
        backgroundColor: 'transparent',
        textShadowColor: 'black',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
        fontSize: 30,
    
      },
      myEmptyStarStyle: {
        color: 'black',
      },
  
    rating: {
      fontSize: 25,
      textAlign: 'center',
      marginBottom: 100,
    },
  })
  
  export default commentLayout  