import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import DetailScreen from '../src/Screens/DetailScreen';

const Task = props => {
  const navigation = useNavigation();
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate(DetailScreen)}>
          <View style={styles.square}></View>
          <Text style={styles.itemText}>
            {props.Date} {props.Attribute} {props.Amount}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.circular}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    //borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    width: '90%',
    fontSize: 20,
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCFC',
    borderWidth: 2,
    borderRadius: 5,
  },
  touchable: {flexDirection: 'row'},
});

export default Task;
