import { useState, useEffect, useCallback } from 'react';
import { showMessage } from 'react-native-flash-message';
import * as Speech from 'expo-speech';
import { sendMessageToGemini } from '../api/ApiConfiguration';

export const useChatLogic = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Carrega a mensagem inicial ao montar o componente
    useEffect(() => {
        const loadInitialMessage = async () => {
            setLoading(true);
            console.log("Carregando mensagem inicial...");
            const { text, error } = await sendMessageToGemini("Olá! Apresente-se brevemente como uma IA Chat Bot da Furia.");
            setLoading(false);

            if (text) {
                console.log("Resposta inicial da IA:", text);
                showMessage({
                    message: "Bem-vindo!",
                    description: text,
                    type: "info",
                    icon: "info",
                    duration: 4000,
                });
                setMessages([
                    {
                        id: Date.now().toString() + '-initial',
                        text,
                        user: false,
                    },
                ]);

                setTimeout(() => {
                    if (!isSpeaking) {
                        Speech.speak(text, {
                            language: 'pt-BR',
                            onDone: () => setIsSpeaking(false),
                            onError: (e) => { console.error("Erro na fala inicial:", e); setIsSpeaking(false); },
                        });
                        setIsSpeaking(true);
                    }
                }, 100);
            } else if (error) {
                console.error("Erro ao carregar mensagem inicial:", error);
                showMessage({
                    message: "Erro",
                    description: `Não foi possível carregar a mensagem inicial: ${error}`,
                    type: "danger",
                    icon: "danger",
                    duration: 5000,
                });
                setMessages([
                    {
                        id: Date.now().toString() + '-error-init',
                        text: `Erro ao carregar: ${error}`,
                        user: false,
                        isError: true
                    }
                ]);
            }
        };

        loadInitialMessage();

        return () => {
            Speech.stop();
            setIsSpeaking(false);
        };
    }, []); // Dependência vazia para rodar apenas uma vez

    // Função para enviar a mensagem do usuário (usando useCallback para otimização)
    const sendMessage = useCallback(async () => {
        if (!userInput.trim()) {
            return;
        }

        // Para a fala atual antes de enviar nova mensagem
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
        }

        setLoading(true);
        const userMessageText = userInput;
        const userMessage = { id: Date.now().toString() + '-user', text: userMessageText, user: true };

        // Adiciona a mensagem do usuário à lista
        setMessages(currentMessages => [...currentMessages, userMessage]);
        setUserInput(""); // Limpa o input imediatamente

        // Define o contexto para a API
        const assunto = "TIME DE COUNTER STRIKE DA ORG FURIA";
        const promptParaAPI = `Responda APENAS sobre ${assunto}. Se a pergunta não for sobre ${assunto}, diga que não foi programada para responder assuntos desse tipo. Pergunta: ${userMessageText}`;

        console.log("Enviando prompt para API:", promptParaAPI);

        try {
            // Chama a função da API com o prompt formatado
            const { text, error } = await sendMessageToGemini(promptParaAPI);

            if (text) {
                console.log("Resposta da IA:", text);
                const aiMessage = { id: Date.now().toString() + '-ai', text, user: false };
                setMessages(currentMessages => [...currentMessages, aiMessage]);

                // Inicia a fala da nova resposta da IA
                setTimeout(() => {
                    Speech.speak(text, {
                        language: 'pt-BR', // Definir idioma se necessário
                        onDone: () => setIsSpeaking(false),
                        onError: (e) => { console.error("Erro na fala:", e); setIsSpeaking(false); },
                    });
                    setIsSpeaking(true);
                }, 100);

            } else if (error) {
                console.error("Erro ao enviar mensagem para a IA:", error);
                showMessage({
                    message: "Erro de comunicação",
                    description: `Não foi possível obter resposta: ${error}`,
                    type: "danger",
                    icon: "danger",
                    duration: 5000,
                });
                setMessages(currentMessages => [...currentMessages, { id: Date.now().toString() + '-error', text: `Erro: ${error}`, user: false, isError: true }]);
            }

        } catch (unexpectedError) {
            console.error("Erro inesperado ao enviar mensagem:", unexpectedError);
            showMessage({
                message: "Erro Inesperado",
                description: `Ocorreu um erro inesperado: ${unexpectedError.message || unexpectedError}`,
                type: "danger",
                icon: "danger",
                duration: 5000,
            });
            setMessages(currentMessages => [...currentMessages, { id: Date.now().toString() + '-unexpected-error', text: `Erro inesperado: ${unexpectedError.message || unexpectedError}`, user: false, isError: true }]);
        } finally {
            setLoading(false);
        }
    }, [userInput, isSpeaking]); // Dependências do useCallback

    // Função para controlar a função de fala(Speech)
    const toggleSpeech = useCallback(() => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
        } else {
            // Tenta falar a última mensagem da IA que não seja um erro
            const lastAIMessage = messages.slice().reverse().find(msg => !msg.user && msg.text && !msg.isError);
            if (lastAIMessage?.text) {
                Speech.speak(lastAIMessage.text, {
                    language: 'pt-BR',
                    onDone: () => setIsSpeaking(false),
                    onError: (e) => { console.error("Erro na fala (toggle):", e); setIsSpeaking(false); },
                });
                setIsSpeaking(true);
            } else {
                showMessage({
                    message: "Nada para falar",
                    description: "Não há mensagens da IA para reproduzir.",
                    type: "warning",
                    icon: "warning",
                    duration: 2000,
                });
            }
        }
    }, [isSpeaking, messages]); // Dependências do useCallback

    // Função para limpar todas as mensagens
    const clearMessages = useCallback(() => {
        setMessages([]); // Limpa o array de mensagens
        Speech.stop();    // Para qualquer fala em andamento
        setIsSpeaking(false);
        setUserInput(""); // Limpa o campo de input também
        setLoading(false); // Garante que o loading seja resetado
        showMessage({
            message: "Chat Limpo",
            type: "info",
            icon: "info",
            duration: 1500,
        });
    }, []); // Sem dependências, pois reseta tudo

    // Retorna o estado e as funções para serem usados pelo componente de UI
    return {
        messages,
        userInput,
        loading,
        isSpeaking,
        setUserInput,
        sendMessage,
        toggleSpeech,
        clearMessages,
    };
};
