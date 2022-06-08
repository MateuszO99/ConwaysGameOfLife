let l
let fieldsTable
let cellsList
let numberOfMoves

let aliveCellsList = []
let p0Values = []
let isBoardGenerated = false
let isEnable = false

let boardSize = document.getElementById("board-size")
let p0Element = document.getElementById("p0")
let movesNumber = document.getElementById("moves-number")
let movesDelay = document.getElementById("moves-delay")
let drawPlot = document.getElementById("draw-plot")

function setDefaultValues() {
    boardSize.defaultValue = 100
    p0Element.defaultValue = 0.5
    movesNumber.defaultValue = 1000
    movesDelay.defaultValue = 25
}

setDefaultValues()

function setP0() {
    if (0 < p0Element.value && p0Element.value < 1) {
        return p0Element.value
    } else {
        p0Element.value = 0.5
        return 0.5
    }
}

function checkCell(i, j) {
    let countAlive = 0

    if (i - 1 >= 0 && j - 1 >= 0 && fieldsTable[i-1][j-1].className === "aliveCell") {
        countAlive++
    }
    if (i + 1 < l && j - 1 >= 0 && fieldsTable[i+1][j-1].className === "aliveCell") {
        countAlive++
    }
    if (i - 1 >= 0 && j + 1 < l && fieldsTable[i-1][j+1].className === "aliveCell") {
        countAlive++
    }
    if (i + 1 < l && j + 1 < l && fieldsTable[i+1][j+1].className === "aliveCell") {
        countAlive++
    }
    if (j - 1 >= 0 && fieldsTable[i][j-1].className === "aliveCell") {
        countAlive++
    }
    if (j + 1 < l && fieldsTable[i][j+1].className === "aliveCell") {
        countAlive++
    }
    if (i - 1 >= 0 && fieldsTable[i-1][j].className === "aliveCell") {
        countAlive++
    }
    if (i + 1 < l && fieldsTable[i+1][j].className === "aliveCell") {
        countAlive++
    }
    return countAlive
}

function nextMove() {
    let isAliveTableRow
    let countAlive
    let isAliveTable = []
    let aliveCells = 0

    for (let i = 0; i < l; i++) {
        isAliveTableRow = []
        for (let j = 0; j < l; j++) {
            countAlive = checkCell(i, j)
            if (countAlive < 2){
                isAliveTableRow.push(false)
            } else if (countAlive === 2) {
                if (fieldsTable[i][j].className === "aliveCell") {
                    isAliveTableRow.push(true)
                } else {
                    isAliveTableRow.push(false)
                }
            } else if (countAlive === 3) {
                isAliveTableRow.push(true)
            } else {
                isAliveTableRow.push(false)
            }
        }
        isAliveTable.push(isAliveTableRow)
    }

    for (let i = 0; i < l; i++) {
        for (let j = 0; j < l; j++) {
            if (isAliveTable[i][j]) {
                fieldsTable[i][j].className = "aliveCell"
                aliveCells++
            } else {
                fieldsTable[i][j].className = "deadCell"
            }
        }
    }
    cellsList.push(aliveCells)
    numberOfMoves++
}

function renderBoard() {
    if (!isEnable){
        let fieldsRow
        let p0 = setP0()
        let fieldId = 0
        let aliveCells = 0
        let boardElement = document.getElementById("board")
        boardElement.innerHTML = ""

        cellsList = []
        fieldsTable = []
        l = boardSize.value
        isBoardGenerated = true
        numberOfMoves = 0

        for (let i = 0; i < l; i++) {
            const tr = boardElement.insertRow()
            fieldsRow = []
            for (let j = 0; j < l; j++) {
                const td = tr.insertCell()
                const id = "field" + fieldId
                td.id = id
                if (Math.random() < p0) {
                    td.className = "aliveCell"
                    aliveCells++
                } else {
                    td.className = "deadCell"
                }
                fieldsRow.push(document.getElementById(id))
                fieldId++
            }
            fieldsTable.push(fieldsRow)
        }
        cellsList.push(aliveCells)
    }
}

function makeMoves() {
    if (isBoardGenerated && !isEnable) {
        isEnable = true
        for (let i = 1; i <= movesNumber.value; i++) {
            setTimeout(nextMove, i * movesDelay.value)
        }
        setTimeout(() => {
            isEnable = false
            aliveCellsList.push(cellsList)
            p0Values.push(p0Element.value)
            }, movesNumber.value * movesDelay.value)
    }
}

drawPlot.addEventListener("click", () => {
    if (isBoardGenerated && !isEnable) {
        let moves = []
        for (let i = 0; i <= numberOfMoves; i++){
            moves.push(i)
        }

        for (let i = 0; i < aliveCellsList.length; i++) {
            for (let j = 0; j < aliveCellsList[i].length; j++) {
                aliveCellsList[i][j] /= (l * l)
            }
        }

        console.log(p0Values)
        let data = []
        for (let i = 0; i < aliveCellsList.length; i++){
            data.push({x: moves, y: aliveCellsList[i], name: "p0 = " + p0Values[i], type: 'scatter'})
        }
        Plotly.purge("plot");
        Plotly.newPlot("plot", data)
    }
})
