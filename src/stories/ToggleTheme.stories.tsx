import { Meta, StoryObj } from "@storybook/react";

import ToggleTheme from "../components/ToggleTheme";
import React from "react";

const meta: Meta<typeof ToggleTheme> = {
    component: ToggleTheme,
};

export default meta;
type Story = StoryObj<typeof ToggleTheme>;

export const Default: Story = {
    render: () => <ToggleTheme />,
};
