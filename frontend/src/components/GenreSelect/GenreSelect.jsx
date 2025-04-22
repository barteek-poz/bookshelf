import { ConfigProvider, Select } from 'antd';
import useFetch from '../../hooks/useFetch';
import upperFirstLetter from '../../helpers/upperFirstLetter';

const GenreSelect = ({defaultValue, setBookGenre}) => {
    const {data: genresData, error, isPending} = useFetch('http://localhost:3000/api/v1/genres')
    const genresCapitalized = genresData?.map(genre => {
        return {...genre, label:upperFirstLetter(genre.label)}
    })
    return (
        <ConfigProvider theme={{
            components: {
                Select: {
                    activeBorderColor: '#11243a',
                    hoverBorderColor: '#11243a',
                }
            }
        }}>
        {genresData && <Select defaultValue={defaultValue || null} onChange={e => setBookGenre(e)} showSearch placeholder={defaultValue ? "" : 'Select genre'} options={genresCapitalized} name='genre' id='genre'/>}
        </ConfigProvider>
    )
}

export default GenreSelect