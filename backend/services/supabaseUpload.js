import { v4 as uuidv4 } from 'uuid';
import supabase from "../config/supabase.js"

const supabaseUploadHandler = async (bookId, req,res) => {
    try {
        console.log(bookId, req);
        
        const coverID = uuidv4();
        const {data, error} = await supabase
        .storage
        .from('book-shelf')
        .upload(`${bookId}/${coverID}`, req.file.buffer, { contentType: 'image/jpeg' });
    
        if (error) {
            console.error("Failed to send file:", error);
            throw error
        }
    
        const { data:publicUrl, error: urlError } = supabase.storage
            .from('book-shelf')
            .getPublicUrl(`${bookId}/${coverID}`);
    
        if (urlError) {
            console.error("Cannot get public URL", urlError);
           throw error
        }
        return publicUrl
    } catch (error) {
        return res.status(500).json({ error});
    }   
}

export default supabaseUploadHandler