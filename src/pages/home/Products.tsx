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
import { useMutation } from "@tanstack/react-query";
import api from "../../utils/api-interceptor";
import { AxiosError, AxiosResponse } from "axios";
import { notifications } from "@mantine/notifications";
import Reviews from "./Reviews";

type Props = {
  val: GameListResponseType;
};

type FormDataProps = { product_id: number };

const Products = ({ val }: Props) => {
  //product purchase action mutation
  const productPurchaseMutation = useMutation(
    (data: FormDataProps) => {
      return api.post("/product/buy/", data);
    },
    {
      onSuccess: (response: AxiosResponse) => {
        const { success } = response?.data;
        notifications.show({
          id: "purchase-success",
          color: "green",
          icon: <Icon icon="fluent:checkmark-24-filled" />,
          title: "Success",
          message: success ?? "Successfully purchased the product",
        });
      },
      onError: (error: AxiosError) => {
        const { detail } = error.response?.data as { detail: string };
        if (detail) {
          notifications.show({
            id: detail,
            color: "red",
            icon: <Icon icon="fluent:dismiss-24-filled" />,
            title: "ERROR",
            message: detail,
          });
        } else {
          notifications.show({
            id: "Server Error",
            color: "red",
            icon: <Icon icon="fluent:dismiss-24-filled" />,
            title: "Something Went Wrong !",
            message:
              "There seems to be something wrong with the server, Please try again later",
          });
        }
      },
    }
  );

  const handleProductPurchase = (productId: number) => {
    productPurchaseMutation.mutate({ product_id: productId });
  };
  return (
    <Card withBorder radius="sm" p="sm" key={val.id} miw={250} maw={300}>
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
          loading={productPurchaseMutation?.isLoading}
          radius="md"
          variant="filled"
          color="violet"
          style={{ flex: 1 }}
          leftIcon={<Icon icon="icon-park-solid:buy" fontSize={18} />}
          onClick={() => {
            handleProductPurchase(val.id);
          }}
        >
          Buy
        </Button>
        <Reviews val={val} title={"Product Detail & Reviews"} />
      </Group>
    </Card>
  );
};

export default Products;
