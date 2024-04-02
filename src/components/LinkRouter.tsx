import React from "react";
import Link, {LinkProps} from "@mui/material/Link";
import {Link as RouterLink} from "react-router-dom";

interface LinkRouterProps extends LinkProps {
    to: string;
    replace?: boolean;
}

function LinkRouter(props: LinkRouterProps) {
    return <Link {...props} component={RouterLink as any}/>;
}

export default LinkRouter;