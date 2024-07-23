import React from "react"
import HtmlContent from "./htmlContent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ParkContact = ({ title, content, links }) => {
  return (
    <>
      <th>{title}</th>
      <td>
        <HtmlContent>{content}</HtmlContent>
        {links.map((link, index) => (
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
    </>
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
                <tr key={index}>
                  {contact.facilityOperatorOverride ? (
                    <ParkContact
                      title={contact.facilityOperatorContact.defaultTitle}
                      content={contact.facilityOperatorContact.defaultContent.data.defaultContent}
                      links={contact.facilityOperatorContact.defaultLinks}
                    />
                  ) : (
                    <ParkContact
                      title={contact.title}
                      content={contact.content.data.content}
                      links={contact.links}
                    />
                  )}
                </tr>
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
