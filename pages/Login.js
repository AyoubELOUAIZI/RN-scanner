import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import EventsList from './EventsList ';
// import { useNavigation } from '@react-navigation/native';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [org_id, setOrg_id] = useState(0);


    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.8.100:8000/api/accounts/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const accountId = await response.json();
            const organizer = await fetchOrganizer(accountId);
            console.log(organizer)
            navigateToEvents(organizer.org_id);
        } catch (error) {
            displayError(error);
        }
    };

    const fetchOrganizer = async (accountId) => {
        const response = await fetch(`http://192.168.8.100:8000/api/organizers/account/${accountId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch organizer');
        }

        return response.json();
    };

    const navigateToEvents = (orgId) => {
        navigation.navigate('Events', { org_id: orgId });
    };

    const displayError = (error) => {
        console.error('Failed to login', error);
        // display error message to the user
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setEmail(text)}
                value={email}
                placeholder="email"
            />
            <TextInput
                style={styles.input}
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Login;
