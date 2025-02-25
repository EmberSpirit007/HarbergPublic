<template>
	<div class="positions-graph">
		<div class="chart-modal" :class="{ 'chart--fullscreen': fullscreenOpen }" @click="toggleFullscreen">
			<div class="chart-inner" @click.stop>
				<div class="chart--header">
					<div class="chart--actions" v-if="props.positions?.length > 0">
						<reset-zoom-button @click="resetZoom"></reset-zoom-button>
						<fullscreen-button v-if="isMobile" @click="toggleFullscreen"></fullscreen-button>
					</div>
				</div>

				<div
					class="chart--body"
					:class="{ 'disable-actions': props.positions?.length === 0, dark: props.dark }"
				>
					<canvas ref="Chart1"></canvas>
					<template v-if="props.positions?.length === 0">
						<p class="chart--no-positions">No positions</p>
					</template>
				</div>
			</div>
		</div>
		<div class="tooltipRef" ref="tooltipRef" :class="{ iAmOwner: activePosition?.iAmOwner }">
			<template v-if="activePosition?.iAmOwner">
				<p>Your staking position</p>
			</template>
			<template v-else>
				<p>Staking position</p>
			</template>
			<b>ID {{ activePosition?.id }}</b>
			<b>{{ activePosition?.amount }} $KRK</b>
			<b>Tax {{ activePosition?.taxRatePercentage }} %</b>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, shallowRef, computed } from "vue";
import {
	BarController,
	BarElement,
	CategoryScale,
	Chart,
	LineController,
	LineElement,
	LinearScale,
	PointElement,
	Tooltip,
} from "chart.js";
// import { Chart } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { useAccount } from "@wagmi/vue";
import { useMobile } from "@/composables/useMobile";
import type { Position } from "@/composables/usePositions";
import FullscreenButton from "@/components/chart/FullscreenButton.vue";
import ResetZoomButton from "@/components/chart/ResetZoomButton.vue";
Chart.register(
	zoomPlugin,
	LinearScale,
	CategoryScale,
	BarController,
	BarElement,
	LineController,
	LineElement,
	PointElement,
	Tooltip
);

interface Props {
	positions: Array<Position>;
	snatchedPositions: Array<string>;
	dark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	dark: false,
});

const Chart1 = ref();
const fullscreenOpen = ref(false);
const myChart = ref();
const activePosition = ref();
const tooltipRef = ref();
const positionSnatched = ref();

const account = useAccount();
const isMobile = useMobile();

function resetZoom() {
	console.log("resetZoom", { Chart1, myChart });
	myChart.value.value.resetZoom();
}

function toggleFullscreen() {
	if (fullscreenOpen.value) {
		document.body.style.position = "unset";
		document.body.style.overflow = "unset";
	} else {
		document.body.style.overflow = "hidden";
		document.body.style.position = "relative";
	}
	fullscreenOpen.value = !fullscreenOpen.value;
	window.scrollTo(0, 0);
}

watch(
	() => props.positions,
	(newData) => {
		myChart.value.value.destroy();
		renderChart(props.positions);

		// myChart.value.value.update();
		// myChart.value.datasets[0].bars[0].fillColor = "green"; //bar 1
	},
	{
		deep: true,
	}
);

watch(
	() => props.dark,
	(newData) => {
		myChart.value.value.destroy();
		renderChart(props.positions);

		// myChart.value.value.update();
		// myChart.value.datasets[0].bars[0].fillColor = "green"; //bar 1
	}
);

watch(
	() => props.snatchedPositions,
	(newData) => {
		// myChart.value.value.destroy();
		// renderChart(props.positions);
		let positionIndex = 0;
		if (myChart.value.value.data?.datasets[0]) {
			let backgroundColorArray = myChart.value.value.data.datasets[0].backgroundColor;

			for (let index = 0; index < backgroundColorArray.length; index++) {
				const position: Position = myChart.value.value.data.datasets[0].data[index];
				if (!position) {
					continue;
				}

				if (!position.iAmOwner) {
					positionIndex++;
				}
				if (positionIndex <= props.snatchedPositions.length && props.snatchedPositions.includes(position.id)) {
					backgroundColorArray[index] = "##7550AE";
				} else {
					backgroundColorArray[index] = "##7550AE";
					// const position = myChart.value.value.data.datasets[0].data[index];
					if (position.iAmOwner) {
						backgroundColorArray[index] = "#7550AE";
					} else if (props.dark) {
						backgroundColorArray[index] = "white";
					} else {
						backgroundColorArray[index] = "black";
					}
				}
			}
			myChart.value.value.data.datasets[0].backgroundColor = backgroundColorArray;

			myChart.value.value.ctx.save();
			myChart.value.value.update();
		}
	},
	{
		deep: true,
	}
);

const externalTooltipHandler = (context: any) => {
	const { chart, tooltip } = context;
	const tooltipEl = tooltipRef.value;

	// Tooltip ausblenden, wenn keine Daten angezeigt werden sollen
	if (!tooltip.opacity) {
		tooltipEl.style.opacity = "0";
		tooltipEl.style.display = "none";
		return;
	}

	// Aktive Position setzen (Daten des angezeigten Punktes)
	activePosition.value = tooltip.dataPoints[0].element.$context.raw;

	// Positionierung des Tooltips
	const { offsetLeft: chartX, offsetTop: chartY } = chart.canvas;

	// Tooltip anpassen
	tooltipEl.style.opacity = "1";
	tooltipEl.style.display = "flex";
	tooltipEl.style.position = "absolute";

	// Tooltip mittig über dem Punkt platzieren
	tooltipEl.style.left = `${chartX + tooltip.caretX}px`;
	tooltipEl.style.top = `${chartY + tooltip.y}px`;

	// Tooltip für saubere Mitte ausrichten
	tooltipEl.style.transform = "translateX(-50%)";
	tooltipEl.style.pointerEvents = "none";
};

