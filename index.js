import { words } from "./data/words.js";

let selectedWord = ""
let actualWord = ""
let remaniningLives = 0
const PRESSEDKEYS = []
const KEYS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]


function renderForcaGame() {
    const min = 0
    const max = words.length
    const randomNum = parseInt(Math.random() * (max - min) + min)
    const { category, word } = words[randomNum]

    const categoryEl = document.querySelector('#category')
    categoryEl.textContent = category.toUpperCase()

    const wordEl = document.querySelector("#word")

    for (let i = 0; i < word.length; i++) {
        let letter = document.createElement("p")
        letter.className = "letter"
        letter.id = `letter-${i + 1}`
        wordEl.append(letter)
    }

    drawForca()
    selectedWord = word
    actualWord = "-".repeat(selectedWord.length)
}

function drawForca() {
    const canvas = document.querySelector("#forca")
    const ctx = canvas.getContext("2d")

    ctx.beginPath()
    ctx.moveTo(10, 190)
    ctx.lineTo(40, 190)
    ctx.quadraticCurveTo(50, 185, 40, 180)
    ctx.lineTo(30, 180)
    ctx.lineTo(30, 50)
    ctx.lineTo(120, 50)
    ctx.quadraticCurveTo(130, 45, 120, 40)
    ctx.lineTo(10, 40)
    ctx.quadraticCurveTo(0, 45, 10, 50)
    ctx.lineTo(20, 50)
    ctx.lineTo(20, 180)
    ctx.lineTo(10, 180)
    ctx.quadraticCurveTo(0, 185, 10, 190)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(30, 70)
    ctx.lineTo(50, 50)
    ctx.lineTo(60, 50)
    ctx.lineTo(30, 80)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(100, 50)
    ctx.lineTo(100, 70)
    ctx.lineTo(110, 70)
    ctx.lineTo(110, 50)
    ctx.fill()

    ctx.beginPath();
    ctx.ellipse(105, 85, 10, 13, 0, 0, 2 * Math.PI)
    ctx.lineWidth = 6
    ctx.stroke();
    ctx.closePath()

}

function renderKeyboard() {

    const keyboardEl = document.querySelector(".keyboard")

    for (let i = 0; i < 3; i++) {
        const row = document.createElement("div")
        row.className = "keyboard-row"
        for (let g = 0; g < KEYS[i].length; g++) {
            let key = document.createElement("button")
            key.className = "key"
            key.value = KEYS[i][g]
            key.id = `key-${KEYS[i][g]}`
            key.textContent = KEYS[i][g]
            row.appendChild(key)
        }
        keyboardEl.appendChild(row)
    }

    let keyboardkeys = document.querySelectorAll(".key")

    for (let el of keyboardkeys) {
        el.addEventListener("click", (event) => {
            handleKeyPressed(event.target.value)
        })
    }

}

function updateForca() {
    console.info(`Você tem ${remaniningLives} vidas`)
    const canvas = document.querySelector("#forca")
    const ctx = canvas.getContext("2d")
    switch (remaniningLives) {
        case 5: 
            ctx.beginPath()
            ctx.arc(105, 87, 10, 0, 2 * Math.PI)
            ctx.fill();
            break
        case 4:
            ctx.beginPath()
            ctx.moveTo(102, 87)
            ctx.lineTo(102, 135)
            ctx.quadraticCurveTo(105, 138, 108, 135)
            ctx.lineTo(108, 87)
            ctx.fill();
            break
        case 3:
            ctx.beginPath()
            ctx.moveTo(102, 105)
            ctx.lineTo(102, 111)
            ctx.lineTo(80, 102)
            ctx.quadraticCurveTo(78, 100, 82, 96)
            ctx.fill();
            break
        case 2:
            ctx.beginPath()
            ctx.moveTo(108, 105)
            ctx.lineTo(108, 111)
            ctx.lineTo(128, 102)
            ctx.quadraticCurveTo(132, 100, 130, 96)
            ctx.fill();
            break
        case 1:
            ctx.beginPath()
            ctx.moveTo(102, 133)
            ctx.lineTo(90, 160)
            ctx.quadraticCurveTo(93, 164, 96, 160)
            ctx.lineTo(108, 133)
            ctx.fill();
            break
        case 0:
            ctx.beginPath()
            ctx.moveTo(102, 133)
            ctx.lineTo(114, 160)
            ctx.quadraticCurveTo(117, 164, 120, 160)
            ctx.lineTo(108, 133)
            ctx.fill();
            break
    }
}

function handleIncorrectKey() {
    remaniningLives -= 1
    updateForca()
}

function verifyKeyPressed(key) {
    if (PRESSEDKEYS.indexOf(key) == -1) {
        PRESSEDKEYS.push(key)
        if (selectedWord.includes(key)) {
            console.info(`A palavra contém a letra ${key}.`)
            updateForcaWord(key)
            return true
        } else {
            console.info(`A palavra não contém a letra ${key}.`)
            handleIncorrectKey()
            return false
        }
    }
    else {
        console.info(`A letra ${key} já foi escolhida.`)
    }
}

function updateForcaWord(key) {
    let list = searchForKeyOnForcaWord(key)
    for (let ind of list) {
        let letterEl = document.querySelector(`#letter-${ind + 1}`)
        letterEl.textContent = selectedWord[ind]
    }
    if (isGameOver()) {
        handleGameOver()
    }
    else if(isGameDefeated()){
        handleGameDefeated()
    }
}

function searchForKeyOnForcaWord(key) {
    let x = 0
    let list = []
    let lenSelectedWord = selectedWord.length
    while (x < lenSelectedWord - 1) {
        let keyFirstOccurrence = selectedWord.indexOf(key, x)
        if (keyFirstOccurrence === -1) {
            break
        }
        list.push(keyFirstOccurrence)
        actualWord = actualWord.substring(0, keyFirstOccurrence) + key + actualWord.substring(keyFirstOccurrence + 1)
        x = keyFirstOccurrence + 1
    }
    return list
}

function handleButtonBehavior(key, behavior) {
    let keyEl = document.querySelector(`#key-${key}`)
    keyEl.className += ` ${behavior ? 'correct' : 'incorrect'}`
    keyEl.setAttribute('disabled', 'disabled')
}

function isGameOver() {
    return remaniningLives === 0 ? true : false
}

function isGameDefeated(){
    return actualWord === selectedWord ? true : false
}

function handleKeyPressed(key) {
   
    const upperCaseKey = key.toUpperCase()
    let behavior = verifyKeyPressed(upperCaseKey)
    handleButtonBehavior(upperCaseKey, behavior)

    if (isGameOver()) {
        handleGameOver()
    }
    else if (isGameOver()) {
        handleGameOver()
    }
}

function disableKeyboard() {
    let keyboard = document.querySelector(`.keyboard`)
    for (let row of keyboard.childNodes) {
        for (let key of row.childNodes) {
            key.setAttribute('disabled', 'disabled')
        }
    }

}

function handleGameOver() {
    window.alert("Game Over")
    disableKeyboard()
}

function handleGameDefeated(){
    window.alert("Você venceu! Parabéns.")
    disableKeyboard()
}

window.addEventListener("load", () => {
    renderForcaGame()
    renderKeyboard()
    remaniningLives = 6
})

window.addEventListener("keypress", (event) => {
    handleKeyPressed(event.key)
})