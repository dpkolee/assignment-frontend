import { Button, Stack } from "@mantine/core";
import NoData from "./NoData";
import { Icon } from "@iconify/react";
import { CSSProperties } from "react";

interface Props {
  src?: string;
  reload: () => void;
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
}

const ServerError = ({
  src = "/no_data_error.svg",
  reload,
  width = 200,
  height = "auto",
  style,
}: Props) => {
  return (
    <Stack align="center" spacing={1}>
      <NoData
        data={{ results: [] }}
        src={src}
        width={width}
        height={height}
        style={{
          maxWidth: 500,
          ...style
        }}
        title={"Something went wrong !"}
        description={"Problem occured while fetching data, please try reloading"}
      />
      <Button
        variant="default"
        leftIcon={
          <Icon icon="fluent:arrow-clockwise-24-filled" fontSize={20} />
        }
        onClick={() => {
          reload();
        }}
      >
        Reload
      </Button>
    </Stack>
  );
};

export default ServerError;
