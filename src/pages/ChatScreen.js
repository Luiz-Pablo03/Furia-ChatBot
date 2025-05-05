import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    FlatList,
    ActivityIndicator,
    Platform,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { FontAwesome, Entypo } from "@expo/vector-icons";

import { useChatLogic } from '../configuration/services/ChatLogic';

const ChatScreen = () => {
    const {
        messages,
        userInput,
        loading,
        isSpeaking,
        setUserInput,
        sendMessage,
        toggleSpeech,
        clearMessages
    } = useChatLogic();

    // Esta é a interface que será renderizada assim que o componente ChatScreen for montado.
    return (
        <SafeAreaView style={styles.safeArea}>
             <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
            <FlatList
                data={messages} // Usando o estado 'messages' do hook
                renderItem={renderMessage} // Chama a função renderMessage definida abaixo
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageListContent}
                style={styles.messageList}
            />

            {loading && ( // Usamos o estado 'loading' do hook
                <View style={styles.loadingIndicatorContainer}>
                    <ActivityIndicator size="small" color="#007bff" />
                    {/* Texto do loading envolto em <Text> para corrigir o erro */}
                    <Text style={styles.loadingText}>Aguardando resposta...</Text>
                </View>
            )}

            {/* Barra de Input para digitar e enviar mensagens */}
            <View style={styles.inputContainer}>
                {/* Botão para controlar a fala (Texto-para-Voz) */}
                <TouchableOpacity style={styles.iconButton} onPress={toggleSpeech}> {/* Usando a função toggleSpeech do hook */}
                    <FontAwesome
                        name={isSpeaking ? "volume-up" : "volume-off"} // Usando o estado 'isSpeaking' do hook
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>

                <TextInput
                    placeholder="Digite sobre o time de CS..."
                    onChangeText={setUserInput} 
                    value={userInput}
                    onSubmitEditing={sendMessage}
                    style={styles.input}
                    placeholderTextColor="#999"
                    editable={!loading} 
                    multiline={true} 
                    maxHeight={100} 
                />

                {/* Botão para enviar a mensagem */}
                <TouchableOpacity
                    style={[
                        styles.iconButton,
                        styles.sendButton, // Estilo específico do botão enviar
                        (!userInput.trim() || loading) && styles.sendButtonDisabled // Estilo para estado desabilitado
                    ]}
                    onPress={sendMessage} 
                    disabled={!userInput.trim() || loading}
                >
                    <FontAwesome name="send" size={20} color="white" /> // Ícone de enviar
                </TouchableOpacity>

                {/* Botão para limpar o chat */}
                <TouchableOpacity
                    style={[styles.iconButton, styles.clearButton]} // Estilo específico do botão limpar
                    onPress={clearMessages} 
                    disabled={loading}
                >
                    <Entypo name="trash" size={24} color="white" /> // Ícone de lixo
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    // Definição da função renderMessage. Esta função é usada pela FlatList acima.
    function renderMessage({ item }) {
         return (
            <View style={[
                styles.messageContainer, // Estilo base da bolha
                item.user ? styles.userMessageContainer : styles.aiMessageContainer, // Estilo condicional usuário vs IA
                item.isError && styles.errorMessageContainer // Estilo condicional para mensagens de erro
            ]}>
          
                <Text style={[
                    styles.messageText, // Estilo base do texto
                    item.user ? styles.userMessageText : styles.aiMessageText, // Estilo condicional texto usuário vs IA
                    item.isError && styles.errorMessageText // Estilo condicional para texto de erro
                ]}>
                    {item.text}
                </Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },

    messageList: {
        flexGrow: 1,
    },
    messageListContent: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        paddingTop: 40,
    },
    messageContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        borderRadius: 20,
        maxWidth: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1.5,
        elevation: 2,
    },
    aiMessageContainer: {
        backgroundColor: "#e9e9eb",
        alignSelf: 'flex-start',
        marginRight: '15%',
    },
    userMessageContainer: {
        backgroundColor: '#007bff',
        alignSelf: 'flex-end',
        marginLeft: '15%',
    },
    errorMessageContainer: {
        backgroundColor: '#ffebee',
        alignSelf: 'stretch',
        marginVertical: 10,
        padding: 15,
        borderColor: '#f44336',
        borderWidth: 1,
        borderRadius: 8,
        maxWidth: '95%',
        marginHorizontal: 10,
        elevation: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    aiMessageText: {
        color: '#212121',
    },
    userMessageText: {
        color: 'white',
    },
    errorMessageText: {
        color: '#b71c1c',
        fontStyle: 'italic',
        textAlign: 'center',
        fontSize: 15,
    },

    loadingIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginBottom: 10,
        backgroundColor: 'transparent',
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#555',
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 10,
        top: -45,
        backgroundColor: "#fff",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: "#ccc",
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    input: {
        flex: 1,
        paddingHorizontal: 18,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 25,
        minHeight: 50,
        fontSize: 16,
        color: "#333",
        marginHorizontal: 8,
    },
    iconButton: {
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
        backgroundColor: '#555',
    },
    sendButton: {
        backgroundColor: '#007bff',
    },
    sendButtonDisabled: {
        backgroundColor: '#b0c4de',
        opacity: 0.7,
    },
    clearButton: {
        backgroundColor: '#dc3545',
        marginLeft: 5,
    },

});

export default ChatScreen;