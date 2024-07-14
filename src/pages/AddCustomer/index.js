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

export default function AddCustomer({ navigation }) {
    const [cpf, setCpf] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
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

        const data = {
            cpf: cpf,
            nome: name,
            sobrenome: surname,
            data_nascimento: birthDate,
            email: email,
            genero: gender
        };

        console.log(data);
        axios.post('http://192.168.18.122:8000/api/Customer/Cadastro', data)
          .then(response => {
            console.log('Customer added', response.data);
            navigation.navigate('Home', { reload: true });
          })
          .catch(error => {
            console.error('Error adding customer', error);
            const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao adicionar o cliente.';
            Alert.alert('Erro', errorMessage);
          });
    };

    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
        setModalVisible(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
                style={[styles.input, !cpf && styles.inputError]}
                value={cpf}
                onChangeText={setCpf}
                placeholder="Digite o CPF"
            />

            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={[styles.input, !name && styles.inputError]}
                value={name}
                onChangeText={setName}
                placeholder="Digite o nome"
            />

            <Text style={styles.label}>Sobrenome</Text>
            <TextInput
                style={[styles.input, !surname && styles.inputError]}
                value={surname}
                onChangeText={setSurname}
                placeholder="Digite o sobrenome"
            />

            <Text style={styles.label}>Data de Nascimento</Text>
            <TextInput
                style={[styles.input, !birthDate && styles.inputError]}
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="Digite a data de nascimento"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, !email && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite o email"
            />

            <Text style={styles.label}>Gênero</Text>
            <TouchableOpacity
                style={[styles.input, !gender && styles.inputError]}
                onPress={() => setModalVisible(true)}
            >
                <Text>{gender || 'Selecione o gênero'}</Text>
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
    inputError: {
        borderColor: '#e74c3c',
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
