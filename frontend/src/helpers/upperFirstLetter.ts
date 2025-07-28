const upperFirstLetter = (phrase:string) => {
    const capitalizedPhrase = phrase[0].toUpperCase() + phrase.slice(1)
    return capitalizedPhrase
}

export default upperFirstLetter