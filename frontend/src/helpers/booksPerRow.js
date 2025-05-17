export const booksPerRow = (windowWidth) => {
  if (windowWidth >= 1450) {
    return 5;
  } else if (windowWidth >= 900) {
    return 4;
  } else if (windowWidth >= 600) {
    return 3;
  } else {
    return 1;
  }
};
