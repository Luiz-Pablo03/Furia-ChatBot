import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const logoImage = require('../components/assets/logo.png');
const backgroundImage = require('../components/assets/furia.jpg');

export default function Start() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" backgroundColor="black" />
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                {/* Overlay View - Fica atrás do conteúdo */}
                <View style={styles.overlay} />

                <View style={styles.mainContentContainer}>
                    {/* Área da Logo */}
                    <View style={styles.logoContainer}>
                        <ImageBackground source={logoImage}
                            style={styles.logo}
                            resizeMode="contain">
                        </ImageBackground>
                    </View>
                </View>

                <View style={styles.view_inf}>
                    <Text style={{ fontStyle: 'italic', color: 'white', fontSize: 18, top: -50, }}>Furia bot</Text>
                    <Text style={styles.textInf}>De torcedor pra torcedor</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChatScreen')}>
                        <Text style={styles.buttonText}>Continuar</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black',
    },
    backgroundImage: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 0,
    },
    mainContentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 1,
        marginTop: height * 0.1,
    },

    logoContainer: {
        position: 'relative', // Cria o contexto para posicionamento absoluto dos filhos
        alignItems: 'center', // Centraliza os itens horizontalmente (pode ajustar)
        justifyContent: 'center', // Centraliza os itens verticalmente (pode ajustar)
    },
    textInf: {
        position: 'absolute',
        color: 'white',
        fontSize: 18,
        top: '25%',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    logo: {
        width: width * 1.8,  // Ajuste o tamanho conforme necessário
        height: height * 1.8, // Ajuste o tamanho conforme necessário
        top: -height * 0.1,
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
    },
    view_inf: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.30,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    button: {
        backgroundColor: 'black',
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '50%',
        minWidth: 150,
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textDown: {
        color: 'white',
        fontSize: 14,
        fontStyle: 'italic',
    },
    linkButton: {},
    linkText: {
        color: '#00BFFF',
        fontSize: 14,
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        marginHorizontal: 3,
    },
});

