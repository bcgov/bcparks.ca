import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import HtmlContent from "./htmlContent"

export const ParkContact = ({ contact }) => {
  const facilityOperatorContact = contact.facilityOperatorContact
  const links = contact.links.length > 0 ? contact.links :
    facilityOperatorContact.defaultLinks.length > 0 ? facilityOperatorContact.defaultLinks : []

  return (
    <tr>
      <th>
        {contact.title ? contact.title : facilityOperatorContact.defaultTitle}
      </th>
      <td>
        <HtmlContent>
          {contact.content.data.content ?
            contact.content.data.content : facilityOperatorContact.defaultContent.data.defaultContent}
        </HtmlContent>
        {links.length > 0 && links.map((link, index) => (
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
  )
}

export default function Contact({ contact, parkContacts, hasReservations }) {
  // Filter contacts by isActive and sort by rank
  const sortedContacts =
    parkContacts.filter(contact => contact.isActive).sort((a, b) => {
      return a.rank - b.rank
    })

  return (
    <div id="contact" className="anchor-link">
      <h2 className="section-heading">Contact</h2>
      {sortedContacts.length > 0 ? (
        <figure class="table">
          <table>
            <tbody>
              {/* display if parkOperation.hasReservations is true  */}
              {hasReservations && (
                <tr>
                  <th>Reservations, changes, and cancellations</th>
                  <td>
                    <p>
                      Our call centre is open from 7 am to 7 pm Pacific Time.
                      There is a $5 fee for reservations, changes, or cancellations made by phone.
                    </p>
                    <p>
                      <FontAwesomeIcon icon="fa-regular fa-phone" />
                      1-800-689-9025 (toll-free from Canada or the US)
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
                      <a href="https://refund.bcparks.ca/">Live chat</a>
                    </p>
                  </td>
                </tr>
              )}
              {sortedContacts.map((contact, index) => (
                <ParkContact key={index} contact={contact} />
              ))}
              {/* display this info always */}
              <tr>
                <th>General questions and feedback for BC Parks</th>
                <td>
                  <p>
                    We answer emails weekdays from 9 am to 5 pm Pacific Time.
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
