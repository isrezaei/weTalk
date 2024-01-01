import { z } from "zod";

const error = (type: string) => ({
  required_error: `${type} is required`,
  invalid_type_error: `${type} must be a valid`,
});

const message = (number: number) => ({
  message: `Must be ${number} or more characters long`,
});

export const signUpSchema = z
  .object({
    firstName: z.string().max(12, message(12)),
    lastName: z.string().max(12, message(12)),
    username: z
      .string()
      .regex(
        /^[^-^()<>\?:\#$%&*!@]+$/,
        "You can't use !@#$%^&*() in the username"
      ),
    number: z.coerce.string(),
    email: z.coerce.string(error("email")).email(),
    age: z.string(),
    password: z.coerce
      .string()
      .min(4)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.coerce
      .string()
      .min(4)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
