import React from "react";
import Link, {LinkProps} from "@mui/material/Link";
import {Link as RouterLink} from "react-router-dom";

interface LinkRouterProps extends LinkProps {
    to: string;
    replace?: boolean;
}

function LinkRouter(props: LinkRouterProps) {
    return <Link component={RouterLink as any} underline="hover" color="inherit" {...props}/>;
}

export default LinkRouter;