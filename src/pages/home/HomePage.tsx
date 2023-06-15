import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, Divider, Group, ScrollArea, Stack, Title } from "@mantine/core";
import CardSkeleton from "../../components/CardSkeleton";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api-interceptor";
import Products from "./Products";
import Games from "./Games";
import ServerError from "../../components/ServerError";
import NoData from "../../components/NoData";

export interface GameListResponseType {
  id: number;
  image: string;
  name: string;
  rating: number;
}

export function HomePage() {
  const {
    isLoading: isGameListLoading,
    data: gameList,
    isError: isGameListError,
    refetch: gameListRefetch,
  } = useQuery(["game-list"], () => {
    const response = api.get(`/product/game/list/`);
    return response;
  });

  const {
    isLoading: isProductListLoading,
    data: productList,
    isError: isProductListError,
    refetch: productListRefetch,
  } = useQuery(["product-list"], () => {
    const response = api.get(`/product/list/`);
    return response;
  });

  return (
    <Box>
      <Stack spacing={25} mt={20}>
        <Stack>
          <Group align="center" position="right" spacing={10}>
            <Icon icon="ion:game-controller" fontSize={25} />
            <Title order={4}>GAMES</Title>
          </Group>
          <Divider />
          <ScrollArea h={"100%"} offsetScrollbars scrollbarSize={10}>
            <Group noWrap position="center">
              {isGameListLoading && <CardSkeleton count={5} />}
              {gameList?.data?.results?.map((val: GameListResponseType) => (
                <Games val={val} />
              ))}
              {isGameListError ? (
                <ServerError
                  reload={gameListRefetch}
                  src="/no_data_error.svg"
                />
              ) : (
                <NoData
                  data={gameList?.data}
                  src="/no_data.svg"
                  title={"Game list is empty"}
                  description={"Data will be added soon keep visiting"}
                />
              )}
            </Group>
          </ScrollArea>
        </Stack>
        <Stack>
          <Group align="center" position="right" spacing={10}>
            <Icon icon="fluent:apps-list-detail-24-filled" fontSize={25} />
            <Title order={4}>PRODUCT LIST</Title>
          </Group>
          <Divider />
          <ScrollArea h={"100%"} offsetScrollbars scrollbarSize={10}>
            <Group noWrap position="center">
              {isProductListLoading && <CardSkeleton count={5} />}
              {productList?.data?.results?.map((val: GameListResponseType) => (
                <Products val={val} />
              ))}
              {isProductListError ? (
                <ServerError
                  reload={productListRefetch}
                  src="/no_data_error.svg"
                />
              ) : (
                <NoData
                  data={productList?.data}
                  src="/no_data.svg"
                  title={"Product list is empty"}
                  description={"Data will be added soon keep visiting"}
                />
              )}
            </Group>
          </ScrollArea>
        </Stack>
      </Stack>
    </Box>
  );
}

export default HomePage;
