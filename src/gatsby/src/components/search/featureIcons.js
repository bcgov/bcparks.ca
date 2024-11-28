import React from "react"
import { Link } from "gatsby"

import campingIcon from "../../../static/icons/frontcountry-camping.svg"
import backcountryCampingIcon from "../../../static/icons/wilderness-camping.svg"
import hikingIcon from "../../../static/icons/hiking.svg"
import picincIcon from "../../../static/icons/picnic-areas.svg"
import swimmingIcon from "../../../static/icons/swimming.svg"
import cyclingIcon from "../../../static/icons/cycling.svg"
import petsIcon from "../../../static/icons/pets-on-leash.svg"

const Icon = ({ src, label, size }) => {
  return (
    <img
      src={src}
      alt={label}
      aria-label={label}
      width={size}
      height={size}
      className="mt-2 me-2"
    />
  )
}

const FeatureIcons = ({ page, slug, iconSize, parkFacilities, parkActivities, parkCampingTypes }) => {
  const facilities = parkFacilities.filter(f => [6].includes(f.num)) || [];
  const activities = parkActivities.filter(a => [1, 3, 8, 9].includes(a.num)) || [];
  const campings = parkCampingTypes.filter(c => [1, 36].includes(c.num)) || [];

  return (
    <>
      {campings.some(x => x.code === 'frontcountry-camping') &&
        <Icon src={campingIcon} label="Frontcountry camping" size={iconSize} />
      }
      {campings.some(x => x.code === 'backcountry-camping') &&
        <Icon src={backcountryCampingIcon} label="Backcountry camping" size={iconSize} />
      }
      {activities.some(x => x.code === 'hiking') &&
        <Icon src={hikingIcon} label="Hiking" size={iconSize} />
      }
      {facilities.some(x => x.code === 'picnic-areas') &&
        <Icon src={picincIcon} label="Picnic areas" size={iconSize} />
      }
      {activities.some(x => x.code === 'swimming') &&
        <Icon src={swimmingIcon} label="Swimming" size={iconSize} />
      }
      {activities.some(x => x.code === 'cycling') &&
        <Icon src={cyclingIcon} label="Cycling" size={iconSize} />
      }
      {activities.some(x => x.code === 'pets-on-leash') &&
        <Icon src={petsIcon} label="Pets on leash" size={iconSize} />
      }
      {page !== "park" && (
        campings.length ? (
          <Link to={`/${slug}/#camping`}>
            <p aria-label="See all facilities and activities">see all</p>
          </Link>
        ) : (
          (activities.length > 0 || facilities.length > 0) && (
            activities.length ? (
              <Link to={`/${slug}/#things-to-do`}>
                <p aria-label="See all facilities and activities">see all</p>
              </Link>
            ) : (
              <Link to={`/${slug}/#facilities`}>
                <p aria-label="See all facilities and activities">see all</p>
              </Link>
            )
          )
        )
      )}
    </>
  )
}

export default FeatureIcons