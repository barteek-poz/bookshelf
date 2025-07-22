import styles from './Loader.module.css'
import {GridLoader} from 'react-spinners'
const Loader = () => {
    return (
    <div className={styles.loader}>
    <GridLoader/>
    <p>Loading...</p>
    </div>)
}

export default Loader