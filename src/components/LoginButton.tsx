import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import { Icon } from "@iconify/react";

const LoginButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="default"
      leftIcon={<Icon icon="ant-design:unlock-outlined" fontSize={20} />}
      onClick={() => {
        navigate("/login", { replace: true });
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
