import React, { useState } from 'react';
import { Button, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/auth';
import styles from './styles';
import Loader from '../../components/loader';

import AccordionRegisters from '../../components/accordionRegisters';
import { ScrollView } from 'react-native-gesture-handler';

const MonthTS: React.FC = () => {

  const { dataOfRegisters, messageError } = useAuth()

  if (dataOfRegisters == null && messageError == null) {
    return (
      <Loader />
    )
  }

  const IMAGE_NO_REGISTERS = require('../../assets/sad-clock-legs.png');
  var hasError = Boolean(messageError);


  return (
    <SafeAreaView>
      {dataOfRegisters &&
        <ScrollView>
          <AccordionRegisters data={dataOfRegisters.list} />
        </ ScrollView>
      }
      {hasError &&
        <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.titleError}> {messageError} for this month</Text>
          <Image
            style={styles.imgLogo}
            source={IMAGE_NO_REGISTERS}
          />
        </View>
      }

    </SafeAreaView>
  );
}

export default MonthTS;
