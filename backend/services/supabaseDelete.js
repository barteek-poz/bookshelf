import supabase from "../config/supabase.js"
const supabaseDelete = async (bookId, coverId) => {
    try {
        const {data,error} = await supabase
        .storage
        .from('book-shelf')
        .remove([`${bookId}/${coverId}`])

        if(error) {
            console.error("Failed to delete book from storage:", error);
            throw error
        }
        
    }catch(error) {
        return res.status(405).json({ error});
    }
}

export default supabaseDelete