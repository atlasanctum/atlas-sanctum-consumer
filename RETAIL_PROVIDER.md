# Atlas Retail Provider Contract

Atlas’s initial live retail adapter targets the eBay Browse API. The implementation uses the item-summary search resource, which searches listings by keyword or GTIN, supports price-oriented sorting, and requires an application access token from the client-credentials flow. The server, rather than the mobile client, holds the application credentials and obtains the token.

| Capability | Adapter behavior |
| --- | --- |
| Search | Calls `GET /buy/browse/v1/item_summary/search` with a short query and bounded result count. |
| Price evidence | Maps the listing price plus first available shipping cost into a transparent total-price field. |
| Trust | Returns retrieval time, provider name, and a documentation evidence source. |
| Fallback | When `EBAY_CLIENT_ID` or `EBAY_CLIENT_SECRET` is absent, returns `credentials_missing`; the UI does not present stale values as live prices. |
| User protection | Search results remain informational. Atlas does not execute checkout or purchasing actions. |

## Source

The Browse API overview states that all methods require an application access token acquired through the client-credentials grant, and the item-summary search method exposes keyword search, item summaries, filters, and price sorting. [1]

[1]: https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search "eBay Browse API — item_summary search"
