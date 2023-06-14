import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Box,
  Stack,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../../utils/api-interceptor";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Icon } from "@iconify/react";

type FormDataProps = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export function Signup() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    validate: yupResolver(
      Yup.object().shape({
        username: Yup.string().required("Username field cannot be empty"),
        email: Yup.string().required("Email field cannot be empty"),
        password: Yup.string().required("Password field cannot be empty"),
      })
    ),
    validateInputOnBlur: true,
  });

  //signup action mutation
  const signupMutation = useMutation(
    (data: FormDataProps) => {
      return api.post("/auth/signup/", data);
    },
    {
      onSuccess: () => {
        navigate("/login");
      },
      onError: (error: AxiosError) => {
        const { detail } = error.response?.data as { detail: string };
        if (detail) {
          notifications.show({
            id: detail,
            color: "red",
            icon: <Icon icon="fluent:dismiss-24-filled" />,
            title: "ERROR",
            message: detail,
          });
        } else if (error?.response?.data) {
          form.setErrors(error?.response?.data as any);
        } else {
          notifications.show({
            id: "Server Error",
            color: "red",
            icon: <Icon icon="fluent:dismiss-24-filled" />,
            title: "Something Went Wrong !",
            message:
              "There seems to be something wrong with the server, Please try again later",
          });
        }
      },
    }
  );

  const handleSubmit = (values: FormDataProps) => {
    signupMutation.mutate(values);
  };
  return (
    <Container size={"xl"}>
      <Box
        component="form"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values);
        })}
      >
        <Stack align={"center"}>
          <Title align="center">Signup</Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Already have an account?{" "}
            <Anchor
              size="sm"
              component="button"
              onClick={() => {
                navigate("/login");
              }}
              color="violet"
            >
              Login
            </Anchor>
          </Text>
          <Paper maw={400} miw={400} withBorder p={30} mt={10} radius="md">
            <TextInput
              label="Username"
              placeholder="Enter your username"
              withAsterisk
              {...form.getInputProps("username")}
            />
            <TextInput
              label="Firstname"
              placeholder="Enter your firstname"
              withAsterisk
              mt="md"
              {...form.getInputProps("first_name")}
            />
            <TextInput
              label="Lastname"
              placeholder="Enter your lastname"
              withAsterisk
              mt="md"
              {...form.getInputProps("last_name")}
            />
            <TextInput
              label="Email"
              placeholder="Enter your email"
              withAsterisk
              mt="md"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter Your password"
              withAsterisk
              mt="md"
              {...form.getInputProps("password")}
            />
            <Button fullWidth mt="xl" color="violet" type="submit">
              Signup
            </Button>
          </Paper>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Go back to{" "}
            <Anchor
              size="sm"
              component="button"
              onClick={() => {
                navigate("/");
              }}
              color="violet"
            >
              Home
            </Anchor>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
}

export default Signup;
