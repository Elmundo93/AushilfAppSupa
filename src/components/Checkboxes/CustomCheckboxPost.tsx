import React from 'react';
import { Text } from 'react-native';
import {Image} from 'react-native';
import { createRStyle } from 'react-native-full-responsive';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CustomCheckboxProps } from '../../types/checkbox';







const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, isChecked, onCheck }) => {

  const getUnderlayColor = () => {
    switch (label) {
      case 'Garten':
        return 'lightgreen';
      case 'Haushalt':
        return 'lightblue';
      case 'Soziales':
        return 'rgb(255, 102, 102)';
      case 'Gastro':
        return 'rgb(255, 255, 102)';
      default:
        return 'grey';
    }
  };

  const getCheckboxImage = () => {
    switch (label) {
      case 'Garten':
        return require('../../../assets/images/GartenIcon.png');
      case 'Haushalt':
        return require('../../../assets/images/HaushaltIcon.png');
      case 'Soziales':
        return require('../../../assets/images/SozialesIcon.png');
      case 'Gastro':
        return require('../../../assets/images/GastroIcon.png');
      default:
        return require('../../../assets/images/GastroIcon.png');
    }
  };

  const getCheckboxText = () => {
    switch(label){
    case 'Garten':
      return 'Garten';
    case 'Haushalt':
      return 'Haushalt';
    case 'Soziales':
      return 'Soziales';
    case 'Gastro':
      return 'Gastro';
    default:
      return 'Garten';
  }
  };

  
  
  return (
    <TouchableOpacity onPress={onCheck} activeOpacity={0.6} style={[styles.checkbox, { backgroundColor: isChecked ? getUnderlayColor() : 'transparent' }]}>
    <Text style={styles.checkboxText}>
      {getCheckboxText()}
    </Text>
    <Image source={getCheckboxImage()} style={styles.image} resizeMode="contain" />
  </TouchableOpacity>
  );
}

const styles = createRStyle({
  checkbox: {
  
  borderRadius: '10rs',
  width: '90rs',
  height: '90rs',
    marginHorizontal: '15rs',
    marginVertical: '10rs',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: '1rs',
    borderColor: 'black',
    backgroundColor: 'transparent',


  },
  image: {
    width: '80rs',
    height: '80rs',

      
  },

  checkboxContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '20rs',
    backgroundColor:'white'},


    checkboxText: {
      position:'absolute',
        top: '-18rs',
        left: 0,
        right: 0,
        fontSize: '13rs',
        fontWeight: 'bold',
        textAlign: 'center',
       
        borderRadius: '25rs',
        zIndex: 1000,

    }
  
});
  
  export default CustomCheckbox;