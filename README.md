# <u>Yield Farm Auto Compunder</u>

> #### Setting up the program

```bash
npm install
```

After installing, create a `.env` file in the same directory as the script. Inside `.env` file, 

```
WWS=<Web Socket in BSC mainnet, in my example, I uses Ankr>
PRIVATE_KEY=<Wallet's private key>
```

My Ankr API:

```
wss://apis.ankr.com/wss/50d30803672f4ecc9974246b173295e5/ff6ef4a86ddbbc4d098d764fd9063d6e/binance/full/main
```





> #### Running the program

```bash
npm start
```





> #### Explanation of how the script works

```javascript
const provider = new ethers.providers.WebSocketProvider(process.env.WWS);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
const signer = wallet.connect(provider)

const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('U985Q4-G2J9X22GAV');
const pid_cake_bnb = 251
const farm_multiplier_cake_bnb = 40
const total_farm_multiplier = 102.1; 
const total_emission_per_day = 72400; 
const deadline = Date.now() + 1000 * 60 * 10
const bsc_tx_scan = "https://www.bscscan.com/tx/"
const api_wbnb = "https://api.pancakeswap.info/api/v2/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
const api_cake = "https://api.pancakeswap.info/api/v2/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"

```

- `wolfram-alpha-api` is used to calculate the optimal frequency computation. 

- `pid`, `farm_multiplier_cake_bnb` can be found via pancakeswap api:

  ```
  https://api.pancakeswap.info/api/v2/summary
  https://api.pancakeswap.info/api/v2/pairs
  https://api.pancakeswap.info/api/v2/tokens
  ```

*Note* *: Wolfram-alpha-api is just one of the method to calculate the  optimal frequency, the result itself is backed by another included in `optimal.py`.



```javascript
async function init() {
    const [cake_wbnb_liquidity, cake_price, cake_wbnb_amount_in_usd, cake_pending_reward] = await getPoolUserInfo(pid_cake_bnb, wallet.address, api_cake, api_wbnb)
    const apr_cake_wbnb = calculateAPR(cake_wbnb_liquidity, cake_price, farm_multiplier_cake_bnb);
    const [ execution, estimate_time_new, estimate_time_pending ] = await checkCompoundFrequency(apr_cake_wbnb, cake_wbnb_amount_in_usd, cake_pending_reward, cake_price);

    if (execution) {
        const reward_cake = await depositRewardLP(pid_cake_bnb, 0);
        const [amount_cake, amount_wbnb] = await swapReward(addresses.CAKE, addresses.WBNB, reward_cake)
        const cake_wbnb_lp = await convertToLp(addresses.CAKE, addresses.WBNB, amount_cake, amount_wbnb)
        await depositRewardLP(pid_cake_bnb, cake_wbnb_lp)

        console.log("Estimate time till compounding: " +  estimate_time_new + " Hours")
        setTimeout(init, estimate_time_new * 60 * 60)

    } else {
        console.log("Estimate time till compounding: " +  estimate_time_pending + " Hours")
        setTimeout(init, estimate_time_pending * 24 * 60)
    }
}
```

- `getPoolUserInfo()` will take in `pid_cake_bnb`, `wallet.address`/`public key`, both api of CAKE and WBNB, and returned back the liquidity info of the `cake_wbnb_liquidity`, CAKE price, amount of CAKE and WBNB and the pending reward.
- apr of cake_wbnb will then be calculated. 
- `checkCompoundFrequency()` will calculate the optimal compound frequency using `apr_cake_wbnb`, `cake_wbnb_amount_in_usd`, `cake_pending_reward` and `cake_price`. 
- If global maxima (optimal frequncy) is found, the program will start the optimizing process:
  - deposit rewarded cake
  - swap half of the rewarded cake into wbnb
  - convert these 2 tokens in LP
  - deposit the newly created LP
  - wait for next compounding time based on the calculated optimal frequency and do the process again





> #### Demo video

https://youtu.be/7cXboW-nKBg





> #### Reference links

```
https://github.com/pancakeswap/pancake-frontend/blob/master/src/config/constants/farms.ts
https://api.pancakeswap.info/api/v2/summary
https://api.pancakeswap.info/api/v2/pairs
https://api.pancakeswap.info/api/v2/tokens
https://docs.pancakeswap.finance/code/migration/masterchef-v2
https://docs.pancakeswap.finance/code/smart-contracts/pancakeswap-exchange/router-v2
https://docs.pancakeswap.finance/code/smart-contracts/pancakeswap-exchange/router-v2
```

