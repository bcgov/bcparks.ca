import { useEffect } from "react"

const useSnowplowTracking = () => {
	useEffect(() => {
		if (typeof window.snowplow === "function") {
			window.snowplow("trackPageView")
			window.snowplow("refreshLinkClickTracking")
		}
		// empty dependency array ensures this runs on mount and unmount
	}, [])
}

export default useSnowplowTracking