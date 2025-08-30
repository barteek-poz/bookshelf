import { ConfigProvider, Select } from "antd";
import { Controller } from "react-hook-form";
import upperFirstLetter from "../../helpers/upperFirstLetter";
import useFetch from "../../hooks/useFetch";
import { BookGenreType, GenreSelectType } from "../../types/bookTypes";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useEffect } from "react";

const GenreSelect = ({ defaultValue, control}:GenreSelectType) => {
  const { data: genresData, error } = useFetch<BookGenreType[]>("https://bookshelf-nou0.onrender.com/api/v1/genres");
  const {errorHandler} = useErrorHandler()
  const genresCapitalized = genresData?.map((genre) => {
    return { ...genre, label: upperFirstLetter(genre.label) };
  });
  useEffect(()=> {
    if(error) {
      errorHandler("Sorry, but something went wrong and we could not load the book page. Please refresh the page or try again later.")
    }
  },[error])
  
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
              aria-label="Select genre"
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
