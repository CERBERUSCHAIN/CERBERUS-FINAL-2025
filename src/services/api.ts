import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * API service for backend communication
 */
export const ApiService = {
  /**
   * Get health status of the API
   */
  getHealth: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/health`);
      return response.data;
    } catch (error) {
      console.error("Error checking API health:", error);
      throw error;
    }
  }
};

export default ApiService;
