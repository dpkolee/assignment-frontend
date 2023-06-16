import { Aside, Stack } from "@mantine/core";
import { Fragment, ReactElement } from "react";
import Chat from "./Chat";
import NoData from "../../components/NoData";
import { helperUtils } from "../../utils/helpers";
import LoginButton from "../../components/LoginButton";

export default function AsideWrapper(): ReactElement {
  return (
    <Aside p={5} hiddenBreakpoint="sm" width={{ xs: 300 }} zIndex={0.1}>
      {helperUtils?.isLogin() ? (
        <Chat />
      ) : (
        <Fragment>
          <Stack spacing={5} align="center" justify="center">
            <NoData
              data={{ results: [] }}
              src="/chat.svg"
              title="Not logged in ?"
              description="Login To Enable Chat Feature"
            />
            <LoginButton />
          </Stack>
        </Fragment>
      )}
    </Aside>
  );
}
