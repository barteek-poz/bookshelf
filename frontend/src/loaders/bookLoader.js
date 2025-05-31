import { getAccessToken } from "../helpers/authTokenStore";

const bookLoader = async ({ params }) => {
	const accessToken = getAccessToken();
	const bookId = params.id;
	console.log(accessToken)
	const response = await fetch(`http://localhost:3000/api/v1/books/${bookId}`, {
	  headers: { Authorization: `Bearer ${accessToken}` },
	});
  
	if (!response.ok) {
		throw new Response("Could not load the book", { status: response.status });	}
  
	return await response.json();
  };
  

export default bookLoader;
