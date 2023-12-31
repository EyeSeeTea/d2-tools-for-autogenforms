//
import React from "react";
import { useConfig } from "@dhis2/app-runtime";
import { buildUrl } from "capture-core-utils";
import { NonBundledIcon } from "capture-ui";

export const NonBundledDhis2Icon = ({ name, alternativeText = name, ...passOnProps }) => {
    const { baseUrl, apiVersion } = useConfig();
    const source = name && buildUrl(baseUrl, `api/${apiVersion}/icons/${name}/icon.svg`);

    return <NonBundledIcon {...passOnProps} source={source} alternativeText={alternativeText} />;
};
