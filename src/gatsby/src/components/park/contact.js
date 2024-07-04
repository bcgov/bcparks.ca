import React from "react"
import HtmlContent from "./htmlContent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Contact({ contact, parkContacts }) {
  const filteredContacts = parkContacts.filter(contact => contact.isActive)

  return (
    <div id="contact" className="anchor-link">
      <h2 className="section-heading">Contact</h2>
      {filteredContacts.length > 0 ? (
        <figure class="table">
          <table>
            <tbody>
              {filteredContacts.map((contact, index) => (
                <tr key={index}>
                  <th>{contact.title}</th>
                  <td>
                    <HtmlContent>{contact.content.data.content}</HtmlContent>
                    {contact.links.map((link, index) => (
                      <p key={index}>
                        <FontAwesomeIcon icon={`fa-regular fa-${link.icon}`} />
                        {link.linkUrl !== null ?
                          <a href={link.linkUrl}>{link.linkText}</a> : link.linkText
                        }
                      </p>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      ) : (
        <HtmlContent>{contact}</HtmlContent>
      )}
    </div>
  )
}
