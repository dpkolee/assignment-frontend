import { Image, Stack, Title, Text, Box } from "@mantine/core";
import { CSSProperties } from "react";

type Props = {
  data: {
    results: Array<Object>;
  };
  src?: string;
  title?: string;
  description?: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
};

const NoData = (props: Props) => {
  const {
    data,
    src,
    title = "No Data",
    description = "Start adding data to see results",
    width = 200,
    height = "auto",
    style,
  } = props;
  return (
    <Stack
      justify="center"
      align="center"
      display={data?.results?.length == 0 ? "flex" : "none"}
      py={30}
      px={10}
      spacing={5}
    >
      <Image
        fit="contain"
        width={width}
        height={height}
        src={src ?? "/no_data.svg"}
        alt="no data paceholder"
        style={style}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          textTransform: "capitalize",
        }}
      >
        <Title order={6}>{title}</Title>
        {description && (
          <Text color="dimmed" size={14}>
            {description}
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default NoData;
