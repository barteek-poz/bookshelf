import styles from "./ErrorPage.module.css"
import { useNavigate } from "react-router"
import { useError } from "../../context/ErrorContext"
import { useEffect } from "react"

const ErrorPage = () => {
    const {errorMsg} = useError()
    const navigate = useNavigate()
    useEffect(()=>{
        if(!errorMsg){
            navigate("/")
        }
    },[errorMsg])
    return <h1 className={styles.errorMsg}>{errorMsg}</h1>
}

export default ErrorPage