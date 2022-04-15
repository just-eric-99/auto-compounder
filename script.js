const WolframAlphaAPI = require('wolfram-alpha-api');
waApi = WolframAlphaAPI("4U65GE-5E2AHT448U")

console.log("http://api.wolframalpha.com/v1/simple?appid=4U65GE-5E2AHT448U");

console.log(waApi.getFull());



const principal = 10000
const APY = 10
const gasFee = 0.1

console.log("maximize y=" + principal + "*(1+((" + APY + "/x)-(" + gasFee/principal + ")))^x on [1, 365]");