import { Button, Field, Input, Stack, Heading, Text, HStack, VStack } from "@chakra-ui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { BsGoogle } from "react-icons/bs";

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
  const onSubmit: SubmitHandler<FormInputs> = (data) => console.log(data);

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
              <Input {...register("password")} placeholder="Enter password" />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>

            <Button type="submit" mt="4" mb="2">Login</Button>
            <Button mb="2"><BsGoogle />Google</Button>

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