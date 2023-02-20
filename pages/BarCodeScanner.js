import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function BarCodeScannerApp({ route, navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [eventId, setEventId] = useState(1);


    useEffect(() => {
        const fetchTickets = async () => {
            console.log('-----------------------------')
            setEventId(route.params.event_id);
            console.log(route.params.event_id);

            const response = await fetch(`http://192.168.8.100:8000/api/tickets/event/${route.params.event_id}`);
            const data = await response.json();
            setTickets(data);
            console.log(data)
            console.log(data.length)
            console.log('===================end=====================');
        };
        fetchTickets();

        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        const isValid = tickets.some(ticket => ticket.qrcode === data);
        if (isValid) {
            alert(`Ticket is valid!\ntype : ${type}\n data : ${data}`);
        } else {
            alert(`Ops! Ticket is invalid!?????\ntype : ${type}\n data : ${data}`);
        }

        // alert(`type : ${type}\n data : ${data}`);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>No access to camera</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
            {scanned && (
                <View style={styles.textContainer}>
                    <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
                    <Text style={styles.ticketInfo}>This event has {tickets.length} tickets</Text>
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    cameraContainer: {
        flex: 2,
        justifyContent: 'flex-end',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        fontSize: 20,
    },
    ticketInfo: {
        fontSize: 20,
    },
});
