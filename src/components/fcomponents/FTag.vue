<template>
	<div class="f-tag">
		<slot></slot>
	</div>
</template>

<style lang="sass">
.f-tag
    border: 1px solid var(--color-font)
    border-radius: var(--border-radius, 12px)
    padding: 2px 16px
    font-size: 12px
    display: inline
</style>
