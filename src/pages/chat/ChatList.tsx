import {
  Avatar,
  createStyles,
  Group,
  Indicator,
  ScrollArea,
  Text,
  UnstyledButton,
  Container,
  Stack,
} from "@mantine/core";
import { Fragment, ReactElement, useState } from "react";
import ChatBox from "./ChatBox";
import { useQuery } from "@tanstack/react-query";
import { helperUtils } from "../../utils/helpers";
import api from "../../utils/api-interceptor";
import ListSkeleton from "../../components/ListSkeleton";
import ServerError from "../../components/ServerError";
import NoData from "../../components/NoData";

const useStyles = createStyles((theme) => ({
  list: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    transition: "background-color 150ms ease, border-color 150ms ease",
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
    "&:hover": {
      backgroundColor: theme.colors.dark[6],
    },
  },
}));

export interface UserProps {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  online: boolean;
  profile_image: string;
}

export default function ChatList(): ReactElement {
  const [openChatbox, setOpenChatBox] = useState(false);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const { classes, cx } = useStyles();

  const {
    isLoading,
    data: chatList,
    isError,
    refetch,
  } = useQuery(
    ["user-list"],
    () => {
      const response = api.get(`/auth/user/list/`);
      return response;
    },
    {
      enabled: helperUtils?.isLogin(),
    }
  );
  return (
    <Fragment>
      {openChatbox ? (
        <ChatBox
          setOpenChatBox={setOpenChatBox}
          senderId={senderId}
          receiverId={receiverId}
          selectedUser={selectedUser}
        />
      ) : (
        <Fragment>
          <ScrollArea h={"100%"} offsetScrollbars scrollbarSize={10}>
            <Container size={"md"} p={0} w={"100%"}>
              {isLoading && (
                <ListSkeleton isLoading={isLoading} count={9} spacing={10} />
              )}
              <Stack spacing={3}>
                {chatList?.data?.results.map((val: UserProps) => (
                  <UnstyledButton
                    key={val?.id}
                    className={cx(classes.list)}
                    onClick={() => {
                      setOpenChatBox(true);
                      setSelectedUser(val);
                      setSenderId(val.id);
                      setReceiverId(helperUtils?.getUser() ?? "");
                    }}
                  >
                    <Group spacing={10}>
                      <Indicator
                        position="bottom-end"
                        color={val?.online ? "green" : "gray"}
                        size={12}
                        withBorder
                        processing
                      >
                        <Avatar
                          variant={"filled"}
                          color="violet"
                          src={val?.profile_image ?? ""}
                          radius="md"
                          size={"md"}
                        />
                      </Indicator>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                          {val?.first_name ?? ""} {val?.last_name ?? ""}
                        </Text>
                        <Text color={"dimmed"} size="xs">
                          @{val?.username ?? ""}
                        </Text>
                      </div>
                    </Group>
                  </UnstyledButton>
                ))}
              </Stack>
              {isError ? (
                <ServerError reload={refetch} src="/chat.svg" />
              ) : (
                <NoData
                  data={chatList?.data}
                  src="/chat.svg"
                  title={"Friend list is empty"}
                  description={"Start adding people to chat"}
                />
              )}
            </Container>
          </ScrollArea>
        </Fragment>
      )}
    </Fragment>
  );
}
