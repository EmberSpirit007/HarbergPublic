import { ref, onMounted, onUnmounted } from "vue";

// by convention, composable function names start with "use"
export function useMobile() {
	const isMobile = ref<boolean>(false);

	const handleWindowSizeChange = () => {
		isMobile.value = isMobileFunc();
	};

	isMobile.value = isMobileFunc();
	function isMobileFunc() {
		if (screen.width <= 768) {
			return true;
		} else {
			return false;
		}
	}

	onMounted(async () => {
		window.addEventListener("resize", handleWindowSizeChange);
		handleWindowSizeChange();
	});

	onUnmounted(() => {
		window.removeEventListener("resize", handleWindowSizeChange);
	});

	return isMobile;
}
