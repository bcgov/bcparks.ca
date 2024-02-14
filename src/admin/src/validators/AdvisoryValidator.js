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

export function validateLink(link, field, setError) {
  if (field === "type") {
    if (!link.type) {
      setError(true);
    } else {
      setError(false);
    }
  }
  if (field === "title") {
    if (!link.title) {
      setError(true);
    } else {
      setError(false);
    }
  }
  if (field === "url") {
    if (!link.url) {
      setError(true);
    } else {
      setError(false);
    }
  }
  if (field === "file") {
    if (!link.file) {
      setError(true);
    } else {
      setError(false);
    }
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
      "Please enter valid information in all required fields."
    );
  }
  return validData;
}
