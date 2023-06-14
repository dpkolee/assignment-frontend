import { AppShell, Avatar, Button, Group, Header, Menu } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import { helperUtils } from "../utils/helpers";
import { Icon } from "@iconify/react/dist/iconify.js";

type Props = {};

const MainLayout = (props: Props) => {
  const navigate = useNavigate();
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
          {helperUtils?.isLogin() ? (
            <Group position="right">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Avatar radius="xl" />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Profile</Menu.Label>
                  <Menu.Item
                    icon={<Icon icon="fluent:slide-text-person-24-regular" />}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    icon={<Icon icon="fluent:sign-out-24-filled" />}
                    onClick={() => {
                        helperUtils.logout(navigate)
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            <Group position="right">
              <Button
                variant="default"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
              <Button
                color="violet"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Signup
              </Button>
            </Group>
          )}
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
};

export default MainLayout;
