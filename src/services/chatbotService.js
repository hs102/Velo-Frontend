/**
 * Chatbot service for AI chat interactions
 */
import api from './api';

/**
 * Send a message to the chatbot
 * @param {string} message - The user's message
 * @param {object} context - Optional context (projects, tasks data)
 * @returns {Promise} - API response with chatbot reply
 */
export const sendMessage = async (message, context = null) => {
  try {
    const payload = {
      message,
      context
    };
    
    const response = await api.post('/ai/chat', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const chatbotService = {
  sendMessage
};

export default chatbotService;
