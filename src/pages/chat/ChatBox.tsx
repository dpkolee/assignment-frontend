import { Icon } from "@iconify/react";
import {
  Group,
  ActionIcon,
  Indicator,
  Avatar,
  Divider,
  Tooltip,
  Text,
  ScrollArea,
  Textarea,
  createStyles,
  Container,
} from "@mantine/core";
import { Fragment } from "react";
import { UserProps } from "./ChatList";

const useStyles = createStyles((theme) => ({
  messageBox: {
    transform: "rotateX(180deg)",
    direction: "rtl",
  },
  messageByMe: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    transform: "rotateX(180deg)",
    direction: "ltr",
    "&:hover": {
      "& $msgDel": {
        opacity: 1,
      },
    },
  },
  messageByMeText: {
    backgroundColor: theme.colors.violet,
    wordBreak: "break-word",
    whiteSpace: "break-spaces",
    color: "white",
    display: "flex",
    padding: 10,
    paddingTop: 5,
    borderRadius: "20px 20px 20px 0px",
  },
  messageByOther: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 5,
    transform: "rotateX(180deg)",
    direction: "ltr",
    "&:hover": {
      "& $msgDel": {
        opacity: 1,
      },
    },
  },
  messageByOtherText: {
    backgroundColor: theme.colors.voilet,
    wordBreak: "break-word",
    whiteSpace: "break-spaces",
    color: "white",
    padding: 10,
    paddingTop: 5,
    borderRadius: "20px 0px 20px 20px",
  },
}));

type Props = {
  setOpenChatBox: (value: boolean) => void;
  senderId: string;
  receiverId: string;
  selectedUser: UserProps | null;
};

const ChatBox = ({ setOpenChatBox, selectedUser }: Props) => {
  const { classes } = useStyles();

  return (
    <Fragment>
      <Container size={"md"} p={0} w={"100%"}>
        <Group position="apart" p={10}>
          <Group spacing={10}>
            <Indicator
              position="bottom-end"
              color={selectedUser?.online ? "green" : "gray"}
              size={12}
              withBorder
              processing
            >
              <Avatar
                variant={"filled"}
                color="violet"
                src={selectedUser?.profile_image ?? ""}
                radius="md"
                size={"md"}
              />
            </Indicator>
            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {selectedUser?.first_name ?? ""} {selectedUser?.last_name ?? ""}
              </Text>
              <Text color={"dimmed"} size="xs">
                @{selectedUser?.username ?? ""}
              </Text>
            </div>
          </Group>
          <Tooltip label="Go Back" withArrow>
            <ActionIcon
              size="md"
              variant="light"
              onClick={() => {
                setOpenChatBox(false);
              }}
            >
              <Icon icon="fluent:arrow-left-24-filled" fontSize={22} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Divider />
      </Container>
      <ScrollArea h={"100%"} className={classes.messageBox} scrollbarSize={10}>
        <Container size={"md"} p={0} w={"100%"}>
          {/* <Stack spacing={0} px={5}>
            {isLoading && <Loader mx={"auto"} variant="bars" mt={30} />}
            {chatHistory?.data?.results?.map((val: ResponseDataProps) => {
              if (val?.sender == receiverId) {
                return (
                  <Box className={classes.messageByMe}>
                    <Text className={classes.messageByMeText} fz={"sm"}>
                      {val.message}
                    </Text>
                  </Box>
                );
              } else {
                return (
                  <Box className={classes.messageByOther}>
                    <Text className={classes.messageByOtherText} fz={"sm"}>
                      {val?.message}
                    </Text>
                  </Box>
                );
              }
            })}
          </Stack> */}
        </Container>
      </ScrollArea>
      <Container size={"md"} p={0} w={"100%"}>
        <Textarea
          placeholder="Type a message"
          autosize
          minRows={1}
          maxRows={15}
          rightSection={
            <ActionIcon variant="filled" color="violet">
              <Icon icon="majesticons:send" />
            </ActionIcon>
          }
        />
      </Container>
    </Fragment>
  );
};

export default ChatBox;
