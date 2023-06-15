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
import { Fragment } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

type Props = {
  val: GameListResponseType;
  title: string;
};

const Reviews = ({ val, title }: Props) => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Fragment>
      <ActionIcon variant="default" radius="md" size={36} onClick={open}>
        <Icon icon="material-symbols:reviews-rounded" />
      </ActionIcon>
      <Modal
        scrollAreaComponent={ScrollArea.Autosize}
        title={<Title order={5}>{title}</Title>}
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
                  <Title order={4}>Reviews</Title>
                </Group>
                <Divider />
              </Stack>
              {[1, 2, 3, 4].map((val) => (
                <Stack key={val}>
                  <Group align="start" spacing={5} noWrap>
                    <Avatar src={""} alt={""} radius="xl" />
                    <Stack spacing={2}>
                      <Text
                        size="sm"
                        fw={500}
                        sx={{
                          textTransform: "capitalize",
                        }}
                      >
                        Aashish Gurung
                      </Text>
                      <Box>
                        <Text size="sm">This is one of the best product</Text>
                      </Box>
                      <Text size="xs" color="dimmed" ml={5}>
                        1 minute ago
                      </Text>
                    </Stack>
                  </Group>
                  <Divider variant="dashed" />
                </Stack>
              ))}
              <Textarea
                placeholder="Type a review"
                autosize
                minRows={1}
                maxRows={15}
                rightSection={
                  <ActionIcon variant="filled" color="violet">
                    <Icon icon="majesticons:send" />
                  </ActionIcon>
                }
              />
            </Stack>
          </Card.Section>
        </Card>
      </Modal>
    </Fragment>
  );
};

export default Reviews;
