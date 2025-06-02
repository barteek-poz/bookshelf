import { storeAccessToken } from "../helpers/authTokenStore";

const tokenLoader = async () => {
    const refreshRes = await fetch("http://localhost:3000/api/v1/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });
    
      if (!refreshRes.ok) {
        throw new Response("Unauthorized", { status: 401 });
      }
    
      const refreshData = await refreshRes.json();
      const accessToken = refreshData.accessToken;
      storeAccessToken(accessToken);
    
      if (!accessToken) {
        throw new Response("Unauthorized", { status: 401 });
      }
    
      return null;
  };
  

export default tokenLoader;
