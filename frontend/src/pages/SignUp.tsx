import { Button, Field, Input, Stack, Heading, Text, HStack, VStack } from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useState } from "react";

type FormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [error, setError] = useState<string | null>(null);
  const [signUp, { isLoading }] = useSignUpMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setError("Password do not match");
      return
    }

    try {
      const response = await signUp({ name, email, password }).unwrap();
      dispatch(setCredentials(response));
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      const message =
        error?.data?.error || error?.data?.message || "Signup failed. Please try again.";
      setError(message);
    }
  };

  return (
    <Stack minH="100vh" alignItems="center" justifyContent="center">
      <VStack borderWidth="1px" borderRadius="lg" borderColor="purple.500" p={10}>
        <Heading size="2xl" fontWeight="bold" mb="4">Sign Up</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="4" minW="sm">
            <Field.Root invalid={!!errors.name} required>
              <Field.Label>
                Name <Field.RequiredIndicator />
              </Field.Label>
              <Input {...register("name")} placeholder="Enter name" />
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.email} required>
              <Field.Label>
                Email <Field.RequiredIndicator />
              </Field.Label>
              <Input {...register("email")} placeholder="Enter email address" />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password} required>
              <Field.Label>
                Password <Field.RequiredIndicator />
              </Field.Label>
              <Input type="password" {...register("password")} placeholder="Enter password" />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.confirmPassword} required>
              <Field.Label>
                Confirm Password <Field.RequiredIndicator />
              </Field.Label>
              <Input type="password" {...register("confirmPassword")} placeholder="Enter confirm password" />
              <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
            </Field.Root>

            <Button type="submit" mt="6" loading={isLoading}>Sign Up</Button>

            {error && (
              <Text color="red.400" fontSize="sm" textAlign="center">
                {error}
              </Text>
            )}

            <HStack justifyContent="center">
              <Text color="white" textAlign="center" fontSize="sm">Already have an account?</Text>
              <Text textDecoration="underline" color="purple.400" fontSize="sm"><Link to="/login">Login</Link></Text>
            </HStack>
          </Stack>
        </form>
      </VStack>
    </Stack>
  )
}