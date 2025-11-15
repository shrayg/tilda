import { RouteData, RouteRequest } from "@/types/route";
import { generateRoutes } from "./routeService";

export const fetchRoutes = async (request: RouteRequest): Promise<RouteData[]> => {
  try {
    // Generate routes directly in the frontend using routeService
    const routes = await generateRoutes(request);

    // Ensure we have routes
    if (!Array.isArray(routes) || routes.length === 0) {
      throw new Error("No routes generated");
    }

    // Validate that we have routes (up to 10)
    if (routes.length > 10) {
      console.warn(`Generated ${routes.length} routes, expected up to 10. Taking first 10.`);
      return routes.slice(0, 10);
    }

    return routes;
  } catch (error) {
    console.error("Failed to generate routes:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate routes");
  }
};

