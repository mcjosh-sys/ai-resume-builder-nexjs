
export type PageProps<
    Params extends Record<string, string | string[]> = {},
    SearchParams extends Record<string, string | string[]> = {}
> = {
    params: Promise<Params>;
    searchParams: Promise<SearchParams>;
};
