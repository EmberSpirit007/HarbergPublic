<template>
	<div class="cube">
		<div class="side"></div>
		<div class="side"></div>
		<div class="side"></div>
		<div class="side"></div>
		<div class="side"></div>
		<div class="side"></div>
	</div>
</template>

<style lang="sass">
.cube
  margin: auto
  font-size: 24px
  height: 1em
  width: 1em
  position: relative
  transform: rotatex(30deg) rotatey(45deg)
  transform-style: preserve-3d
  animation: cube-spin 1.5s infinite ease-in-out alternate

.side
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  transform-style: preserve-3d

  &::before
    content: ""
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: currentcolor
    transform: translatez(0.5em)
    animation: cube-explode 1.5s infinite ease-in-out
    opacity: 0.5

  &:nth-child(1)
    transform: rotatey(90deg)

  &:nth-child(2)
    transform: rotatey(180deg)

  &:nth-child(3)
    transform: rotatey(270deg)

  &:nth-child(4)
    transform: rotatey(360deg)

  &:nth-child(5)
    transform: rotatex(90deg)

  &:nth-child(6)
    transform: rotatex(270deg)

@keyframes cube-spin
  0%
    transform: rotatex(30deg) rotatey(45deg)

  100%
    transform: rotatex(30deg) rotatey(405deg)

@keyframes cube-explode
  0%
    transform: translatez(0.5em)

  50%
    transform: translatez(0.75em)

  100%
    transform: translatez(0.5em)
</style>
