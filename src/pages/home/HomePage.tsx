import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Box,
  Divider,
  Grid,
  Group,
  Stack,
  Title,
} from "@mantine/core";
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
          {isGameListLoading && <CardSkeleton count={4} />}
          {gameList?.data?.results?.length > 0 && (
            <Grid justify="flex-end">
              {gameList?.data?.results?.map((val: GameListResponseType) => (
                <Grid.Col
                  lg={3}
                  md={6}
                  sm={12}
                  xs={12}
                  key={val.id}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Games val={val} />
                </Grid.Col>
              ))}
            </Grid>
          )}
          {isGameListError ? (
            <ServerError reload={gameListRefetch} src="/no_data_error.svg" />
          ) : (
            <NoData
              data={gameList?.data}
              src="/no_data.svg"
              title={"Game list is empty"}
              description={"Data will be added soon keep visiting"}
            />
          )}
        </Stack>
        <Stack>
          <Group align="center" position="right" spacing={10}>
            <Icon icon="fluent:apps-list-detail-24-filled" fontSize={25} />
            <Title order={4}>PRODUCT LIST</Title>
          </Group>
          <Divider />
          {isProductListLoading && <CardSkeleton count={5} />}
          {productList?.data?.results?.length > 0 && (
            <Grid justify="flex-end">
              {productList?.data?.results?.map((val: GameListResponseType) => (
                <Grid.Col
                  lg={3}
                  md={6}
                  sm={12}
                  xs={12}
                  key={val.id}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Products val={val} />
                </Grid.Col>
              ))}
            </Grid>
          )}
          {isProductListError ? (
            <ServerError reload={productListRefetch} src="/no_data_error.svg" />
          ) : (
            <NoData
              data={productList?.data}
              src="/no_data.svg"
              title={"Product list is empty"}
              description={"Data will be added soon keep visiting"}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default HomePage;
