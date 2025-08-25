import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import BookCoverInput from "./BookCoverInput";

test("uploading new book cover", async () => {
    const setCover = jest.fn()
    const coverPreviewHandler = jest.fn()
  render(
    <MemoryRouter>
      <BookCoverInput setCover={setCover} coverPreviewHandler={coverPreviewHandler} />
    </MemoryRouter>
  );
  const input = screen.getByLabelText("Select book cover");
  expect(input).toBeInTheDocument();
  const mockFile = new File(["mock cover img"], "cover.png", { type: "image/png" });

  await userEvent.upload(input,mockFile);
  await waitFor(()=>{
    expect(setCover).toHaveBeenCalledWith(mockFile)
    expect(coverPreviewHandler).toHaveBeenCalledWith(mockFile)
  })
});
