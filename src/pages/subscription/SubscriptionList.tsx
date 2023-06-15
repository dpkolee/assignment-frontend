import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Box,
  Container,
  Stack,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Tabs,
  Group,
  Button,
  List,
  ThemeIcon,
  Modal,
  useMantineTheme,
  Radio,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../utils/api-interceptor";
import CardSkeleton from "../../components/CardSkeleton";
import { AxiosError } from "axios";

type SubscriptionListType = {
  id: number;
  name: string;
  price: string;
  plan: string;
};

type FormDataProps = { subscription_plan: number | undefined };

const SubscriptionList = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [payment, setPayment] = useState("visa");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionListType>();
  const [opened, { open, close }] = useDisclosure(false);

  const { isLoading, data: subscriptionList } = useQuery(
    ["subscription-list"],
    () => {
      const response = api.get(`/subscription/type/`);
      return response;
    }
  );

  //subscription action mutation
  const subscriptionMutation = useMutation(
    (data: FormDataProps) => {
      return api.post("/subscription/user/", data);
    },
    {
      onSuccess: () => {
        navigate("/");
        notifications.show({
          id: "subscription-success",
          color: "green",
          icon: <Icon icon="fluent:checkmark-24-filled" />,
          title: "Success",
          message: "You have been subscribed successfully",
        });
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

  const handlePayment = () => {
    subscriptionMutation.mutate({ subscription_plan: selectedPlan?.id });
  };

  return (
    <Container size={"xl"}>
      <Modal
        size={"80%"}
        opened={opened}
        onClose={() => {
          setSelectedPlan(undefined);
          close();
        }}
        centered
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Stack align="start">
          <Title align="center" order={4}>
            Plan & Billing
          </Title>
          <Paper withBorder p={10} radius="sm" sx={{ width: "100%" }}>
            <SimpleGrid cols={2}>
              <Stack align="start" spacing={1}>
                <Text align="center" color="dimmed">
                  Plan
                </Text>
                <Text align="center" size={30}>
                  {selectedPlan?.name}
                </Text>
              </Stack>
              <Stack align="start" spacing={1}>
                <Text align="center" color="dimmed">
                  Price
                </Text>
                <Group spacing={0} position="center" align="baseline">
                  <Text size={30} fw={600}>
                    {selectedPlan?.price}
                  </Text>
                  <Text color="dimmed" size="md">
                    {selectedPlan?.plan}
                  </Text>
                </Group>
              </Stack>
            </SimpleGrid>
          </Paper>
          <Title align="center" order={4}>
            Payment Methods
          </Title>
          <Paper withBorder p={10} radius="sm" sx={{ width: "100%" }}>
            <Radio.Group
              value={payment}
              onChange={setPayment}
              label="Select any one method of payment"
              description="You have to select any one option to proceed"
              withAsterisk
            >
              <Stack mt="xs">
                <Group align="center">
                  <Radio value="visa" />
                  <ThemeIcon color="gray.0" size={50}>
                    <Icon icon="logos:visaelectron" fontSize={25} />
                  </ThemeIcon>
                  <Stack spacing={0}>
                    <Text size="md">**** **** **** 9376</Text>
                    <Text color="dimmed" size="xs">
                      Expiry 10/2024
                    </Text>
                  </Stack>
                </Group>
                <Group align="center">
                  <Radio value="mastercard" />
                  <ThemeIcon color="gray.0" size={50}>
                    <Icon icon="logos:mastercard" fontSize={25} />
                  </ThemeIcon>
                  <Stack spacing={0}>
                    <Text size="md">**** **** **** 8560</Text>
                    <Text color="dimmed" size="xs">
                      Expiry 5/2024
                    </Text>
                  </Stack>
                </Group>
                <Group align="center">
                  <Radio value="paypal" />
                  <ThemeIcon color="gray.0" size={50}>
                    <Icon icon="logos:paypal" fontSize={25} />
                  </ThemeIcon>
                  <Stack spacing={0}>
                    <Text size="md">**** **** **** 1087</Text>
                    <Text color="dimmed" size="xs">
                      Expiry 10/2024
                    </Text>
                  </Stack>
                </Group>
              </Stack>
            </Radio.Group>
          </Paper>
          <Group
            position="right"
            sx={{
              width: "100%",
            }}
          >
            <Button
              color="violet"
              onClick={handlePayment}
              loading={subscriptionMutation.isLoading}
            >
              Proceed to payment
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Stack align={"center"} spacing={0}>
          <Title align="center" order={3}>
            You Haven't Subscribed To Our Services Yet
          </Title>
          <Text color="dimmed" size="lg" align="center">
            Choose any one subscription plan to continue
          </Text>
          <Title align="center" mt={60} mb={20}>
            Available Subscription Plans
          </Title>
          <SimpleGrid cols={3}>
            {isLoading && <CardSkeleton count={3} />}
            {subscriptionList?.data?.map(
              (subscription: SubscriptionListType) => (
                <Paper
                  key={subscription.id}
                  maw={300}
                  miw={300}
                  withBorder
                  p={10}
                  radius="md"
                >
                  <Stack spacing={30}>
                    <Tabs defaultValue="basic" color="violet">
                      <Tabs.List grow>
                        <Tabs.Tab value="basic">{subscription.name}</Tabs.Tab>
                      </Tabs.List>
                    </Tabs>
                    <Group spacing={0} position="center" align="baseline">
                      <Text size={30} fw={600}>
                        ${subscription.price}
                      </Text>
                      <Text color="dimmed" size="md">
                        /{subscription.plan}
                      </Text>
                    </Group>
                    {subscription.name === "Basic" && (
                      <List
                        spacing="md"
                        mx={10}
                        size="sm"
                        center
                        icon={
                          <ThemeIcon color="teal" size={20} radius="xl">
                            <Icon icon="fluent:checkmark-24-filled" />
                          </ThemeIcon>
                        }
                      >
                        <List.Item>Early Access to New Releases.</List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="red" size={20} radius="xl">
                              <Icon icon="ic:round-close" />
                            </ThemeIcon>
                          }
                        >
                          Discounted Game Purchases
                        </List.Item>
                        <List.Item>Online Multiplayer Access</List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="red" size={20} radius="xl">
                              <Icon icon="ic:round-close" />
                            </ThemeIcon>
                          }
                        >
                          Cloud Save and Cross-Platform Progression
                        </List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="red" size={20} radius="xl">
                              <Icon icon="ic:round-close" />
                            </ThemeIcon>
                          }
                        >
                          Exclusive In-Game Content
                        </List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="red" size={20} radius="xl">
                              <Icon icon="ic:round-close" />
                            </ThemeIcon>
                          }
                        >
                          Game Recommendations and Personalization
                        </List.Item>
                      </List>
                    )}
                    {subscription?.name === "Standard" && (
                      <List
                        spacing="md"
                        mx={10}
                        size="sm"
                        center
                        icon={
                          <ThemeIcon color="teal" size={20} radius="xl">
                            <Icon icon="fluent:checkmark-24-filled" />
                          </ThemeIcon>
                        }
                      >
                        <List.Item>Early Access to New Releases.</List.Item>
                        <List.Item>Discounted Game Purchases</List.Item>
                        <List.Item>Online Multiplayer Access</List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="red" size={20} radius="xl">
                              <Icon icon="ic:round-close" />
                            </ThemeIcon>
                          }
                        >
                          Cloud Save and Cross-Platform Progression
                        </List.Item>
                        <List.Item>Exclusive In-Game Content</List.Item>
                        <List.Item>
                          Game Recommendations and Personalization
                        </List.Item>
                      </List>
                    )}
                    {subscription?.name === "Elite" && (
                      <List
                        spacing="md"
                        mx={10}
                        size="sm"
                        center
                        icon={
                          <ThemeIcon color="teal" size={20} radius="xl">
                            <Icon icon="fluent:checkmark-24-filled" />
                          </ThemeIcon>
                        }
                      >
                        <List.Item>Early Access to New Releases.</List.Item>
                        <List.Item>Discounted Game Purchases</List.Item>
                        <List.Item>Online Multiplayer Access</List.Item>
                        <List.Item>
                          Cloud Save and Cross-Platform Progression
                        </List.Item>
                        <List.Item>Exclusive In-Game Content</List.Item>
                        <List.Item>
                          Game Recommendations and Personalization
                        </List.Item>
                      </List>
                    )}
                    <Button
                      color="violet"
                      onClick={() => {
                        setSelectedPlan(subscription);
                        open();
                      }}
                    >
                      Get Started
                    </Button>
                  </Stack>
                </Paper>
              )
            )}
          </SimpleGrid>
        </Stack>
      </Box>
    </Container>
  );
};

export default SubscriptionList;
