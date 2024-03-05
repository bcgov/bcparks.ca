import React from "react"
import renderer from "react-test-renderer"
import CampfireBan from "../../src/components/campfireBan"

// Sample test adapted from https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/
describe("CampfireBan", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<CampfireBan />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})