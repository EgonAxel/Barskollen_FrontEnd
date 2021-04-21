import React from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity, TextInput,SafeAreaView, ScrollView} from 'react-native';
import Stars from 'react-native-stars';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
     return(result);
   } else {
     return(None);
   }
 }

class commentLayout extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
          stars: 0,
          beer_ID: this.props.route.params.beer_ID,
          beer_pic: this.props.route.params.beer_pic,
          beer_name: this.props.route.params.beer_name,
          beer_type: this.props.route.params.beer_type,
          beer_bitterness: this.props.route.params.beer_bitterness,
          beer_fullness: this.props.route.params.beer_fullness,
          beer_sweetness: this.props.route.params.beer_sweetness,
          recommendations: [],
          review: ''
      };
    }
    reviewText = (text) => {
      this.setState({ review: text })
     }

   postRatingComment(beer_ID, beer_name, starValue, review) {
      getValueFor("Username").then((username) => {
        console.log(username)
        console.log(review)
        getValueFor("Token").then((token) => {
          axios
            .post(`http://192.168.56.1:80/review/?beer=${this.state.beer_ID}`, { beer:beer_ID, user:username, beer_name: beer_name, rating: starValue, review_text:review, headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
            .catch(error => {
            this.setState({error: error.message});
            });
        });
      });
    }

    getRecommendations(starValue, beer_type, beer_bitterness, beer_fullness, beer_sweetness) {
      getValueFor("Token").then((token) => {
        console.log(token);
        axios
          .get(`http://192.168.56.1:80/beer/?beer_type=${beer_type}&min_bitterness=${beer_bitterness - 1}&max_bitterness=${beer_bitterness + 1}&min_fullness=${beer_fullness - 1}&max_fullness=${beer_fullness + 1}&min_sweetness=${beer_sweetness - 1}&max_sweetness=${beer_sweetness + 1}&ordering=-rating&limit=3`, { headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
          .then(response => {
            this.setState({
              recommendations: response.data.results,
            });
          })
          .catch(error => {
          this.setState({error: error.message});
          });
        });
    }

  

  render() {
  
  return (
    
    <SafeAreaView style = {styles.viewStyle}>
      <Text style = {styles.productNameBold}>{this.state.beer_name}</Text>
      <View style = {styles.imageWrap}>
      <Image source={{uri: this.state.beer_pic + '_100.png' }} style={styles.beerImage} /> 
      <TouchableOpacity onPress={() => {
        this.postRatingComment(this.state.beer_ID, this.state.beer_name, this.state.stars, this.state.review),
        this.getRecommendations(this.state.stars, this.state.beer_type, this.state.beer_bitterness, this.state.beer_fullness, this.state.beer_sweetness),
        console.log(this.state.recommendations.length)}}>
           <Image source={require('../images/beerCap.png')} style={styles.capImage} /> 
           </TouchableOpacity>
           </View>
        <View style={{alignItems:'center'}}>
          <Stars
            update={(val)=>{this.setState({stars: val})}}
            // half={true}
            display= {Number((this.state.stars).toFixed(1))}
            fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
            emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
            halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
            />
            <Text>{this.state.stars}</Text>
            <View style = {styles.container}>
            <TextInput style = {styles.textInputFields}
                  underlineColorAndroid = "transparent"
                  placeholder = "Skriv gärna vad du tyckte om ölen"
                  placeholderTextColor = "grey"
                  returnKeyType="next"
                  onChangeText = {this.reviewText}
                  blurOnSubmit={false}/>
                  </View>
        
        
        
        
          
                 
    
    </View>
        </SafeAreaView> 
        
      );
      
    }
  }
  
  const styles = StyleSheet.create({
  
    viewStyle: {
      marginTop: 15,
      width: 350,
      height: 525,
      backgroundColor: '#ffffff',
      borderRadius: 15,
      borderStyle: 'solid', 
      borderColor: '#dadada',
      borderWidth: 1,
      shadowColor: "#000000",
      shadowOffset: {
        width: 1,
        height: 1
      },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 20,
      alignSelf: 'center'
    },
    textInputFields: {
       paddingLeft: 15,
       paddingRight: 15,
       marginTop: 80,
       marginRight: 40,
       marginBottom: 5,
       marginLeft: 40,
       height: 100,
       borderColor: '#009688',
       borderWidth: 2,
       borderRadius: 10,
       backgroundColor: 'white'
    },
  
    productNameBold: {
      fontSize: 25,
      fontWeight: '700',
      marginTop: 25,
      textAlign: 'center',
      marginBottom: 15
    },
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: 'center',
     },
  
    productNameThin: {
      fontSize: 18,
      fontWeight: '400',
      textAlign: 'center',
      marginBottom: 20,
    },
  
    beerImage: {
        width: 150,
        height: 200,
        marginBottom: 20,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    capImage: {
      width: 200,
      height: 250,
      resizeMode: 'contain',
      alignSelf: 'center'
  },
    imageWrap: {
      flex: 3,
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 20
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
        color: '#009688',
        backgroundColor: 'transparent',
        textShadowColor: 'black',
        textShadowOffset: {
          width: 1, 
          height: 1
        },
        textShadowRadius: 2,
        fontSize: 30,
    
      },
      myEmptyStarStyle: {
        color: '#009688',
      },
  
    rating: {
      fontSize: 25,
      textAlign: 'center',
      marginBottom: 100,
    },
  })
  
  export default commentLayout  