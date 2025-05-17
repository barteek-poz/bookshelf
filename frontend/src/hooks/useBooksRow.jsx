import { useState, useEffect } from "react";
import { booksPerRow } from "../helpers/booksPerRow";

export const useBooksRow = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [booksPerShelf, setBooksPerShelf] = useState(booksPerRow(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setBooksPerShelf(booksPerRow(width));
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { screenWidth, booksPerShelf };
};
