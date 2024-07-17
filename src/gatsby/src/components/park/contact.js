import React from "react"
import HtmlContent from "./htmlContent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Contact({ contact, parkContacts, hasReservations }) {
  const filteredContacts = parkContacts.filter(contact => contact.isActive)

  return (
    <div id="contact" className="anchor-link">
      <h2 className="section-heading">Contact</h2>
      {filteredContacts.length > 0 ? (
        <figure class="table">
          <table>
            <tbody>
              {/* display if parkOperation.hasReservations is true  */}
              {hasReservations && (
                <tr>
                  <th>Camping reservations, changes, and cancellations</th>
                  <td>
                    <p>
                      Our call centre is open from 7am to 7pm Pacific Time.
                      There is a $5 fee for camping reservations, changes, or cancellations made by phone,
                      but no charge for general information calls.
                    </p>
                    <p>
                      <FontAwesomeIcon icon="fa-regular fa-phone" />
                      1-800-689-9025 (toll free from Canada or the US)
                    </p>
                    <p>
                      <FontAwesomeIcon icon="fa-regular fa-phone" />
                      1-519-858-6161 (international)
                    </p>
                    <p>
                      <FontAwesomeIcon icon="fa-regular fa-laptop" />
                      <a href="https://refund.bcparks.ca/">Contact form</a>
                    </p>
                    <p>
                      <FontAwesomeIcon icon="fa-regular fa-messages" />
                      <a href="https://refund.bcparks.ca/">Live chat (open 7am to 7pm Pacific Time)</a>
                    </p>
                  </td>
                </tr>
              )}
              {filteredContacts.map((contact, index) => (
                <tr key={index}>
                  <th>{contact.title}</th>
                  <td>
                    <HtmlContent>{contact.content.data.content}</HtmlContent>
                    {contact.links.map((link, index) => (
                      <p key={index}>
                        <FontAwesomeIcon icon={`fa-regular fa-${link.icon}`} />
                        {link.linkUrl !== null ?
                          <a href={(link.icon === "envelope" ? "mailto:" : "") + link.linkUrl}>
                            {link.linkText}
                          </a>
                          :
                          link.linkText
                        }
                      </p>
                    ))}
                  </td>
                </tr>
              ))}
              {/* display this info always */}
              <tr>
                <th>General questions and feedback for BC Parks</th>
                <td>
                  <p>
                    We answer emails weekdays from 9am to 5pm Pacific Time.
                    We make every effort to respond within a week, but it may take longer during peak summer season.
                  </p>
                  <p>
                    <FontAwesomeIcon icon="fa-regular fa-envelope" />
                    <a href="mailto:parkinfo@gov.bc.ca">parkinfo@gov.bc.ca</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </figure>
      ) : (
        <HtmlContent>{contact}</HtmlContent>
      )}
    </div>
  )
}
