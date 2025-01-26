import { http, createConfig, createStorage } from "@wagmi/vue";
import { baseSepolia } from "@wagmi/vue/chains";
import { coinbaseWallet, walletConnect } from "@wagmi/vue/connectors";

export const config = createConfig({
	chains: [baseSepolia],
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
		[baseSepolia.id]: http(),
	},
});
