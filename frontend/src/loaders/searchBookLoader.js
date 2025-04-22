const searchBookLoader = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/books/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      const booksData = await response.json();
      setBooks(booksData.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setBooks(null);
    } 
  };