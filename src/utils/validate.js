export const validateName = (name) => {
  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
  return nameRegex.test(name.trim());
};

export const validateMultipleName = (input) => {
  if (typeof input !== "string" || input.trim() === "") return false;
  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
  const names = input.split(",").map((name) => name.trim());
  if (names.some((name) => name === "")) return false;
  return names.every((name) => nameRegex.test(name));
};

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(\+1)?[\s\-]?(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}$/;
  return phoneRegex.test(phoneNumber.trim());
};

export const validateAddress = (address) => {
  const addressRegex = /^\d{1,6}\s+([\w\-.'#]+\s?)+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Court|Ct|Lane|Ln|Way|Crescent|Circle|Cir|Terrace|Place|Pl|Trail|Trl|Parkway|Pkwy)\s*(N|S|E|W|NE|NW|SE|SW)?$/i;
  // const addressRegex = /^[0-9]+\s+[\w\s.'-]+(?:\s+(St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Court|Way|Lane))$/i;
  return addressRegex.test(address);
};

export const validateCity = (city) => {
  const cityRegex = /^[A-Za-z\s\-]+$/;
  return cityRegex.test(city.trim());
};

export const validateProvince = (province) => {
  const provinceRegex = /^[A-Za-z\s'-]{2}$/;
  return provinceRegex.test(province.trim());
};

export const validatePostalCode = (postalCode) => {
  const postalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] \d[ABCEGHJ-NPRSTV-Z]\d$/i;
  return postalCodeRegex.test(postalCode);
};

export const validateCountry = (country) => {
  const countryRegex = /^[A-Za-z\s\-]+$/;
  return countryRegex.test(country);
};

export const validateRegisterData = (formData) => {
  console.log(formData);
  if (!validateName(formData.custFirstName)) {
    return {
      valid: false,
      message: "please input valid firstname",
      field: "custFirstName",
    };
  }
  if (!validateName(formData.custLastName)) {
    return {
      valid: false,
      message: "please input valid lastname",
      field: "custLastName",
    };
  }
  if (!validatePhoneNumber(formData.custPhone)) {
    return {
      valid: false,
      message: "please input valid phone number",
      field: "custPhone",
    };
  }
  // if (!validateAddress(formData.custAddress)) {
  //   return {
  //     valid: false,
  //     message: "please input valid address",
  //     field: "custAddress",
  //   };
  // }
  if (!validateCity(formData.custCity)) {
    return {
      valid: false,
      message: "please input valid city",
      field: "custCity",
    };
  }
  if (!validateProvince(formData.custProvince)) {
    return {
      valid: false,
      message: "please input valid province",
      field: "custProvince",
    };
  }
  if (!validatePostalCode(formData.custPostal)) {
    return {
      valid: false,
      message: "please input valid postal code",
      field: "custPostal",
    };
  }
  if (!validateCountry(formData.custCountry)) {
    return {
      valid: false,
      message: "please input valid country",
      field: "custCountry",
    };
  }
  return { valid: true, message: "" };
};

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
