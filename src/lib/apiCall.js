const API_BASE_URL = "http://localhost:8086";

/**
 * Makes an API call to the backend
 * @param {string} endpoint - API endpoint (e.g., "/collections")
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object|null} body - Request body (will be JSON stringified)
 * @returns {Promise} Promise that resolves with the response data
 */
const apiCall = async (endpoint, method, body = null) => {
  const payload = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

    if (body) {
      payload.body = JSON.stringify(body);
    }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, payload);

    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use statusText
      }
      throw new Error(errorMessage);
        }

    return await response.json();
  } catch (error) {
    // Re-throw with more context if it's not already an Error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.message || "Network request failed");
  }
};

const fetchWrapper = { apiCall };

export default fetchWrapper;
