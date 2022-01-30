## Install
```
npm i
```

## Start
```
npm start
```

## Metric 

### For each protocol  

**URL** : `GET /metric/uniswap`

**Success Responses**

```json 
[
    {
        "Date": "2021-01-27",
        "FDV": "13796717917.36",
        "Volume": "1870143777.97",
        "TVL": "3428545532.14",
        "Revenue": "2366886.79",
        "Protocol": "Uniswap",
        "Type": "DEX"
    },
    {
        "Date": "2021-01-30",
        "FDV": "15645275352.35",
        "Volume": "1616973238.72",
        "TVL": "3452629790.11",
        "Revenue": "2197833.69",
        "Protocol": "Uniswap",
        "Type": "DEX"
    },
```

**URL** : `GET /metric/sushiswap`

**URL** : `GET /metric/balancer`

**URL** : `GET /metric/makerdao`

**URL** : `GET /metric/aave`

**URL** : `GET /metric/compound`

**URL** : `GET /metric/nexus`

**URL** : `GET /metric/synthetix`

### All

**URL** : `GET /metric/all`

## Activity  

**URL** : `POST /activity/address`

**Data constraints**

```json
{
  "address": "[address]"
}
```

**Success Responses**


```json 
{
    "balance": 311879.48496095353,
    "protocol": [
        {
            "name": "Alchemix",
            "logo_url": "https://static.debank.com/image/project/logo_url/alchemix/bc3498bd6fb0ffc5cb7547eedf49ea11.png",
            "site_url": "https://app.alchemix.fi",
            "asset": 4022.2032523432777
        },
        {
            "name": "Curve",
            "logo_url": "https://static.debank.com/image/project/logo_url/curve/aa991be165e771cff87ae61e2a61ef68.png",
            "site_url": "https://curve.fi",
            "asset": 22716.884488098865
        }
    ]
}

```

**Error example**

```json 
{
  "Address is not valid"
}

