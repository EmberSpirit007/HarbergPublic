import Toast from "@/components/Toast.vue";
import { POSITION, useToast } from "vue-toastification";
import { reactive } from "vue";

const toast = useToast();

export function useContractToast() {
	function showFailToast(name?: string) {
		console.log("name", name);
		if (name === "UserRejectedRequestError") {
			//
		} else {
			showSuccessToast(
				"",
				"Failed!",
				"Your transaction didn’t go through. Please try again.",
				"If the issue persists, please send a message in #helpdesk on our Discord.",
				"",
				"error"
			);
		}
	}

	function showSuccessToast(
		value: string,
		header: string,
		subheader: string,
		info: string,
		unit: string,
		type: string = "info"
	) {
		// Define the content object with the component, props and listeners
		const content = {
			component: Toast,
			// Any prop can be passed, but don't expect them to be reactive
			props: {
				value: value,
				header: header,
				subheader: subheader,
				info: info,
				token: unit,
				type: type,
			},
			// Listen and react to events using callbacks. In this case we listen for
			// the "click" event emitted when clicking the toast button
			listeners: {},
		};

		// Render the toast and its contents
		toast(content, {
			position: POSITION.TOP_RIGHT,
			icon: false,
			closeOnClick: false,
			toastClassName: "modal-overlay",
			closeButton: false,
			hideProgressBar: true,
			timeout: 10000,
		});
	}

	return reactive({ showSuccessToast, showFailToast });
}
