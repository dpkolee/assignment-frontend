import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Image,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { GameListResponseType } from "./HomePage";
import { useDisclosure } from "@mantine/hooks";
import { Fragment, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api-interceptor";
import { AxiosError, AxiosResponse } from "axios";
import { notifications } from "@mantine/notifications";
import { FormatDateFromNow } from "../../utils/date-format";
import CommentSkeleton from "../../components/CommentSkeleton";
import ServerError from "../../components/ServerError";
import NoData from "../../components/NoData";
import { helperUtils } from "../../utils/helpers";

type Props = {
  val: GameListResponseType;
  title: string;
};

export interface productFeedbackResponseType {
  id: number;
  created_date: Date;
  feedback: string;
  user: {
    first_name: string;
    id: number;
    last_name: string;
    profile_image: string;
    username: string;
  };
}

type FormDataProps = { product_id: number; feedback: string };

const ProductFeedback = ({ val, title }: Props) => {
  const queryClient = useQueryClient();
  const theme = useMantineTheme();
  const [review, setReview] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const {
    isLoading,
    data: productFeedbacks,
    isError: isProductFeedbackListError,
    refetch: productFeedbackListRefetch,
  } = useQuery(
    ["product-feedbacks", val.id],
    () => {
      const response = api.get(`/product/feedback/list/${val.id}/`);
      return response;
    },
    {
      enabled: opened,
    }
  );

  //product feedback create action mutation
  const productFeedbackMutation = useMutation(
    (data: FormDataProps) => {
      return api.post("/product/feedback/", data);
    },
    {
      onSuccess: (response: AxiosResponse) => {
        const { success } = response?.data;
        notifications.show({
          id: "product-feedback-success",
          color: "green",
          icon: <Icon icon="fluent:checkmark-24-filled" />,
          title: "Success",
          message: success ?? "Thank you for giving you valuable feedback",
        });
        setReview("");
        queryClient.invalidateQueries(["product-feedbacks", val.id]);
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

  const handleProductFeedback = (product_id: number, feedback: string) => {
    productFeedbackMutation.mutate({
      product_id: product_id,
      feedback: feedback,
    });
  };

  return (
    <Fragment>
      <ActionIcon variant="default" radius="md" size={36} onClick={open}>
        <Icon icon="material-symbols:reviews-rounded" />
      </ActionIcon>
      <Modal
        yOffset={5}
        scrollAreaComponent={ScrollArea.Autosize}
        title={<Text fw={500}>{title}</Text>}
        size={"xl"}
        opened={opened}
        onClose={() => {
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
        <Card withBorder radius="sm" p="sm" pb={30} key={val.id}>
          <Card.Section>
            <Image src={val.image} alt={val.name} height={400} />
          </Card.Section>
          <Card.Section mt="md" inheritPadding>
            <Group position="apart">
              <Text fz="md" fw={500}>
                {val.name}
              </Text>
              <Tooltip label="rating" withArrow>
                <Badge
                  size="md"
                  color="violet"
                  leftSection={<Icon icon="ph:star-fill" />}
                >
                  {val.rating}
                </Badge>
              </Tooltip>
            </Group>
          </Card.Section>
          <Card.Section mt="md" mb={"lg"} inheritPadding>
            <Stack>
              <Stack spacing={5}>
                <Group spacing={5}>
                  <Icon icon="material-symbols:reviews-rounded" fontSize={20} />
                  <Title order={4}>Feedbacks</Title>
                </Group>
                <Divider />
              </Stack>
              {isLoading && <CommentSkeleton isLoading={isLoading} count={4} />}
              {productFeedbacks?.data?.results?.map(
                (val: productFeedbackResponseType) => (
                  <Stack key={val.id}>
                    <Group align="start" spacing={5} noWrap>
                      <Avatar
                        src={val?.user?.profile_image ?? ""}
                        alt={""}
                        radius="xl"
                      />
                      <Stack spacing={2}>
                        <Text
                          size="sm"
                          fw={500}
                          sx={{
                            textTransform: "capitalize",
                          }}
                        >
                          {val?.user?.first_name ?? ""}{" "}
                          {val?.user?.last_name ?? ""}
                        </Text>
                        <Box>
                          <Text
                            size="sm"
                            sx={{
                              whiteSpace: "break-spaces",
                            }}
                          >
                            {val.feedback}
                          </Text>
                        </Box>
                        <Text size="xs" color="dimmed" ml={5}>
                          {FormatDateFromNow(val.created_date)}
                        </Text>
                      </Stack>
                    </Group>
                    <Divider variant="dashed" />
                  </Stack>
                )
              )}
              {isProductFeedbackListError ? (
                <ServerError
                  reload={productFeedbackListRefetch}
                  src="/no_data_error.svg"
                />
              ) : (
                <NoData
                  data={productFeedbacks?.data}
                  src="/no_data.svg"
                  title={"Feedback list is empty"}
                  description={"Start from yourself by giving us feedback"}
                />
              )}
              {helperUtils?.isLogin() && (
                <Textarea
                  value={review}
                  disabled={productFeedbackMutation.isLoading}
                  placeholder="Type your feedback"
                  autosize
                  minRows={1}
                  maxRows={15}
                  onChange={(e) => {
                    setReview(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey) {
                      return;
                    } else if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleProductFeedback(val.id, review);
                    }
                  }}
                  rightSection={
                    <ActionIcon
                      variant="filled"
                      color="violet"
                      onClick={() => {
                        handleProductFeedback(val.id, review);
                      }}
                      loading={productFeedbackMutation.isLoading}
                    >
                      <Icon icon="majesticons:send" />
                    </ActionIcon>
                  }
                />
              )}
            </Stack>
          </Card.Section>
        </Card>
      </Modal>
    </Fragment>
  );
};

export default ProductFeedback;
