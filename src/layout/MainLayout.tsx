import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Group,
  Header,
  Menu,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import { helperUtils } from "../utils/helpers";
import { Icon } from "@iconify/react/dist/iconify.js";
import AsideWrapper from "../pages/chat";

const MainLayout = () => {
  const navigate = useNavigate();
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
          {helperUtils?.isLogin() ? (
            <Group position="apart">
              <Group spacing={5} align="center" color="voilet">
                <ThemeIcon color="violet" size={"xl"} variant="outline">
                  <Icon
                    icon="solar:gamepad-minimalistic-outline"
                    fontSize={35}
                  />
                </ThemeIcon>
                <Text fz="xl" ta="center" fw={700} variant="text">
                  Gamerfric
                </Text>
              </Group>
              <Group spacing={5}>
                <Tooltip label="Redeem points" withArrow>
                  <Badge
                    size="lg"
                    color="violet"
                    variant="filled"
                    leftSection={
                      <Group>
                        <Icon icon="material-symbols:redeem" fontSize={18} />
                      </Group>
                    }
                  >
                    100
                  </Badge>
                </Tooltip>
                <Menu shadow="md" width={200} withArrow>
                  <Menu.Target>
                    <Avatar radius="xl" sx={{ cursor: "pointer" }} />
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
                        helperUtils.logout(navigate);
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          ) : (
            <Group position="right">
              <Button
                variant="default"
                onClick={() => {
                  navigate("/login");
                }}
                leftIcon={
                  <Icon icon="ant-design:unlock-outlined" fontSize={20} />
                }
              >
                Login
              </Button>
              <Button
                color="violet"
                onClick={() => {
                  navigate("/signup");
                }}
                leftIcon={
                  <Icon icon="ant-design:user-add-outlined" fontSize={20} />
                }
              >
                Signup
              </Button>
            </Group>
          )}
        </Header>
      }
      aside={<AsideWrapper />}
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
