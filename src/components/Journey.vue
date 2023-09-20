<script setup>
import { ref } from 'vue'
import {getStationCoord, getLineColor} from "../scripts/mapSetup.js"

const { map, stations, lineInfo } = defineProps(["map", "stations","lineInfo"])
let start = ref("")
let destination = ref("")
let routeArr = ref([])
let currentStation = ref({})
let prevStation = {}
let viewBox = ref("")

let width = window.innerWidth * 0.8
let height = window.innerHeight * 0.95


function findRoute() {
    let route = map.findRoute(start.value, destination.value)
    routeArr.value = route
    console.log(map.stringify(route))
    resetViewPort()
}

function drawRouteData() {
    let route = routeArr.value

    let drawData = []
    let prevCoords = []
    let prevColor = ""

    for (let station of route) {
        let stationName = map.getStationName(station.id)
        let stationCoords = getStationCoord(stationName)
        let line = station.line
        let color = getLineColor(line)

        drawData.push({
            color: color,
            prevColor: prevColor,
            name: stationName,
            coords: stationCoords,
            prevCoords: prevCoords
        })

        prevCoords = stationCoords
        prevColor = color
    }

    return drawData
}

function resetPath() {
    routeArr.value = ""
    start.value = ""
    destination.value = ""
}

function setCurrentStation(station) {
    currentStation.value = station
    let x = (width / 360) * (180 + station.coords[0])
    let y = (height / 180) * (90 - station.coords[1])

    
    let viewPortSize = 300
    let minX = x-(viewPortSize / 2)
    let minY = y-(viewPortSize / 2)

    viewBox.value = `${minX} ${minY} ${viewPortSize} ${viewPortSize}`
}

function resetViewPort() {
    currentStation.value = {}
    viewBox.value = `0 0 ${width} ${height}`
}


function arrayEqual(a, b) {
    if (!a || !b) return false
    if (a.length != b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false
    }

    return true
}

console.log(lineInfo)

</script>

<template>
    <div id="form"> 
        <label for="">Start </label>
        <input type="text" v-model="start">
        <br>
        <label for="">Destination </label>
        <input type="text" v-model="destination">
        <br>
        <button @click="findRoute()">Find Route</button>
        <button @click="resetPath()" :disabled="routeArr.length == 0">Reset</button>
        <p>{{ currentStation.name }}</p>
    </div>
    
    <svg :width="width" :height="height" :viewBox="viewBox">
        <g v-for="line in Object.keys(lineInfo)">
            <g v-for="station in lineInfo[line]">
                <line v-if="station.prevCoords.length" :x1="(width / 360) * (180 + station.prevCoords[0])" :y1="(height / 180) * (90 - station.prevCoords[1])" :x2="(width / 360) * (180 + station.coords[0])" :y2="(height / 180) * (90 - station.coords[1])" :style="'stroke:lightgrey;stroke-width:2'" />
            </g>
        </g>
        <g v-for="line in Object.keys(lineInfo)"  v-if="routeArr.length == 0">
            <g v-for="station in lineInfo[line]">
                <circle @click="setCurrentStation(station)" r="5" :cx="(width / 360) * (180 + station.coords[0])" :cy="(height / 180) * (90 - station.coords[1])" :style="'fill:' + station['color']"></circle>
                <circle @click="resetViewPort()" v-if="arrayEqual(currentStation.coords, station.coords)" r="5" :cx="(width / 360) * (180 + station.coords[0])" :cy="(height / 180) * (90 - station.coords[1])" :style="'fill:' + station['color']">
                    <animate attributeName="opacity" values="1;0.5;0;" dur="1s" begin="0s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="5;15" dur="1s" begin="0s" repeatCount="indefinite"/>
                </circle>
                <line v-if="station.prevCoords.length" :x1="(width / 360) * (180 + station.prevCoords[0])" :y1="(height / 180) * (90 - station.prevCoords[1])" :x2="(width / 360) * (180 + station.coords[0])" :y2="(height / 180) * (90 - station.coords[1])" :style="'stroke:'+ station['color'] +';stroke-width:2'" />   
                <text v-if="arrayEqual(currentStation.coords, station.coords)" :x="(width / 360) * (180 + station.coords[0])" :y="(height / 180) * (90 - station.coords[1]) - 20">{{ station.name }}</text>
            </g>
        </g>
        <g v-for="station in drawRouteData()">
            <circle @click="setCurrentStation(station)" r="5" :cx="(width / 360) * (180 + station.coords[0])" :cy="(height / 180) * (90 - station.coords[1])" :style="'fill:' + station['color']"></circle>
            <circle @click="resetViewPort()" v-if="arrayEqual(currentStation.coords, station.coords)" r="5" :cx="(width / 360) * (180 + station.coords[0])" :cy="(height / 180) * (90 - station.coords[1])" :style="'fill:' + station['color']">
                <animate attributeName="opacity" values="1;0.5;0;" dur="1s" begin="0s" repeatCount="indefinite"/>
                <animate attributeName="r" values="5;15" dur="1s" begin="0s" repeatCount="indefinite"/>
            </circle>
            <line v-if="station.prevCoords.length" :x1="(width / 360) * (180 + station.prevCoords[0])" :y1="(height / 180) * (90 - station.prevCoords[1])" :x2="(width / 360) * (180 + station.coords[0])" :y2="(height / 180) * (90 - station.coords[1])" :style="'stroke:'+ station['prevColor'] +';stroke-width:2'">
                <animate attributeName="opacity" values="1;0.5;0;0.5;1" dur="2s" begin="0s" repeatCount="indefinite"/>
            </line>
        </g>
    </svg>
</template>

<style scoped>
* {
  font-family: Arial;
}

#form {
    float: left
}

svg {
    border: 1px solid black;
}
</style>
