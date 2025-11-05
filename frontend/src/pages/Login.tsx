import { Button, Field, Input, Stack, Heading, Text, HStack, VStack } from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BsGoogle } from "react-icons/bs";
import { useState } from "react";
import { useLoginMutation } from "../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";

type FormInputs = {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { email, password } = data;

    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials(response));
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error?.data?.error || error?.data?.message || "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <Stack minH="100vh" alignItems="center" justifyContent="center">
      <VStack borderWidth="1px" borderRadius="lg" borderColor="purple.500" p={10}>
        <Heading size="2xl" fontWeight="bold" mb="4">Login</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="4" minW="sm">
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

            <Button type="submit" mt="4" mb="2" loading={isLoading}>Login</Button>
            <Button mb="2"><BsGoogle />Google</Button>

            {error && (
              <Text color="red.400" fontSize="sm" textAlign="center">
                {error}
              </Text>
            )}
            <HStack justifyContent="center">
              <Text color="white" textAlign="center" fontSize="sm">Don't have an account?</Text>
              <Text textDecoration="underline" color="purple.400" fontSize="sm"><Link to="/sign-up">Sign Up</Link></Text>
            </HStack>
          </Stack>
        </form>
      </VStack>
    </Stack>
  )
}