function renderChart(data: any) {
	console.log("renderChart");

	const backgroundColors = [];
	const data1 = data.map((obj: any) => {
		return {
			...obj,
			// taxRatePercentage: obj.taxRate * 100,
			iAmOwner: obj.owner?.toLowerCase() === account.address.value?.toLowerCase(),
		};
	});
	console.log("data1", data1);

	for (let index = 0; index < data1.length; index++) {
		const position = data1[index];

		// if(index < props.snatchedPositions){
		// 	backgroundColors.push("rgba(26,84,244, 0.5)");
		//     positionSnatched.value = index;

		// }
		if (position.iAmOwner) {
			backgroundColors.push("rgba(117,80,174, 0.8)");
		} else if (props.dark) {
			backgroundColors[index] = "white";
		} else {
			backgroundColors[index] = "black";
		}
	}

	console.log("backgroundColors", backgroundColors);

	myChart.value = shallowRef(
		new Chart(Chart1.value, {
			type: "bar",
			data: {
				labels: data1.map((row: any) => row.id),
				datasets: [
					{
						type: "line",
						label: "TaxRate",
						data: data1,
						backgroundColor: ["#7550AE"],
						borderColor: ["#7550AE"],
						yAxisID: "y",
						parsing: {
							yAxisKey: "taxRatePercentage",
							xAxisKey: "id",
						},
					},
					{
						type: "bar",
						label: "Amount",
						data: data1,
						backgroundColor: backgroundColors,
						yAxisID: "y1",
						parsing: {
							yAxisKey: "amount",
							xAxisKey: "id",
						},
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: {
					duration: 1,
				},
				interaction: {
					intersect: false,
					mode: "index",
				},
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						enabled: false,
						position: "nearest",
						external: externalTooltipHandler,
					},
					zoom: {
						pan: {
							enabled: true,
							mode: "xy",
						},
						limits: {
							y: { min: 0 },
						},
						zoom: {
							wheel: {
								enabled: true,
							},
							pinch: {
								enabled: true,
							},
							mode: "xy",
							onZoomComplete(object: any) {
								// This update is needed to display up to date zoom level in the title.
								// Without this, previous zoom level is displayed.
								// The reason is: title uses the same beforeUpdate hook, and is evaluated before zoom.
								object.chart.update("none");
							},
						},
					},
				},
				scales: {
					y: {
						// type: "linear",
						display: true,
						position: "left",
						max: Math.max(...data.map((o: any) => o.taxRate)) * 100 * 1.5,
						// min: 0,
						title: {
							display: true,
							text: "Tax",
							color: "#7550AE",
							font: {
								size: 16, // Hier die Schriftgröße ändern (z. B. 16px)
								weight: "bold", // Falls du den Text fett machen möchtest
							},
						},
					},
					y1: {
						// type: "linear",
						display: true,
						position: "right",
						max: Math.max(...data.map((o: any) => o.amount)) * 1.5,
						title: {
							display: true,
							text: "Slots",
							color: "white",
							font: {
								size: 16, // Hier die Schriftgröße ändern (z. B. 16px)
								weight: "bold", // Falls du den Text fett machen möchtest
							},
						},
						grid: {
							display: false,
						},
						// min: 0,
					},
					x: {
						display: true,
						ticks: {
							display: false,
						},
						grid: {
							display: false,
						},
						title: {
							display: true,
							text: "Positions",
							color: "white",
							font: {
								size: 16, // Hier die Schriftgröße ändern (z. B. 16px)
								weight: "bold", // Falls du den Text fett machen möchtest
							},
						},
					},
				},
			},
			plugins: [],
		} as any)
	);
}
onMounted(() => {
	renderChart(props.positions);
});
</script>

<style lang="sass">
$margin: 72px
.positions-graph
    width: 100%
    .tooltipRef
        position: absolute
        background-color: rgba(133, 133, 133, 1)
        padding: 8px
        border-radius: 12px
        display: flex
        flex-direction: column
        opacity: 0
        display: none
        pointer-events: none
        z-index: 20
        color: white
        &.iAmOwner
            background-color: var(--color-based-blue)

.chart-modal
    &.chart--fullscreen
        background-color: rgba(0, 0, 0, 0.32)
        position: absolute
        top: 0
        height: 100vh
        width: 100%
        left: 0
        overflow: hidden
        z-index: 11
        .chart-inner
            background-color: var(--color-card-bg)
            height: auto
            display: flex
            flex-direction: column
            transition: all 200ms ease-in-out
            @media (min-width: 992px)
                //height: calc( 100% - $margin*2)
                width: 90%
                margin: auto
                min-height: 100%
                //margin: $margin
            .chart--body
                flex: 1 1 auto
                height: 100%
                canvas
                    height: auto
    .chart-inner
        .chart--header
            flex: 0 0 50px
            color: red
            padding: 8px
            display: flex
            .chart--actions
                gap: 12px
                margin-left: auto
                display: flex
        .chart--body
            height: 300px !important
            position: relative
            &.disable-actions
                pointer-events: none
                &::before
                    content: ''
                    position: absolute
                    top: 0
                    left: 0
                    width: 100%
                    height: 100%
                    background-color: rgba(255, 255, 255, 0.5)
                    z-index: 1

                &.dark
                    &::before
                        background-color: rgba(0, 0, 0, 0.5)
            .chart--no-positions
                color: var(--color-font)
                font-size: 30px
                margin: auto
                padding: 16px
                text-align: center
                position: absolute
                left: 50%
                top: 50%
                transform: translate(-50%, -50%)
                z-index: 2 /* Ensure this is above the background overlay */
</style>
