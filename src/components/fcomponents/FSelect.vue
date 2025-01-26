<template>
    <div class="o-select" @click="clickSelect" ref="componentRef">
        <f-input hide-details :clearable="props.clearable" :label="props.label" :selectedable="false"
             :focus="showList" :modelValue="`${year} % yearly`" readonly>
             <template #info v-if="slots.info">
                <slot name="info"></slot>
            </template>
            <template #suffix>
                <Icon class="toggle-collapse" v-if="showList" icon="mdi:chevron-down"></Icon>
                <Icon class="toggle-collapse" v-else icon="mdi:chevron-up"></Icon>
            </template>
        </f-input>
        <div class="select-list-wrapper" v-show="showList" ref="selectList" >
           <div class="select-list-inner" @click.stop>
            <div class="select-list-item" v-for="(item, index) in props.items" :key="item.year"  :class="{'active': year === item.year, 'hovered': activeIndex === index}"
                @click.stop="clickItem(item)" @mouseenter="mouseEnter($event, index)" @mouseleave="mouseLeave($event, index)">
                <div class="circle">
                    <div class="active" v-if="year === item.year"></div>
                    <div class="hovered" v-else-if="activeIndex === index"></div>
                </div>
                <div class="yearly">
                    <div class="value">{{ item.year }} %</div>
                    <div class="label">yearly</div>
                </div>
                <div class="daily">
                    <div class="value">{{ item.daily.toFixed(4) }} %</div>
                    <div class="label">daily</div>
                </div>
            </div>
           </div>
        </div>
    </div>
    <slot :style="[!props.editor ? {display: 'none'} : {}]"></slot>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance, type ComputedRef, useSlots } from "vue"
import FInput from "@/components/fcomponents/FInput.vue"
import useClickOutside from "@/composables/useClickOutside"
import {Icon} from "@iconify/vue";


const emit = defineEmits(['update:modelValue'])
const slots = useSlots();

interface Item {
    year: number;
    daily: number;
}

const props = defineProps({
    items: {
        type: [Array<Item>],
        required: false,
        default: []
    },
    clearable: {
        type: Boolean,
        required: false,
        default: false
    },
    itemTitle: {
        type: String,
        required: false,
        default: "label"
    },
    itemValue: {
        type: String,
        required: false,
        default: "value"
    },
    label: {
        type: String,
        required: false,
        default: null
    },
    modelValue: {
        type: Number,
        required: false,
        default: null
    },
    value: {
        type: String,
        required: false,
        default: null
    },
    editor: {
        type: Boolean,
        required: false,
        default: false
    }
});

const showList = ref(<boolean>false);
const slotElements = ref(<any[]>[])
const componentRef = ref(<any>null);
const selectList = ref();
const activeIndex= ref();

useClickOutside(componentRef, () => {
    
    showList.value = false
})


const year= computed({
  // getter
  get() {
    return props.modelValue || props.items[0].year
  },
  // setter
  set(newValue: number) {
    
    emit("update:modelValue", newValue)

  }
})

function mouseEnter(event:MouseEvent , index:number){
    const target = event. target as HTMLElement;
    activeIndex.value = index;
    target.classList.add("active")
}

function mouseLeave(event:MouseEvent, index:number){
    const elements = selectList.value.querySelectorAll('.select-list-item');
    elements.forEach((element:HTMLElement) => {
        element.classList.remove("active")
    });

}

onMounted(() => {
  
})





function clickSelect(event: any) {
    showList.value = !showList.value;
}


function clickItem(item: any) {
    console.log("item", item);
    year.value = item.year
    showList.value = false;
    console.log("showList.value", showList.value);
    // emit('input', item)
}





</script>


<style lang="sass">
.o-select
    position: relative
    display: inline-block
    .toggle-collapse
        color: black
        font-size: 20px
        &:active, &:focus, &:hover
            cursor: pointer
    .select-list-wrapper
        position: absolute
        box-shadow: 0 1px 6px 0 #20212447
        background-color: var(--color-card-bg)
        z-index: 10
        padding: 16px
        border-radius: 16px
        border: 1px solid black
        right: 0
        margin-top: 4px
        .select-list-inner
            height: 330px
            overflow-y: scroll
            display: grid
            .select-list-item
                display: grid
                grid-template-columns: 15px 110px 126px
                place-content: end
                margin-right: 8px
                -webkit-touch-callout: none
                -webkit-user-select: none
                -khtml-user-select: none
                -moz-user-select: none
                -ms-user-select: none
                user-select: none
                padding: 4px 0
                &:active, &:focus, &:hover
                    cursor: pointer
                .daily, .yearly
                    display: flex
                    gap: 4px
                    justify-content: end
                .daily
                    color: var(--color-grey)
                .circle
                    height: 14px
                    width: 14px
                    .active
                        height: 14px
                        width: 14px
                        background-color: var(--color-based-blue)
                        border-radius: 14px
                    .hovered
                        height: 14px
                        width: 14px
                        background-color: var(--color-based-blue)
                        opacity: .5
                        border-radius: 14px



.select-list-inner
  &::-webkit-scrollbar-track
    border-radius: 10px

  &::-webkit-scrollbar
    width: 5px

  &::-webkit-scrollbar-thumb
    border-radius: 10px
    background-color: lightgrey



</style>