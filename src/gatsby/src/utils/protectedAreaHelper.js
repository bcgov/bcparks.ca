import axios from "axios"
import qs from "qs"

const loadProtectedArea = (apiBaseUrl, orcs) => {
  const params = qs.stringify(
    {
      fields: ["hasCampfireBan"],
      populate: {
        parkGate: {
          fields: [
            "hasGate",
            "gateOpenTime",
            "gateCloseTime",
            "gateOpensAtDawn",
            "gateClosesAtDusk",
            "gateOpen24Hours",
          ],
        },
      },
      pagination: {
        limit: 100,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )
  return axios.get(`${apiBaseUrl}/protected-areas/${orcs}?${params}`)
}

export { loadProtectedArea }
