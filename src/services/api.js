/**
 * Generic API Client Abstraction
 * Designed for future backend integration (JWT Auth, Error Interception)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const apiClient = async (endpoint, options = {}) => {
  // Setup headers and potentially inject JWT tokens here
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // const token = localStorage.getItem("accessToken");
  // if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Intercept 401 Unauthorized for token refreshes here
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Handle generic 204 No Content
    if (response.status === 204) return null;
    
    return await response.json();
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};
