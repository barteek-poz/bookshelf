import { useContext } from "react"
import { AuthContext, AuthContextType } from "../context/AuthContext"

//hook to check if user is not null in every component
const useAuthUser = () => {
    const authContext = useContext<AuthContextType | null>(AuthContext)
    if(!authContext || !authContext.user) {
        throw new Error('User is not authenticated')
    }
return {
    ...authContext, 
    user: authContext.user
}
}

export default useAuthUser