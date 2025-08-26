import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import Loader from "./Loader"

test("renders loader elements", ()=>{
    render(
        <MemoryRouter>
            <Loader/>
        </MemoryRouter>
    )
    expect(screen.getByTestId("grid-loader")).toBeInTheDocument()
    expect(screen.getByText("Loading...")).toBeInTheDocument()
})