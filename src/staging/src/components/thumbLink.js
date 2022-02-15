
import React from "react"
import "../styles/404.scss"
import { navigate } from "gatsby"

function goToLink(link) {
    navigate(link);
}

export default function ThumbLink({ imageLink, title, navLink }) {

    return (
        <>
            <button className="btn btn-outline-primary thumb-link" onClick={() => goToLink(navLink)}>
                <div>
                    <img
                        className="img-fluid img-thumbnail"
                        src={imageLink}
                        alt={title}>
                    </img>
                    <div className="mt-2 text-left">
                        <h3 className="mb-1">{title}</h3>
                        <p>Learn more</p>
                    </div>
                </div>
            </button>
        </>
    )
}