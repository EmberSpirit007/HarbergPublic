<template>
	<div>
		<div class="flex123">
			<div class="disabled-slider" :style="{ 'flex-basis': minPercentage + '%' }">
				<div class="dot"></div>
			</div>
			<div class="range-slider">
				<input
					class="range-slider__range"
					type="range"
					ref="sliderInput"
					:style="{
						background: `linear-gradient(90deg, ${settings.fill} ${percentageDot}%, ${settings.background} ${percentageDot + 0.1}%)`,
					}"
					:value="props.modelValue"
					:min="props.min"
					:max="props.max"
					@input="updateModelValue"
				/>
				<div
					class="testbla"
					@mousemove="testMove"
					:style="{
						left: percentageDot + '%',
					}"
				></div>
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";

const sliderInput = ref();

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
	modelValue: number;
	min: number;
	max: number;
}>();

const minPercentage = computed(() => {
	if (!props.min || !props.max) {
		return 0n;
	}
	return (props.min * 100) / props.max;
});

function updateModelValue(event: any) {
	emit("update:modelValue", event.target.valueAsNumber);
}


const sliderValue = computed({
	// getter
	get() {
		return props.modelValue || props.min;
	},
	// setter
	set(newValue) {
		emit("update:modelValue", newValue);
	},
});

const percentageDot = computed(() => {
	return (100 * (sliderValue.value - props.min)) / (props.max - props.min);
});

const settings = {
	fill: "#1A54F4",
	background: "#000000",
};

onMounted(() => {
	sliderInput.value.addEventListener("input", setSliderValue);
});

function setSliderValue(event: any){
    sliderValue.value = event.target.value;
}

function testMove(event: any) {
	console.log("event", event);
}

onUnmounted(() => {
    console.log("sliderInput.value", sliderInput.value);
    if(sliderInput.value){
        sliderInput.value.removeEventListener("input", setSliderValue);
    }
})
</script>

<style lang="scss">
.flex123 {
	display: flex;
}
.testbla {
	position: absolute;
	height: 25px;
	width: 25px;
	background-color: var(--color-based-blue);
	user-select: none;
	top: 50%;
	transform: translate(-50%, -50%);
	right: 50%;
	border-radius: 25px;
	pointer-events: none;
	z-index: 10;
}
.disabled-slider {
	width: 60px;
	height: 7px;
	background-color: var(--color-border-main);
	/* margin-top: auto; */
	align-self: center;
	margin-top: 2px;
	position: relative;
	z-index: 3;
	pointer-events: none;
}
.dot {
	border-radius: 50px;
	height: 15px;
	width: 15px;
	background-color: var(--color-border-main);
	position: absolute;
	right: -14px;
	/* bottom: 50%; */
	top: 50%;
	transform: translate(-50%, -50%);
	pointer-events: none;
}
// Base Colors
$shade-10: #4682b4 !default;
$shade-1: #d7dcdf !default;
$shade-0: #fff !default;
$teal: #4682b4 !default;

// Range Slider
$range-width: 100% !default;

$range-handle-color: $shade-10 !default;
$range-handle-color-hover: $teal !default;
$range-handle-size: 15px !default;

$range-track-color: $shade-1 !default;
$range-track-height: 7px !default;

$range-label-color: $shade-10 !default;
$range-label-width: 60px !default;

.range-slider {
	width: $range-width;
	position: relative;
}

.range-slider__range {
	// width: calc(100% - (#{$range-label-width + 13px}));
	width: 100%;
	height: $range-track-height;
	border-radius: 5px;
	background: $range-track-color;
	outline: none;
	padding: 0;
	margin: 0;

	// Range Handle
	&::-webkit-slider-thumb {
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		cursor: pointer;
	}

	&:active::-webkit-slider-thumb {
		background: $range-handle-color-hover;
	}

	&::-moz-range-thumb {
		width: $range-handle-size;
		height: $range-handle-size;
		border: 0;
		border-radius: 50%;
		background: $range-handle-color;
		cursor: pointer;
		transition: background 0.15s ease-in-out;

		&:hover {
			background: $range-handle-color-hover;
		}
	}

	&:active::-moz-range-thumb {
		background: $range-handle-color-hover;
	}

	// Focus state
	&:focus {
		&::-webkit-slider-thumb {
			background-color: transparent;
		}
	}
}

// Range Label
.range-slider__value {
	display: inline-block;
	position: relative;
	width: $range-label-width;
	color: $shade-0;
	line-height: 20px;
	text-align: center;
	border-radius: 3px;
	background: $range-label-color;
	padding: 5px 10px;
	margin-left: 8px;

	&:after {
		position: absolute;
		top: 8px;
		left: -7px;
		width: 0;
		height: 0;
		border-top: 7px solid transparent;
		border-right: 7px solid $range-label-color;
		border-bottom: 7px solid transparent;
		content: "";
	}
}

// Firefox Overrides
::-moz-range-track {
	background: $range-track-color;
	border: 0;
}

input::-moz-focus-inner,
input::-moz-focus-outer {
	border: 0;
}
</style>
