import React from "react"
import renderer from "react-test-renderer"
import Footer from "../../src/components/footer"

// Sample test adapted from https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/
describe("Footer", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Footer />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})