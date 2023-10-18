import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Typeahead, ClearButton, Menu, MenuItem } from "react-bootstrap-typeahead"
import "react-bootstrap-typeahead/css/Typeahead.css"

const HighlightText = ({ park, input }) => {
	const words = park.split(" ")
	return (
		words.map((word, index) => {
			if (word.toLowerCase() === input) {
				return <span key={index}> {word} </span>
			} else {
				return <b key={index}> {word} </b>
			}
		})
	)
}

const CityNameSearch = ({ optionLimit, handleClick, handleKeyDown }) => {
	// it will be replaced with city name collection
	const data = useStaticQuery(graphql`
    query {
      allStrapiProtectedArea(
        sort: {protectedAreaName: ASC}
        filter: {isDisplayed: {eq: true}}
      ) {
				nodes {
					protectedAreaName
				}
      }
    }
  `)

	const parks = data?.allStrapiProtectedArea?.nodes || []
	const [selectedCity, setSelectedCity] = useState([])
	const [searchText, setSearchText] = useState("")

	const handleInputChange = (text) => {
		if (text.length) {
			setSearchText(text)
		}
	}

	return (
		<Typeahead
			id="city-search-typehead"
			minLength={1}
			// filterBy={() => true}
			// isLoading={isSearchNameLoading}
			labelKey={park => `${park.protectedAreaName}`}
			options={parks.slice(0, optionLimit)}
			selected={selectedCity}
			// onSearch={handleSearchName}
			onChange={setSelectedCity}
			onInputChange={handleInputChange}
			placeholder="Near a city"
			className="city-search-typeahead"
			isInvalid={false}
			renderMenu={(parks, menuProps) => (
				<Menu {...menuProps}>
					{parks.map((park, index) => (
						<MenuItem option={park} position={index}>
							<HighlightText
								park={park.protectedAreaName}
								input={searchText}
							/>
						</MenuItem>
					))}
					<MenuItem>Current location</MenuItem>
				</Menu>
			)}
		>
			{({ onClear, selected }) =>
				(!!selected.length || searchText?.length > 0) && (
					<div className="rbt-aux">
						<ClearButton
							onClick={() => {
								onClear()
								handleClick()
							}}
							onKeyDown={(e) => {
								onClear()
								handleKeyDown(e)
							}}
						/>
					</div>
				)}
		</Typeahead>
	)
}

export default CityNameSearch