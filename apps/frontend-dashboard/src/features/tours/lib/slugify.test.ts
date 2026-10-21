import { describe, expect, it } from "vitest";
import { slugifyRussian } from "./slugify";

describe("slugifyRussian", () => {
  it("transliterates a Russian tour title", () => {
    expect(slugifyRussian("Семейный тур в Дубай")).toBe("semeynyy-tur-v-dubay");
  });

  it("normalizes punctuation and spaces", () => {
    expect(slugifyRussian("  Ёлки & горы!  ")).toBe("yolki-gory");
  });
});
