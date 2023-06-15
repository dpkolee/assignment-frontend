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
  LoadingOverlay,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import api from "../../utils/api-interceptor";
import { helperUtils } from "../../utils/helpers";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Icon } from "@iconify/react";

type FormDataProps = { username: string; password: string };

export function Login() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: yupResolver(
      Yup.object().shape({
        username: Yup.string().required("Username field cannot be empty"),
        password: Yup.string().required("Password field cannot be empty"),
      })
    ),
    validateInputOnBlur: true,
  });

  //login action mutation
  const loginMutation = useMutation(
    (data: FormDataProps) => {
      return api.post("/auth/login/", data);
    },
    {
      onSuccess: (response) => {
        const { access, refresh, user, subscribed } = response?.data;
        helperUtils.setAuthorizationToken(access);
        helperUtils.setRefreshToken(refresh);
        helperUtils.setUser(user);
        if (Boolean(subscribed)) {
          navigate("/");
          notifications.show({
            id: "login-success",
            color: "green",
            icon: <Icon icon="fluent:checkmark-24-filled" />,
            title: "Success",
            message: "Successfully logged In",
          });
        } else {
          navigate("/subscription", { replace: true });
        }
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
    loginMutation.mutate(values);
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
          <Title align="center">Login</Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Don't have an account?{" "}
            <Anchor
              size="sm"
              component="button"
              onClick={() => {
                navigate("/signup");
              }}
              color="violet"
            >
              Signup
            </Anchor>
          </Text>
          <Paper
            maw={400}
            miw={400}
            withBorder
            p={30}
            mt={10}
            radius="md"
            pos={"relative"}
          >
            <LoadingOverlay visible={loginMutation.isLoading} overlayBlur={2} />
            <TextInput
              label="Username"
              placeholder="Enter your username"
              withAsterisk
              {...form.getInputProps("username")}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              withAsterisk
              mt="md"
              {...form.getInputProps("password")}
            />
            <Button
              fullWidth
              mt="xl"
              variant="filled"
              color="violet"
              type="submit"
              leftIcon={
                <Icon icon="ant-design:unlock-outlined" fontSize={20} />
              }
            >
              Login
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

export default Login;
