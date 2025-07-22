import { Control } from "react-hook-form"

export type BookDataType = {
    id: number ,
    title: string, 
    author: string, 
    createdBy?: number, 
    coverUrl: string | null, 
    genre?: string | null, 
    publishYear?: number | null
  }

 export type SingleBookType = {
  id: number ,
    title: string, 
    author: string, 
    coverUrl: string | null, 
 }

  export type BookInputType = {
    title: string, 
    author: string, 
    coverUrl?: string | null, 
    genre?: string | null, 
    publishYear?: number | null
  }

  export type BookCoverInputTypes = {
    setCover: React.Dispatch<React.SetStateAction<File | null>>,
    coverPreviewHandler: (coverFile: File) => void
  }

  export type BookPropositionsType = {
    existingBooks: BookDataType[],
    previewExistingBookHandler: (book: BookDataType) => void
  }

  export type BookRowType = {
    books: BookDataType[]
  }

  export type BookGenreType = {
   option: string,
   label: string
  }

  export type GenreSelectType = {
    control: Control<BookInputType, any, BookInputType>,
    defaultValue: string | null | undefined
  }