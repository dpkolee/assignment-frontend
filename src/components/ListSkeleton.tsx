import { Box, Skeleton, Stack } from "@mantine/core";

type Props = {
  isLoading: boolean;
  spacing?: number;
  count?: number;
};

const ListSkeleton = ({ isLoading, spacing = 5, count = 1 }: Props) => {
  return (
    <Stack spacing={spacing}>
      {Array(count)
        ?.fill(1)
        .map((_, index) => (
          <Box key={index} sx={{ display: "flex" }}>
            <Skeleton
              visible={isLoading}
              height={50}
              circle
              sx={{
                flexShrink: 0,
              }}
            />
            <Stack sx={{ width: "100%" }} spacing={5} justify="center">
              <Skeleton ml={5} visible={isLoading} height={15} width={"60%"} />
              <Skeleton ml={5} visible={isLoading} height={15} width={"40%"} />
            </Stack>
          </Box>
        ))}
    </Stack>
  );
};

export default ListSkeleton;
