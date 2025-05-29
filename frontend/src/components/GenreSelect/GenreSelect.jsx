import styles from "./GenreSelect.module.css";
import { ConfigProvider, Select } from "antd";
import useFetch from "../../hooks/useFetch";
import upperFirstLetter from "../../helpers/upperFirstLetter";
import { Controller } from "react-hook-form";

const GenreSelect = ({ defaultValue, control}) => {
  const { data: genresData } = useFetch("http://localhost:3000/api/v1/genres");
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
        <Controller
          name="genre"
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Select genre"
              options={genresCapitalized}
              className="genreSelect"
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      )}
    </ConfigProvider>
  );
};

export default GenreSelect;
