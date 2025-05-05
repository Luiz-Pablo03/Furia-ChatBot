import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDXAEAJ449u7g01tF6d-YZq6ueOnX3Nen4"; // <-- chave de API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Envia uma mensagem para a API do Google Gemini.
 * @param {string} promptText O texto do prompt a ser enviado.
 * @returns {Promise<{text: string | null, error: string | null}>} Um objeto contendo o texto da resposta ou uma mensagem de erro.
 */

export const sendMessageToGemini = async (promptText) => {
    if (!promptText || promptText.trim() === "") {
        return { text: null, error: "O prompt não pode estar vazio." };
    }

    try {

        const result = await model.generateContent(promptText);
        const response = result.response;
        const text = response.text();

        return { text, error: null }; // Retorna o texto gerado e nenhum erro
    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        // Retorna null para o texto e uma mensagem de erro
        return { text: null, error: "Falha ao obter resposta da IA." };
    }
};
