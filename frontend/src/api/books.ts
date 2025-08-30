export const addExistingBookHandler = async (userId: number, accessToken: string, bookId: string) => {
  try {
    const response = await fetch(`https://bookshelf-nou0.onrender.com/api/v1/users/${userId}/add-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({ bookId: bookId }),
    });
    if (!response.ok) {
      throw new Error(`Could not add book`);
    }
  } catch (error) {
    alert(error);
  }
};
