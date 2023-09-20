class Edge {
    constructor(weight, line) {
        this.weight = weight
        this.line = line
    }
}

class Station {
    constructor(id, line) {
        this.id = id
        this.line = line
    }
}

export class TubeMap {
    constructor(size) {
        this.matrix = []
        this.stationId = {}
        this.stationArr = []
        this.currId = 0
        this.size = size

        for (let i = 0; i <= size; i++) {
            let row = []
            for (let j = 0; j <= size; j++) {
                row.push(0)
            }

            this.matrix.push(row)
        }
        
    }

    addStation(station1, station2, line) {
        if (!(station1 in this.stationId)) {
            this.stationId[station1] = this.currId
            this.stationArr.push(station1)
            this.currId++
        }

        if (!(station2 in this.stationId)) {
            this.stationId[station2] = this.currId
            this.stationArr.push(station2)
            this.currId++
        }

        let station1Id = this.stationId[station1]
        let station2Id = this.stationId[station2]

        this.matrix[station1Id][station2Id] = new Edge(1, line)
    }

    routeCost(route) {
        let changes = 1
        let weight = 0
        let prevLine = ""

        for (let station of route) {
            if (prevLine) {
                changes += station.line != prevLine ? 1 : 0
                prevLine = station.line
            }else {
                prevLine = station.line
            }

            weight += 1
        }
        
        return changes * weight
    }

    findRouteWithIdBFS(station1, station2) {
        if (this.matrix[station1][station2]) {
            let edge = this.matrix[station1][station2]
            let line = edge.line

            return [new Station(station1, line), new Station(station2, line)]
        }

        let minRoute = 0
        let finalRoute = []
        let routes = []
        for (let i = 0; i <= this.size; i++) {
            if (this.matrix[station1][i] != 0) {
                let route = []

                if (this.visited[station1][i] == 0) {
                    this.visited[station1][i] = 1
                    route = this.findRouteWithId(i, station2)
                }else {
                    route = this.cache[station1][i]
                }

                if (route.length) {
                    this.cache[station1][i] = route

                    let edge = this.matrix[station1][i]
                    let line = edge.line

                    let thisRoute = [new Station(station1, line), ...route]
                    routes.push(thisRoute)
                    let routeCost = this.routeCost(thisRoute)

                    if (minRoute == 0 || routeCost < minRoute) {
                        finalRoute = thisRoute
                        minRoute = routeCost
                    }
                }
            }
        }

        return finalRoute
    }

    findRouteWithId(station1, station2) {
        let visited = []

        for (let i = 0; i <= this.size; i++) {
            let row = []
            for (let j = 0; j <= this.size; j++) {
                row.push(0)
            }

            visited.push(row)
        }


        let routes = new Array(this.size)
        routes.fill([])

        let queue = [station1]
        routes[station1] = [new Station(station1, "")]

        while (queue.length > 0) {
            let currentStation = queue[0]
            queue = queue.slice(1)

            for (let i = 0; i <= this.size; i++) {
                let edge = this.matrix[currentStation][i]

                if (edge && visited[currentStation][i] == 0) {
                    let route = routes[currentStation].map((station) => new Station(station.id, station.line))
                    route[route.length - 1].line = edge.line
                    route.push(new Station(i, edge.line))

                    if (routes[i].length) {
                        let newRouteCost = this.routeCost(route)
                        let existingRouteCost = this.routeCost(routes[i])

                        if (newRouteCost < existingRouteCost) routes[i] = route
                    }else {
                        routes[i] = route
                    }

                    visited[currentStation][i] = 1
                    queue.push(i)
                }
            }
        }

        
        return routes[station2]
    }

    findRoute(station1, station2) {
        let station1Id = this.stationId[station1]
        let station2Id = this.stationId[station2]

        let route = this.findRouteWithId(station1Id, station2Id)

        return route
    }

    getStationName(id) {
        return this.stationArr[id]
    }

    getStationId(station) {
        return this.stationId[station]
    }

    stringify(route) {
        return route.map((station) => {
            return `${station.line} : ${this.stationArr[station.id]}`
        })
    }
}