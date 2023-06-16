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

export interface GameFeedbackResponseType {
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

type FormDataProps = { game_id: number; feedback: string };

const GameFeedback = ({ val, title }: Props) => {
  const queryClient = useQueryClient();
  const theme = useMantineTheme();
  const [review, setReview] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const {
    isLoading,
    data: gameFeedbacks,
    isError: isGameListError,
    refetch: gameListRefetch,
  } = useQuery(
    ["game-feedbacks", val.id],
    () => {
      const response = api.get(`/product/game/feedback/list/${val.id}/`);
      return response;
    },
    {
      enabled: opened,
    }
  );

  //product purchase action mutation
  const gameFeedbackMutation = useMutation(
    (data: FormDataProps) => {
      return api.post("/product/game/feedback/", data);
    },
    {
      onSuccess: (response: AxiosResponse) => {
        const { success } = response?.data;
        notifications.show({
          id: "game-feedback-success",
          color: "green",
          icon: <Icon icon="fluent:checkmark-24-filled" />,
          title: "Success",
          message: success ?? "Thank you for giving you valuable feedback",
        });
        setReview("");
        queryClient.invalidateQueries(["game-feedbacks", val.id]);
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

  const handleGameFeedback = (game_id: number, feedback: string) => {
    gameFeedbackMutation.mutate({ game_id: game_id, feedback: feedback });
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
              {gameFeedbacks?.data?.results?.map(
                (val: GameFeedbackResponseType) => (
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
              {isGameListError ? (
                <ServerError
                  reload={gameListRefetch}
                  src="/no_data_error.svg"
                />
              ) : (
                <NoData
                  data={gameFeedbacks?.data}
                  src="/no_data.svg"
                  title={"Feedback list is empty"}
                  description={"Start from yourself by giving us feedback"}
                />
              )}
              {helperUtils?.isLogin() && (
                <Textarea
                  value={review}
                  disabled={gameFeedbackMutation.isLoading}
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
                      handleGameFeedback(val.id, review);
                    }
                  }}
                  rightSection={
                    <ActionIcon
                      variant="filled"
                      color="violet"
                      onClick={() => {
                        handleGameFeedback(val.id, review);
                      }}
                      loading={gameFeedbackMutation.isLoading}
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

export default GameFeedback;
