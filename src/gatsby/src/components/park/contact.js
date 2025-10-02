import React from "react"
import FontAwesome from "../fontAwesome"
import HtmlContent from "../htmlContent"

// Helper function to get href prefix based on the contactType
const getPrefix = (contactType) => {
  switch (contactType) {
    case "Email":
      return "mailto:"
    case "Phone":
      return "tel:"
    default:
      return ""
  }
}
// Helper function to get the icon based on the contactType
const getIcon = (contactType) => {
  switch (contactType) {
    case "Email":
      return "envelope"
    case "Phone":
      return "phone"
    case "Website":
      return "laptop"
    case "Chat":
      return "messages"
    case "Facebook":
      return "facebook"
    case "Instagram":
      return "instagram"
    case "X-twitter":
      return "x-twitter"
    default:
      return ""
  }
}

export const ParkContact = ({ contact }) => {
  const parkOperatorContact = contact.parkOperatorContact
  const links = contact.contactInformation.length > 0 ? contact.contactInformation :
    parkOperatorContact?.defaultContactInformation?.length > 0 ? parkOperatorContact.defaultContactInformation : []

  return (
    <tr>
      <th scope="row">
        {contact.title ? contact.title : parkOperatorContact?.defaultTitle}
      </th>
      <td>
        {(contact.description.data.description ||
          parkOperatorContact?.defaultDescription?.data?.defaultDescription) &&
          <HtmlContent>
            {contact.description.data.description ||
              parkOperatorContact?.defaultDescription?.data?.defaultDescription}
          </HtmlContent>
        }
        {links.length > 0 && links.map((link, index) => (
          <p key={index}>
            <FontAwesome icon={getIcon(link.contactType)} />
            {link.contactUrl !== null ?
              <a href={`${getPrefix(link.contactType)}${link.contactUrl}`}>
                <span className="visually-hidden">{link.contactType}: </span>{link.contactText}
              </a>
              :
              link.contactText
            }
          </p>
        ))}
      </td>
    </tr>
  )
}

export default function Contact({ contact, parkContacts, operations }) {
  // Filter contacts by isActive and sort by rank
  const sortedContacts =
    parkContacts.filter(contact => contact.isActive).sort((a, b) => {
      return a.rank - b.rank
    })
  const hasAnyReservations =
    operations.hasCanoeCircuitReservations ||
    operations.hasGroupPicnicReservations ||
    operations.hasFrontcountryReservations ||
    operations.hasFrontcountryGroupReservations ||
    operations.hasFrontcountryCabinReservations ||
    operations.hasBackcountryReservations ||
    operations.hasBackcountryGroupReservations ||
    operations.hasBackcountryShelterReservations ||
    operations.hasBackcountryWildernessReservations

  return (
    <div id="contact" className="anchor-link">
      <h2 className="section-heading">Contact</h2>
      {contact === "" ? (
        <figure className="table">
          <table>
            <tbody>
              {/* display it if hasAnyReservations is true  */}
              {hasAnyReservations && (
                <tr>
                  <th scope="row">Reservations, changes, and cancellations</th>
                  <td>
                    <p>
                      Our call centre is open from 7 am to 7 pm Pacific Time.
                      There is a $5 fee for reservations, changes, or cancellations made by phone.
                    </p>
                    <p>
                      <FontAwesome icon="phone" />
                      <a href="tel:+18006899025">
                        <span className="visually-hidden">Phone number: </span>1-800-689-9025
                      </a> (toll-free from Canada or the US)
                    </p>
                    <p>
                      <FontAwesome icon="phone" />
                      <a href="tel:+15198586161">
                        <span className="visually-hidden">Phone number: </span>1-519-858-6161
                      </a> (international)
                    </p>
                    <p>
                      <FontAwesome icon="laptop" />
                      <a href="https://camping.bcparks.ca/contact">
                        Contact form and live chat
                      </a>
                    </p>
                  </td>
                </tr>
              )}
              {sortedContacts.length > 0 && sortedContacts.map((contact, index) => (
                <ParkContact key={index} contact={contact} />
              ))}
              {/* display it always */}
              <tr>
                <th scope="row">General questions and feedback for BC Parks</th>
                <td>
                  <p>
                    We answer emails weekdays from 9 am to 5 pm Pacific Time.
                  </p>
                  <p>
                    <FontAwesome icon="envelope" />
                    <a href="mailto:parkinfo@gov.bc.ca">
                      <span className="visually-hidden">Email: </span>parkinfo@gov.bc.ca
                    </a>
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
