const upperFirstLetter = (phrase) => {
    const capitalizedPhrase = phrase[0].toUpperCase() + phrase.slice(1)
    return capitalizedPhrase
}

export default upperFirstLetter