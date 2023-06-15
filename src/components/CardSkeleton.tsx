import { Skeleton } from "@mantine/core";
import { Fragment } from "react";

type Props = {
  count?: number;
};

const CardSkeleton = ({ count = 1 }: Props) => {
  return (
    <Fragment>
      {Array(count)
        ?.fill(1)
        .map((_, index) => (
          <Skeleton key={index} visible={true} height={300} width={300} />
        ))}
    </Fragment>
  );
};

export default CardSkeleton;
