export const validateName = (name) => {
  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
  return nameRegex.test(name);
};

export const validateMultipleName = (input) => {
  if (typeof input !== "string" || input.trim() === "") return false;

  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;

  const names = input.split(",").map((name) => name);

  if (names.some((name) => name === "")) return false;

  return names.every((name) => nameRegex.test(name));
};

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(\+1)?[\s\-]?(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}$/;

  return phoneRegex.test(phoneNumber.trim());
};

export const validateAddress = (address) => {
  const addressRegex = /^[0-9]+ [A-Za-z ]+(St|Ave|Rd|Blvd|Dr|Court|Way|Lane|Street|Road)$/;
  return addressRegex.test(address);
};

export const validateCity = (city) => {
  const cityRegex = /^[A-Za-z\s\-]+$/;
  return cityRegex.test(city);
};

export const validateProvince = (province) => {
  const provinceRegex = /^[A-Za-z\s'-]{2,50}$/;
  return provinceRegex.test(province);
};

export const validatePostalCode = (postalCode) => {
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
  return postalCodeRegex.test(postalCode);
};

export const validateCountry = (country) => {
  const countryRegex = /^[A-Za-z\s\-]+$/;
  return countryRegex.test(country);
}

export const validateRegisterData = (formData) => {
  console.log(formData);
  if(!validateName(formData.custFirstName)) {
    return {valid:false,message:"please input valid firstname"};
  }
  if(!validateName(formData.custLastName)) {
    return {valid:false,message:"please input valid lastname"};
  }
  if(!validatePhoneNumber(formData.custPhone)) {
    return {valid:false,message:"please input valid phone number"};
  }
  if(!validateAddress(formData.custAddress)) {
    return {valid:false,message:"please input valid address"};
  }
  if(!validateCity(formData.custCity)) {
    return {valid:false,message:"please input valid city"};
  }
  if(!validateProvince(formData.custProvince)) {
    return {valid:false,message:"please input valid province"};
  }
  if(!validatePostalCode(formData.custPostal)) {
    return {valid:false,message:"please input valid postal code"};
  }
  if(!validateCountry(formData.custCountry)) {
    return {valid:false,message:"please input valid country"};
  }
  return {valid:true,message:""}
}

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}