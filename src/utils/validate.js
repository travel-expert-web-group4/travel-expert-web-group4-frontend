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
