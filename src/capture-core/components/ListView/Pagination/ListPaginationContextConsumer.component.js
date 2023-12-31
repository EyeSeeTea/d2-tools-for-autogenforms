//
import React, { useContext } from "react";
import { PaginationContext } from "../listView.context";
import { ListPaginationMain } from "./ListPaginationMain.component";

export const ListPaginationContextConsumer = props => {
    const paginationContextData = useContext(PaginationContext);

    return <ListPaginationMain {...props} {...paginationContextData} />;
};
