import { RouteData, RouteRequest } from "@/types/route";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchRoutes = async (request: RouteRequest): Promise<RouteData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/route`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API error: ${response.statusText}${errorText ? ` - ${errorText}` : ""}`
      );
    }

    const data: RouteData[] = await response.json();

    // Ensure we have routes
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No routes returned from backend");
    }

    // Validate that we have 10 routes (or at least some routes)
    if (data.length > 10) {
      console.warn(`Received ${data.length} routes, expected up to 10. Taking first 10.`);
      return data.slice(0, 10);
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch routes:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch routes from backend");
  }
};

