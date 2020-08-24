export interface CardSet {
    name: string;
}

export default interface Card {
    id: string;
    imageUrl: string;
    name: string;
    text: string;
    type: string;
    set: CardSet;
}

export interface PagedCardsResponse {
    cards: Card[];
    _links?: {
        next?: string;
    }
    _pageSize: number;
    _totalCount: number;
}