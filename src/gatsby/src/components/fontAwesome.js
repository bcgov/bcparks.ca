import React from "react"

import banSmoking from "!!raw-loader!../../static/fontAwesomeIcons/ban-smoking.svg"
import ban from "!!raw-loader!../../static/fontAwesomeIcons/ban.svg"
import bicycle from "!!raw-loader!../../static/fontAwesomeIcons/bicycle.svg"
import bird from "!!raw-loader!../../static/fontAwesomeIcons/bird.svg"
import campground from "!!raw-loader!../../static/fontAwesomeIcons/campground.svg"
import clipboardList from "!!raw-loader!../../static/fontAwesomeIcons/clipboard-list.svg"
import dogLeashed from "!!raw-loader!../../static/fontAwesomeIcons/dog-leashed.svg"
import droplet from "!!raw-loader!../../static/fontAwesomeIcons/droplet.svg"
import envelope from "!!raw-loader!../../static/fontAwesomeIcons/envelope.svg"
import facebook from "!!raw-loader!../../static/fontAwesomeIcons/facebook.svg"
import instagram from "!!raw-loader!../../static/fontAwesomeIcons/instagram.svg"
import laptop from "!!raw-loader!../../static/fontAwesomeIcons/laptop.svg"
import listCheck from "!!raw-loader!../../static/fontAwesomeIcons/list-check.svg"
import locationDot from "!!raw-loader!../../static/fontAwesomeIcons/location-dot.svg"
import messages from "!!raw-loader!../../static/fontAwesomeIcons/messages.svg"
import mountain from "!!raw-loader!../../static/fontAwesomeIcons/mountain.svg"
import music from "!!raw-loader!../../static/fontAwesomeIcons/music.svg"
import pawClaws from "!!raw-loader!../../static/fontAwesomeIcons/paw-claws.svg"
import personFalling from "!!raw-loader!../../static/fontAwesomeIcons/person-falling.svg"
import personHiking from "!!raw-loader!../../static/fontAwesomeIcons/person-hiking.svg"
import phoneArrowUpRight from "!!raw-loader!../../static/fontAwesomeIcons/phone-arrow-up-right.svg"
import phone from "!!raw-loader!../../static/fontAwesomeIcons/phone.svg"
import recycle from "!!raw-loader!../../static/fontAwesomeIcons/recycle.svg"
import trashCan from "!!raw-loader!../../static/fontAwesomeIcons/trash-can.svg"
import triangleExclamation from "!!raw-loader!../../static/fontAwesomeIcons/triangle-exclamation.svg"
import xTwitter from "!!raw-loader!../../static/fontAwesomeIcons/x-twitter.svg" 

const FontAwesome = ({ icon, className }) => {
  const icons = {
    "ban-smoking": banSmoking,
    "ban": ban,
    "bicycle": bicycle,
    "bird": bird,
    "campground": campground,
    "clipboard-list": clipboardList,
    "dog-leashed": dogLeashed,
    "droplet": droplet,
    "envelope": envelope,
    "facebook": facebook,
    "instagram": instagram,
    "laptop": laptop,
    "list-check": listCheck,
    "location-dot": locationDot,
    "messages": messages,
    "mountain": mountain,
    "music": music,
    "paw-claws": pawClaws,
    "person-falling": personFalling,
    "person-hiking": personHiking,
    "phone-arrow-up-right": phoneArrowUpRight,
    "phone": phone,
    "recycle": recycle,
    "trash-can": trashCan,
    "triangle-exclamation": triangleExclamation,
    "x-twitter": xTwitter
  }
  const svg = icons[icon] || icon

  return (
    <span dangerouslySetInnerHTML={{ __html: svg }} className={className} />
  )
}

export default FontAwesome