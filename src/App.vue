<script setup>

import * as TM from "./scripts/tubeMap.js"
import * as MS from "./scripts/mapSetup.js"
import Journey from "./components/Journey.vue"

const map = new TM.TubeMap(MS.size)
MS.buildMap(map)

const stations = MS.getStations()
const lineInfo = MS.getLineInfo()

</script>

<template>
  <Journey :map="map" :stations="stations" :lineInfo="lineInfo"></Journey>
</template>

<style scoped>

</style>
