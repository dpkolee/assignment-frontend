import { MantineThemeOverride } from "@mantine/styles/lib/theme/types/MantineTheme";

export const Theme: MantineThemeOverride = {
  colorScheme: "dark",
  loader: "bars",
  defaultGradient: {
    from: "brand.6",
    to: "secondary.6",
    deg: 90,
  },
  globalStyles: (theme) => ({
    "*, *::before, *::after": {
      boxSizing: "border-box",
    },
    body: {
      ...theme.fn.fontStyles(),
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      lineHeight: theme.lineHeight,
    },
  }),
};
