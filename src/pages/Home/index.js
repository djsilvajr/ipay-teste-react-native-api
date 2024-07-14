import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, Dimensions, Alert } from 'react-native';
import Header from '../../components/Header/header';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        console.log('Fetching data from API');
        axios.get('http://192.168.18.122:8000/api/Customer?page=1&pageSize=10')
            .then(response => {
                console.log('Data fetched successfully', response.data);
                if (Array.isArray(response.data.original)) {
                    setData(response.data.original);
                } else {
                    console.error('Unexpected data structure:', response.data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error.response || error.message || error);
                setLoading(false);
            });
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const handleEdit = (customer) => {
        navigation.navigate('EditCustomer', { customer });
    };

    const handleAdd = () => {
        navigation.navigate('AddCustomer');
    }

    const handleDelete = (id) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir este cliente?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                        axios.delete(`http://192.168.18.122:8000/api/Customer/${id}`)
                            .then(response => {
                                console.log('Customer deleted', response.data);
                                fetchData(); // Reload data after deletion
                            })
                            .catch(error => {
                                console.error('Error deleting customer:', error.response || error.message || error);
                                Alert.alert('Erro', 'Não foi possível excluir o cliente.');
                            });
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellID]}>{item.id}</Text>
            <Text style={[styles.tableCell, styles.tableCellName]}>{item.name} {item.surname}</Text>
            <Text style={[styles.tableCell, styles.tableCellCPF]}>{item.cpf}</Text>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                    <Ionicons name="pencil" size={16} color="white" />
                    <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash" size={16} color="white" />
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title="Home"/>
            <View style={styles.backContainer}/>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.addButton}  onPress={() => handleAdd()}>
                    <Ionicons name="add" size={24} color="white" />
                    <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal>
                <View style={styles.tableContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#6200EE" />
                    ) : (
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                            ListHeaderComponent={
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderCell, styles.tableCellID]}>ID</Text>
                                    <Text style={[styles.tableHeaderCell, styles.tableCellName]}>Nome</Text>
                                    <Text style={[styles.tableHeaderCell, styles.tableCellCPF]}>CPF</Text>
                                    <Text style={styles.tableHeaderCell}>Ações</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    backContainer: {
        backgroundColor: '#6200EE',
        height: 100,
    },
    buttonsContainer: {
        backgroundColor: '#ffffff',
        margin: 20,
        height: 100,
        marginTop: -60,
        padding: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#6200EE',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 140,
        height: 40
    },
    addButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    tableContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        minWidth: width,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
        marginBottom: 10,
    },
    tableHeaderCell: {
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableCell: {
        marginHorizontal: 5,
    },
    tableCellID: {
        width: 50,
    },
    tableCellName: {
        width: 150,
    },
    tableCellCPF: {
        width: 120,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: '#6200EE',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 5,
    },
    editButtonText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 14,
    },
    deleteButton: {
        flexDirection: 'row',
        backgroundColor: '#e74c3c',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 14,
    },
});
