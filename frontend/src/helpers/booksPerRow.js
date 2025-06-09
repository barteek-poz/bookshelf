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
  } else if (windowWidth < 1100 && windowWidth >= 900) {
    return 2
  } else if (windowWidth <= 900 && windowWidth > 850) {
    return 3
  } else if (windowWidth <= 850 && windowWidth > 530) {
    return 2
  } 
  else {
    return 1;
  }
};
