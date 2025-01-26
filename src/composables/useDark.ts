

import { ref, onMounted, watch } from 'vue'
// by convention, composable function names start with "use"
const darkTheme = ref(false)
export function useDark() {
    onMounted(() => {
        if(localStorage.getItem("theme") === "dark") {
            document.documentElement.classList.add("dark")
            darkTheme.value = true
        } else {
            darkTheme.value = false
        }

    })

    watch(
        () => darkTheme.value,
        (newData) => {
		    document.documentElement.removeAttribute("data-theme");
            localStorage.removeItem("theme")
            if (newData) {
                // import('@/assets/sass/elementplus-dark.scss');
                document.documentElement.classList.add("dark")
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
            } else {
                // import('@/assets/sass/elementplus-light.scss');

                document.documentElement.classList.remove("dark")
			    document.documentElement.setAttribute("data-theme", "default");
                localStorage.setItem("theme", "default");
            }
        }
    );

  return { darkTheme }
}
