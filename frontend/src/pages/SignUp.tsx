import { Button, Field, Input, Stack, Heading, Text, HStack } from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

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
  const onSubmit: SubmitHandler<FormInputs> = (data) => console.log(data);

  return (
    <Stack minH="100vh" alignItems="center" justifyContent="center">
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
            <Input {...register("password")} placeholder="Enter password" />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.confirmPassword} required>
            <Field.Label>
              Confirm Password <Field.RequiredIndicator />
            </Field.Label>
            <Input {...register("confirmPassword")} placeholder="Enter confirm password" />
            <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
          </Field.Root>

          <Button type="submit" mt="6">Sign Up</Button>
          <HStack justifyContent="center">
            <Text color="white" textAlign="center" fontSize="sm">Already have an account?</Text>
            <Text textDecoration="underline" color="purple.400" fontSize="sm"><Link to="/login">Login</Link></Text>
          </HStack>
        </Stack>
      </form>
    </Stack>
  )
}