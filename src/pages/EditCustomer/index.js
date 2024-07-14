import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import axios from 'axios';

function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

export default function EditCustomer({ route, navigation }) {
    const { customer } = route.params;

    const [cpf, setCpf] = useState(customer.cpf);
    const [name, setName] = useState(customer.name);
    const [surname, setSurname] = useState(customer.surname);
    const [birthDate, setBirthDate] = useState(customer.birth_date);
    const [email, setEmail] = useState(customer.email);
    const [gender, setGender] = useState(customer.gender);
    const [modalVisible, setModalVisible] = useState(false);

    const handleSave = () => {

        if (!cpf || !name || !surname || !birthDate || !email || !gender) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return;
        }

        if (!validateCPF(cpf)) {
            Alert.alert('Erro', 'CPF inválido.');
            return;
        }

        data = {
            cpf: cpf,
            nome : name,
            sobrenome : surname,
            data_nascimento : birthDate,
            email : email,
            genero : gender
        }

        console.log(data)
        axios.put(`http://192.168.18.122:8000/api/Customer/Atualiza/${customer.id}`, data)
          .then(response => {
            console.log('Customer updated', response.data);
            navigation.navigate('Home', { reload: true });
          })
          .catch(error => {
            console.error('Error updating customer', error);
          });
    };

    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
        setModalVisible(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>ID</Text>
            <TextInput
                style={styles.input}
                value={customer.id.toString()}
                editable={false}
            />

            <Text style={styles.label}>CPF</Text>
            <TextInput
                style={styles.input}
                value={cpf}
                onChangeText={setCpf}
            />

            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Sobrenome</Text>
            <TextInput
                style={styles.input}
                value={surname}
                onChangeText={setSurname}
            />

            <Text style={styles.label}>Data de Nascimento</Text>
            <TextInput
                style={styles.input}
                value={birthDate}
                onChangeText={setBirthDate}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.label}>Gênero</Text>
            <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
                <Text>{gender}</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione o Gênero</Text>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleGenderSelect('M')}
                        >
                            <Text>Masculino</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleGenderSelect('F')}
                        >
                            <Text>Feminino</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalOption, styles.modalCancel]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#6200EE',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalOption: {
        padding: 15,
        alignItems: 'center',
        width: '100%',
    },
    modalCancel: {
        marginTop: 10,
        backgroundColor: '#f5f5f5',
    },
});
