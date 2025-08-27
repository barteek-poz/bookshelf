import { act, renderHook } from "@testing-library/react"
import { useBooksRow } from "./useBooksRow"
import { booksPerRow } from "../helpers/booksPerRow"

describe("useBooksRow test", () => {
    beforeEach(() => {
        Object.defineProperty(window, "innerWidth", {writable: true, configurable: true, value: 1200})
    })

    test("return initial width and booksPerShelf", () => {
        const {result} = renderHook(() => useBooksRow())
        expect(result.current.screenWidth).toBe(1200)
        expect(result.current.booksPerShelf).toBe(booksPerRow(1200))
    })

    test("booksPerShelf change with window width", () => {
        const {result} = renderHook(()=>useBooksRow())
        act(()=>{
            window.innerWidth = 800
            window.dispatchEvent(new Event("resize"))
        })
        expect(result.current.screenWidth).toBe(800)
        expect(result.current.booksPerShelf).toBe(booksPerRow(800))
    })
})