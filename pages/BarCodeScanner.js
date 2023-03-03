import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function BarCodeScannerApp({ route, navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [eventId, setEventId] = useState(1);

    function UpdateTicket(ticketId) {
        fetch(`https://e-ticket-server.onrender.com/api/scanner/tickets/${ticketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isscanned: true
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Resource updated successfully:', data);
                console.log('ffffffffffffffffffffffffffffffffffffffffffffff');
                console.log(data)
                console.log('ffffffffffffffffffffffffffffffffffffffffffffff');
            })
            .catch(error => {
                console.error('There was a problem updating the resource:', error);
            });

    }

    const fetchTickets = async () => {
        console.log('-------------****----------------')
        setEventId(route.params.event_id);
        console.log(route.params.event_id);

        const response = await fetch(`https://e-ticket-server.onrender.com/api/scanner/tickets/event/${route.params.event_id}`);
        const data = await response.json();
        setTickets(data);
        console.log(data)
    };

    useEffect(() => {

        fetchTickets();

        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);

        const ticket = tickets.find((ticketObj) => ticketObj.qrcode === data);
        // const isValid = tickets.some((ticketObj) => ticketObj.qrcode === data);
        if (!ticket) {
            alert(`Ops! Ticket is invalid !\n data : ${data}`);
        } else if (ticket.isscanned === true) {
            alert(`Repeated Ticket !\n data : ${data}`);
        } else {
            alert(`Yes Ticket is valid !\n data : ${data}`);
            console.log(ticket)
            UpdateTicket(ticket.ticket_id);
            fetchTickets();
        }
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
