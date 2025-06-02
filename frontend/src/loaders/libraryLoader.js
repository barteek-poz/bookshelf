import { storeAccessToken} from "../helpers/authTokenStore";
import {jwtDecode} from 'jwt-decode'
const libraryLoader = async () => {
  const refreshRes = await fetch("http://localhost:3000/api/v1/auth/refresh-token", {
    method: "POST",
    credentials: "include", 
  });

  if (!refreshRes.ok) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const refreshData = await refreshRes.json();
  const accessToken = refreshData.accessToken
  storeAccessToken(refreshData.accessToken);

  const userId = jwtDecode(accessToken).id

  const res = await fetch(`http://localhost:3000/api/v1/users/${userId}/books`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Response("Failed to load books", { status: res.status });
  }

  return await res.json();
};

export default libraryLoader