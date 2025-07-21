export type BookDataType = {
    id: number ,
    title: string, 
    author: string, 
    createdBy: number, 
    coverUrl: string, 
    genre: string, 
    publishYear: number
  }

  export type BookInputType = {
    title: string, 
    author: string, 
    coverUrl?: string, 
    genre?: string | null, 
    publishYear?: number | null
  }