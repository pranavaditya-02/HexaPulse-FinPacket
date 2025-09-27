CATEGORY_KEYWORDS = {
    "markets": ["market", "equities", "stocks", "indexes", "indices", "futures", "commodities", "forex"],
    "stocks": ["stock", "shares", "equity", "ipo", "buyback", "earnings", "q1", "q2", "q3", "q4", "guidance"],
    "economy": ["gdp", "inflation", "cpi", "ppi", "employment", "unemployment", "rbi", "sebi", "fed", "ecb"],
    "crypto": ["bitcoin", "ethereum", "crypto", "token", "blockchain", "web3"],
    "general": ["business", "finance", "company", "deal", "merger", "acquisition"],
}

FIN_KEYWORDS_WEIGHTED = {
    "rbi": 20, "sebi": 15, "sensex": 25, "nifty": 25, "bank nifty": 20,
    "bps": 10, "rate hike": 20, "rate cut": 20, "inflation": 15, "gdp": 15,
    "earnings": 15, "results": 10, "merger": 20, "acquisition": 20,
    "ipo": 15, "fii": 15, "dii": 12, "usd": 10, "brent": 10,
}

COMPANIES_IN = [
    "Reliance Industries", "TCS", "Infosys", "HDFC Bank", "ICICI Bank", "State Bank of India",
    "Bharti Airtel", "Hindustan Unilever", "ITC", "Larsen & Toubro", "Kotak Mahindra Bank",
    "Adani Enterprises", "Tata Motors", "Maruti Suzuki", "Wipro",
]

INDICES_IN = ["Sensex", "Nifty", "Nifty Bank", "Nifty 50", "Nifty Next 50", "Nifty IT", "Nifty FMCG"]

REGULATORS_IN = ["RBI", "SEBI", "IRDAI", "PFRDA", "Finance Ministry", "Federal Reserve", "ECB"]
