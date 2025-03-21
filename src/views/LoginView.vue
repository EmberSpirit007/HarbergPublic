<template>
	<div class="login-wrapper">
		<div class="left">
			<div class="left-overlay">
				<div class="login-dialog">
					<h1>Enter Staking</h1>
                     <div class="error-box" v-if="error">
                        {{ error }}
                     </div>
					<f-input type="password" @input="error = ''" v-model="inputPassword" label="Password" @keyup.enter="login"></f-input>
					<f-button size="large" @click="login">Login</f-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import FButton from "@/components/fcomponents/FButton.vue";
import FInput from "@/components/fcomponents/FInput.vue";
import { onMounted, ref } from "vue";
import {useRouter} from "vue-router"
const router = useRouter();

const error = ref("")
const passwords = ref(["lobsterDao", "test123", "lobster-x010syqe?412!"]);
const inputPassword = ref("")
function login(){
    if(passwords.value.includes(inputPassword.value)){
        localStorage.setItem('authentificated', "true");
        router.push("/")
        return true;
    } else {
        error.value = "wrong password"
        // Token nach erfolgreichem Login speichern
        // Beim Logout Token entfernen
        return false;
    }
}

onMounted(() => {
    if(localStorage.getItem('authentificated') === "true"){
        router.push("/")
    }
})
</script>

<style lang="sass">
.error-box
    border: 1px solid red
    border-radius: 12px
    background-color: rgba(245, 108, 108, 0.5)
    color: black
    padding: 12px
.login-wrapper
    display: flex
    flex-direction: row

    >div
        height: 100vh
        padding: 48px
    .left
        /* src/assets/styles.css */
        background-image: url('@/assets/img/header-image.png')
        background-size: cover
        background-position: center
        background-repeat: no-repeat
        position: relative
        flex: 1 1 100%
        .left-overlay
            background-color: rgba(7, 17, 27, 0.9)
            top: 0
            left: 0
            position: absolute
            width: 100%
            height: 100%
            display: flex
            align-items: center
            justify-content: center
            .login-dialog
                background-color: rgba(15, 15, 15, 0.5)
                display: flex
                flex-direction: column
                gap: 16px
                text-align: center
                padding: 48px
                border-radius: 24px
                box-shadow: 0 1px 6px 0 grey
</style>
