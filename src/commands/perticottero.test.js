import assert from "node:assert/strict"
import { describe, it, mock } from "node:test"

mock.module("../services/database.js", {
  defaultExport: null,
  namedExports: { migrate: () => {} },
})

const { formatDuration } = await import("./perticottero.js")

describe("formatDuration", () => {
  it("returns '0 seconds' for 0ms", () => {
    assert.equal(formatDuration(0), "0 seconds")
  })

  it("returns singular units correctly", () => {
    const oneOfEach = (1 * 86400 + 1 * 3600 + 1 * 60 + 1) * 1000
    assert.equal(formatDuration(oneOfEach), "1 day, 1 hour, 1 minute, 1 second")
  })

  it("returns plural units correctly", () => {
    const ms = (3 * 86400 + 5 * 3600 + 12 * 60 + 45) * 1000
    assert.equal(formatDuration(ms), "3 days, 5 hours, 12 minutes, 45 seconds")
  })

  it("omits zero units", () => {
    const twoDays = 2 * 86400 * 1000
    assert.equal(formatDuration(twoDays), "2 days")
  })

  it("handles hours and seconds only", () => {
    const ms = (2 * 3600 + 30) * 1000
    assert.equal(formatDuration(ms), "2 hours, 30 seconds")
  })

  it("handles only seconds", () => {
    assert.equal(formatDuration(5000), "5 seconds")
  })

  it("handles only minutes", () => {
    assert.equal(formatDuration(10 * 60 * 1000), "10 minutes")
  })

  it("ignores sub-second remainder", () => {
    assert.equal(formatDuration(999), "0 seconds")
  })

  it("handles exactly 24 hours as 1 day", () => {
    assert.equal(formatDuration(24 * 3600 * 1000), "1 day")
  })
})
