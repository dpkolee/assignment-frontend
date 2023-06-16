import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
  Tooltip,
} from "@mantine/core";
import { GameListResponseType } from "./HomePage";
import { Icon } from "@iconify/react/dist/iconify.js";
import GameFeedback from "./GameFeedback";

type Props = {
  val: GameListResponseType;
};

const Games = ({ val }: Props) => {
  return (
    <Card withBorder radius="sm" p="sm" w={"100%"} maw={300}>
      <Card.Section>
        <Image src={val.image} alt={val.name} height={180} />
      </Card.Section>
      <Card.Section mt="md" inheritPadding>
        <Group position="apart">
          <Text fz="md" fw={500}>
            {val.name}
          </Text>
          <Tooltip label="rating" withArrow>
            <Badge
              size="md"
              color="violet"
              leftSection={<Icon icon="ph:star-fill" />}
            >
              {val.rating}
            </Badge>
          </Tooltip>
        </Group>
      </Card.Section>
      <Group mt="xs" position="apart">
        <Button
          radius="md"
          variant="default"
          color="violet"
          style={{ flex: 1 }}
          leftIcon={<Icon icon="ic:baseline-play-arrow" fontSize={20} />}
        >
          Play
        </Button>
        <GameFeedback val={val} title={"Game Detail & Feedbacks"} />
      </Group>
    </Card>
  );
};

export default Games;
