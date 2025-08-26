import styles from './Loader.module.css'
import {GridLoader} from 'react-spinners'
const Loader = () => {
    return (
    <div className={styles.loader}>
    <GridLoader data-testid="grid-loader"/>
    <p>Loading...</p>
    </div>)
}

export default Loader