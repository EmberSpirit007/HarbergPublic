export const chainsData = [
    {
        //sepolia
        id: 11155111,
        thegraph: "https://api.studio.thegraph.com/query/71271/harb/v0.0.50",
        path: "sepolia",
        stake: "0xCd21a41a137BCAf8743E47D048F57D92398f7Da9",
        harb: "0x087F256D11fe533b0c7d372e44Ee0F9e47C89dF9",
        uniswap: "https://app.uniswap.org/swap?chain=mainnet&inputCurrency=NATIVE"
    }, {
        //base-sepolia
        id: 84532,
        thegraph: "https://api.studio.thegraph.com/query/71271/harb-base-sepolia/v0.0.10",
        path: "sepoliabase",
        stake: "0xe28020BCdEeAf2779dd47c670A8eFC2973316EE2",
        harb: "0x22c264Ecf8D4E49D1E3CabD8DD39b7C4Ab51C1B8",
        uniswap: "https://app.uniswap.org/swap?chain=mainnet&inputCurrency=NATIVE"
    }
]

export function getChain(id:number){
    return chainsData.find((obj) => obj.id === id)
}
