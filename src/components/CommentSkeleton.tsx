import { Box, Divider, Skeleton, Stack } from "@mantine/core";
import { Fragment } from "react";

type Props = {
  isLoading: boolean;
  spacing?: number;
  count?: number;
};

const CommentSkeleton = ({ isLoading, spacing = 5, count = 1 }: Props) => {
  return (
    <Stack spacing={spacing}>
      {Array(count)
        ?.fill(1)
        .map((_, index) => (
          <Fragment key={index}>
            <Box sx={{ display: "flex" }}>
              <Skeleton
                visible={isLoading}
                height={40}
                circle
                sx={{
                  flexShrink: 0,
                }}
              />
              <Stack sx={{ width: "100%" }} spacing={10} justify="center">
                <Skeleton
                  ml={5}
                  visible={isLoading}
                  height={15}
                  width={"25%"}
                />
                <Skeleton
                  ml={5}
                  visible={isLoading}
                  height={50}
                  width={"40%"}
                />
              </Stack>
            </Box>
            <Divider variant="dashed" />
          </Fragment>
        ))}
    </Stack>
  );
};

export default CommentSkeleton;
