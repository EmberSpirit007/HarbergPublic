import { http, createConfig, createStorage } from "@wagmi/vue";
import { base } from "@wagmi/vue/chains";
import { coinbaseWallet, walletConnect } from "@wagmi/vue/connectors";
console.log("base", base);

export const config = createConfig({
	chains: [base],
	storage: createStorage({ storage: window.localStorage }),

	connectors: [
		walletConnect({
			projectId: "d8e5ecb0353c02e21d4c0867d4473ac5",
			metadata: {
				name: "Harberg",
				description: "Connect your wallet with Harberg",
				url: "https://harberg.eth.limo",
				icons: [""],
			},
		}),
		coinbaseWallet({ appName: "Harberg", darkMode: true }),
	],
	transports: {
		[base.id]: http(),
	},
});
