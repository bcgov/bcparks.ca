import moment from "moment";
import { isEmpty } from "../utils/AppUtil";

export function validateOptionalNumber(field) {
  field.setError("");
  if (field.value && isNaN(field.value)) {
    field.setError("Please enter a valid number");
    return false;
  }
  return true;
}

export function validateRequiredText(field) {
  field.setError("");
  if (!field.value) {
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

export function validateRequiredLocation(field) {
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

export function validAdvisoryData(advisoryData, validateStatus, mode) {
  advisoryData.formError("");
  const validListingRank = validateOptionalNumber(advisoryData.listingRank);
  const validTicketNumber = validateOptionalNumber(advisoryData.ticketNumber);
  const validHeadline = validateRequiredText(advisoryData.headline);
  const validEventType = validateRequiredSelect(advisoryData.eventType);
  const validUrgency = validateRequiredSelect(advisoryData.urgency);
  const validLocations = validateRequiredLocation(advisoryData.protectedArea);
  const validAdvisoryDate = validateRequiredDate(advisoryData.advisoryDate);
  const validStartDate = validateOptionalDate(advisoryData.startDate);
  const validEndDate = validateOptionalDate(advisoryData.endDate);
  const validExpiryDate = validateOptionalDate(advisoryData.expiryDate);
  const validSubmittedBy = validateRequiredText(advisoryData.submittedBy);
  let validData =
    validListingRank &&
    validTicketNumber &&
    validHeadline &&
    validEventType &&
    validUrgency &&
    validLocations &&
    validAdvisoryDate &&
    validStartDate &&
    validEndDate &&
    validExpiryDate &&
    validSubmittedBy;
  if (validateStatus) {
    const validAdvisoryStatus = validateRequiredSelect(
      advisoryData.advisoryStatus
    );
    validData = validData && validAdvisoryStatus;
  }
  if (mode === "update") {
    const validUpdatedDate = validateOptionalDate(advisoryData.updatedDate);
    validData = validData && validUpdatedDate;
  }
  if (!validData) {
    advisoryData.formError("Errors found !!! Please enter valid information");
  }
  return validData;
}
