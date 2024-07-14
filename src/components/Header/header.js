import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function Header() {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Ipay teste</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#6200EE',
      height: 70,
      paddingHorizontal: 16,
    },
    headerTitle: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
    },
  });
  