import { Grid, Skeleton } from "@mantine/core";

type Props = {
  count?: number;
};

const CardSkeleton = ({ count = 1 }: Props) => {
  return (
    <Grid justify="flex-end">
      {Array(count)
        ?.fill(1)
        .map((_, index) => (
          <Grid.Col
            lg={3}
            md={6}
            sm={12}
            xs={12}
            key={index}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Skeleton
              key={index}
              visible={true}
              height={300}
              w={"100%"}
              maw={300}
            />
          </Grid.Col>
        ))}
    </Grid>
  );
};

export default CardSkeleton;
