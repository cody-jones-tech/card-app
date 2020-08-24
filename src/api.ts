import axios from 'axios';

import { PagedCardsResponse } from "./models/card";

interface GetCardsOptions {
    search?: string;
    url?: string;
}

export const getCards = async (options: GetCardsOptions) => {
    const { data } = await (options.url ? axios.get<PagedCardsResponse>(options.url) :
        axios.get<PagedCardsResponse>('https://api.elderscrollslegends.io/v1/cards', {
            params: {
                pageSize: 20,
                name: options.search?.trim() === "" ? undefined : options.search
            }
        }))
    return data;
}