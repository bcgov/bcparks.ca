import moment from "moment";
import { isEmpty } from "../utils/AppUtil";

export function validateOptionalNumber(field) {
  field.setError("");
  if (field.value === "" || !(/^0$|^[1-9]\d{0,3}$/).test(field.value)) {
    field.setError("Please enter a valid number");
    return false;
  }
  return true;
}

export function validateRequiredText(field) {
  field.setError("");
  if (field.value !== 0 && !field.value) {
    field.setError("Please enter " + field.text);
    return false;
  }
  return true;
}

export function validateRequiredSelect(field) {
  field.setError("");
  if (!field.value) {
    field.setError("Please select " + field.text);
    return false;
  }
  return true;
}

export function validateRequiredMultiSelect(field) {
  field.setError("");
  if (isEmpty(field.value)) {
    field.setError("Please select " + field.text);
    return false;
  }
  return true;
}

export function validateRequiredAffectedArea(field) {
  field.setError("");
  let valueExists = false;
  if (!isEmpty(field.value)) {
    field.value.forEach((v) => {
      if (!isEmpty(v)) {
        valueExists = true;
      }
    });
  }
  if (!valueExists) {
    field.setError("Please select " + field.text);
  }
  return valueExists;
}

export function validateOptionalDate(field) {
  field.setError("");
  if (field.value) {
    return validateDate(field);
  } else {
    return true;
  }
}

export function validateRequiredDate(field) {
  field.setError("");
  return validateDate(field);
}

export function validateDate(field) {
  var date = moment(field.value);
  if (!date.isValid()) {
    field.setError("Please enter valid date");
    return false;
  }
  return true;
}

export function validateLinks(links) {
  const checkLinks = links.map((link) => {
    if (link.type && link.title && (link.file || link.url)) {
      return true;
    }
    return false;
  })
  return checkLinks.every(Boolean);
}

export function validateLink(link, index, field, setErrors) {
  let hasError = false;
  if (field === "type" && !link.type) {
    hasError = true;
  } else if (field === "title" && !link.title) {
    hasError = true;
  } else if (field === "url" && !link.url) {
    hasError = true;
  } else if (field === "file" && !link.file) {
    hasError = true;
  }

  setErrors(prevErrors => {
    const newErrors = [...prevErrors];
    newErrors[index] = hasError;
    return newErrors;
  });
}
export function validateDisplayedDate(field) {
  const obj = field.value;
  if ((obj.displayedDateOption === "" || obj.displayedDateOption === "posting") && !obj.advisoryDate) {
    field.setError("Please choose a date to display");
    return false;
  } else if (obj.displayedDateOption === "start" && !obj.startDate) {
    field.setError("Please enter a date for 'Start date'");
    return false;
  } else if (obj.displayedDateOption === "updated" && !obj.updatedDate) {
    field.setError("Please enter a date for 'Updated date'");
    return false;
  } else if (obj.displayedDateOption === "event" && (!obj.startDate || !obj.endDate)) {
    field.setError("Please enter dates for 'Start date' and 'End date'");
    return false;
  } else {
    field.setError("");
    return true;
  }
}

export function validAdvisoryData(advisoryData, linksRef, validateStatus, mode) {
  advisoryData.formError("");
  const validListingRankNumber = validateOptionalNumber(advisoryData.listingRank);
  const validHeadline = validateRequiredText(advisoryData.headline);
  const validEventType = validateRequiredSelect(advisoryData.eventType);
  const validUrgency = validateRequiredSelect(advisoryData.urgency);
  const validAffectedArea = validateRequiredAffectedArea(advisoryData.protectedArea);
  const validAdvisoryDate = validateRequiredDate(advisoryData.advisoryDate);
  const validStartDate = validateOptionalDate(advisoryData.startDate);
  const validEndDate = validateOptionalDate(advisoryData.endDate);
  const validExpiryDate = validateOptionalDate(advisoryData.expiryDate);
  const validLinks = validateLinks(linksRef.current);
  const validDisplayedDate = validateDisplayedDate(advisoryData.displayedDate);
  let validData =
    validListingRankNumber &&
    validHeadline &&
    validEventType &&
    validUrgency &&
    validAffectedArea &&
    validAdvisoryDate &&
    validStartDate &&
    validEndDate &&
    validExpiryDate &&
    validDisplayedDate &&
    validLinks;
  if (validateStatus) {
    const validAdvisoryStatus = validateRequiredSelect(
      advisoryData.advisoryStatus
    );
    validData = validData && validAdvisoryStatus;
  }
  if (validateStatus) {
    const validSubmittedBy = validateRequiredText(
      advisoryData.submittedBy
    );
    validData = validData && validSubmittedBy
  }
  if (mode === "update") {
    const validUpdatedDate = validateOptionalDate(advisoryData.updatedDate);
    validData = validData && validUpdatedDate;
  }
  if (!validData) {
    advisoryData.formError(
      "Please complete required fields"
    );
  }
  return validData;
}