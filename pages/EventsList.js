import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const EventsList = ({ route, navigation }) => {
    const [events, setEvents] = useState([]);
    const [org_id, setOrg_id] = useState(1);

    useEffect(() => {
        setOrg_id(route.params.org_id);
        console.log(org_id);
        const fetchEvents = async () => {
            const response = await fetch(`https://e-ticket-server.onrender.com/api/scanner/organizers/${route.params.org_id}`);
            const data = await response.json();
            setEvents(data.Events);
        };
        fetchEvents();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Event Titles</Text>
            <FlatList
                data={events}
                keyExtractor={item => item.event_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Scanne qrCode', { event_id: item.event_id })}>
                        <View style={styles.eventInfo}>
                            <Text style={styles.eventTitle}>Event : {item.title}</Text>
                            <Text style={styles.eventDetailes}>Type : {item.event_type}</Text>
                            <Text style={styles.eventDetailes}>Location : {item.location}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
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
    eventInfo: {
        marginBottom: 10,
        backgroundColor: 'green',
        padding: 10,
        color: '#fff',
        width: '100%'
    },
    eventTitle: {
        fontSize: 24,
        color: '#fff',
    },
    eventDetailes: {
        fontSize: 15,
        color: '#fff',
    },
});

export default EventsList;
