export const booksPerRow = (windowWidth) => {
  if (windowWidth >= 2300) {
    return 7;
  } else if(windowWidth >= 2000) {
    return 6
  } else if(windowWidth >= 1700) {
    return 5
  } else if (windowWidth >= 1400) {
    return 4;
  } else if (windowWidth >= 1100) {
    return 3;
  } else if (windowWidth >= 800) {
    return 2
  } 
  else {
    return 1;
  }
};
