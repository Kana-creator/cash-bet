export const FormValidation = (input: HTMLInputElement) => {
  const parent = input.parentElement as HTMLElement;
  const small = parent.querySelector("small") as HTMLElement;

  if (input.value.length < 1) {
    return (small.innerText = input.id + " is required");
  } else {
    return (small.innerText = "");
  }
};

export const emailValidation = (email: HTMLInputElement) => {
  const parent = email.parentElement as HTMLElement;
  const small = parent.querySelector("small") as HTMLElement;
  small.innerText = email.id + " is not a valid email";
};

export const comparePasswords = (confirmPassword: HTMLInputElement) => {
  const parent = confirmPassword.parentElement as HTMLElement;
  const small = parent.querySelector("small") as HTMLElement;

  return (small.innerText = "Passwords do not match!");
};
