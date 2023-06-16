import { Container, Divider, Group, Title } from "@mantine/core";
import { Fragment } from "react";
import ChatList from "./ChatList";
import { Icon } from "@iconify/react/dist/iconify.js";

const Chat = () => {
  return (
    <Fragment>
      <Container size={"md"} p={0} w={"100%"}>
        <Group spacing={5} p={10}>
          <Icon icon="raphael:users" fontSize={20} />
          <Title order={4}>Gamers list</Title>
        </Group>
        <Divider mb={10} />
      </Container>
      <ChatList />
    </Fragment>
  );
};

export default Chat;
