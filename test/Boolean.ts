import { constFalse, constTrue } from "fp-ts/function"
import {
  invert,
  and,
  or,
  xor,
  allPass,
  anyPass,
  both,
  either,
} from "../src/Boolean"

describe("Boolean", () => {
  describe("invert", () => {
    const f = invert

    it("inverts", () => {
      expect(f(true)).toBe(false)
      expect(f(false)).toBe(true)
    })
  })

  describe("and", () => {
    const f = and

    it("returns true for both true", () => {
      expect(f(true)(true)).toBe(true)
    })

    it("returns false for anything else", () => {
      expect(f(true)(false)).toBe(false)
      expect(f(false)(true)).toBe(false)
      expect(f(false)(false)).toBe(false)
    })
  })

  describe("or", () => {
    const f = or

    it("returns false for both false", () => {
      expect(f(false)(false)).toBe(false)
    })

    it("returns true for anything else", () => {
      expect(f(true)(true)).toBe(true)
      expect(f(true)(false)).toBe(true)
      expect(f(false)(true)).toBe(true)
    })
  })

  describe("xor", () => {
    const f = xor

    it("returns true for one true and one false", () => {
      expect(f(true)(false)).toBe(true)
      expect(f(false)(true)).toBe(true)
    })

    it("returns false for anything else", () => {
      expect(f(true)(true)).toBe(false)
      expect(f(false)(false)).toBe(false)
    })
  })

  describe("allPass", () => {
    const f = allPass

    it("returns true if all predicates succeed", () => {
      expect(f([constTrue, constTrue, constTrue])(null)).toBe(true)
    })

    it("returns false if any predicate fails", () => {
      expect(f([constTrue, constFalse, constTrue])(null)).toBe(false)
    })
  })

  describe("anyPass", () => {
    const f = anyPass

    it("returns true if any predicate succeeds", () => {
      expect(f([constFalse, constTrue, constFalse])(null)).toBe(true)
    })

    it("returns false if all predicates fail", () => {
      expect(f([constFalse, constFalse, constFalse])(null)).toBe(false)
    })
  })

  describe("both", () => {
    const f = both<number>(x => x > 5)(x => x % 2 === 0)

    it("fails if only first predicate fails", () => {
      expect(f(4)).toBe(false)
    })

    it("fails if only second predicate fails", () => {
      expect(f(7)).toBe(false)
    })

    it("fails if both predicates fail", () => {
      expect(f(3)).toBe(false)
    })

    it("succeeds if both predicates succeed", () => {
      expect(f(6)).toBe(true)
    })

    it("short circuiting if first predicate fails", () => {
      const snd = jest.fn().mockImplementation(constTrue)
      const g = both<number>(constFalse)(snd)

      expect(g(8)).toBe(false)
      expect(snd).not.toBeCalledWith(8)
    })
  })

  describe("either", () => {
    const f = either<number>(x => x > 5)(x => x % 2 === 0)

    it("fails if both predicates fail", () => {
      expect(f(3)).toBe(false)
    })

    it("succeeds if only first predicate succeeds", () => {
      expect(f(7)).toBe(true)
    })

    it("succeeds if only second predicate succeeds", () => {
      expect(f(4)).toBe(true)
    })

    it("succeeds if both predicates succeed", () => {
      expect(f(6)).toBe(true)
    })

    it("short circuiting if first predicate succeed", () => {
      const snd = jest.fn().mockImplementation(constFalse)
      const g = either<number>(constTrue)(snd)

      expect(g(8)).toBe(true)
      expect(snd).not.toBeCalledWith(8)
    })
  })
})
