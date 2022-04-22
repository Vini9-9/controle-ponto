import React, { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/auth';
import styles from './styles';

const Application: React.FC = () => {

  const { logOut, user, register } = useAuth()

  const [time, setTime] = useState('loading...')
  const [date, setDate] = useState('loading...')
  const [type, setType] = useState('in')
  const [message, setMessage] = useState<string | boolean>(false)

  function handleLogOut() {
    logOut();
  }
  async function handleRegister() {
    const response = await register()
    console.log('response', response)
    setMessage(response?.message)
    setType(response?.nextType)
    setDate(response?.result.date)
    setTime(response?.result.time)
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerLogin}>
        <Text style={styles.titleForm}>
          Olá, {user?.name}
        </Text>
        

        <TouchableOpacity onPress={handleRegister} style={styles.btnLogin}>
          <Text style={styles.btnTitle}>Register</Text>
        </TouchableOpacity>

        {message &&
          <>
            <Text>
              {message}
            </Text>
            <Text>
              date: {date}
            </Text>
            <Text>
              time: {time}
            </Text>
          </>
          
        }

      </View>
      <Button title='Log out' onPress={handleLogOut} color={'red'} />
    </View>
  );
}

export default Application;
