export type BookDataType = {
    id: number ,
    title: string, 
    author: string, 
    createdBy: number, 
    coverUrl: string | null, 
    genre: string | null, 
    publishYear?: number | null
  }

  export type BookGenreType = {
    option: string,
    label: string
   }