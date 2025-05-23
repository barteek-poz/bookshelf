import { ConfigProvider, Select } from "antd";
import useFetch from "../../hooks/useFetch";
import upperFirstLetter from "../../helpers/upperFirstLetter";

const GenreSelect = ({ value, defaultValue, setInputData }) => {
  const {data: genresData} = useFetch("http://localhost:3000/api/v1/genres");
  const genresCapitalized = genresData?.map((genre) => {
    return { ...genre, label: upperFirstLetter(genre.label) };
  });
  
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            activeBorderColor: "#11243a",
            hoverBorderColor: "#11243a",
          },
        },
      }}>
      {genresData && (
        <Select
          defaultValue={defaultValue || null}
          value={value || undefined}
          onChange={(e) => {
            setInputData((prev) => ({ ...prev, genre: e }));
          }}
          showSearch
          placeholder="Select genre"
          options={genresCapitalized}
          name="genre"
          id="genre"
        />
      )}
    </ConfigProvider>
  );
};

export default GenreSelect;
