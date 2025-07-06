export const addExistingBookHandler = async (userId, accessToken, bookId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/${userId}/add-book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ bookId: bookId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
          throw new Error(`Could not add book: ${data.message}`); 
      }
      return data
    } catch (error) {
      alert(error);
    }
  };