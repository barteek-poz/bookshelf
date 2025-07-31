export const addExistingBookHandler = async (userId:number, accessToken:string, bookId:string) => {
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
      if (!response.ok) {
          throw new Error(`Could not add book`); 
      }
    } catch (error) {
      alert(error);
    }
  };