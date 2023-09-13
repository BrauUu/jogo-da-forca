import { words } from "./data/words.js";

let selectedWord = ""

function renderForca() {
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

    selectedWord = word
}

function renderKeyboard() {
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ]

    const keyboardEl = document.querySelector(".keyboard")

    for (let i = 0; i < 3; i++) {
        const row = document.createElement("div")
        row.className = "keyboard-row"
        for (let g = 0; g < keys[i].length; g++) {
            let key = document.createElement("button")
            key.className = "key"
            key.value = keys[i][g]
            key.id = `key-${keys[i][g]}`
            key.textContent = keys[i][g]
            row.appendChild(key)
        }
        keyboardEl.appendChild(row)
    }

    let keyboardkeys = document.querySelectorAll(".key")

    for (let el of keyboardkeys) {
        el.addEventListener("click", (event) => {
            virtualKeyboardKeyPress(event.target.value)
        })
    }

}

function verifyKeyPressed(key) {
    key = key.toUpperCase()
    if (selectedWord.includes(key)) {
        console.info(`A palavra contém a letra ${key}.`)
        updateWordUI(key)
        return true
    } else {
        console.info(`A palavra não contém a letra ${key}.`)
        return false
    }
}

function updateWordUI(key) {
    let list = searchForLetter(key)
    for (let ind of list) {
        let letterEl = document.querySelector(`#letter-${ind + 1}`)
        letterEl.textContent = selectedWord[ind]
    }
}

function searchForLetter(key) {
    let x = 0
    let list = []
    let lenSelectedWord = selectedWord.length
    while (x < lenSelectedWord - 1) {
        let keyFirstOccurrence = selectedWord.indexOf(key, x)
        if (keyFirstOccurrence === -1) {
            break
        }
        list.push(keyFirstOccurrence)
        x = keyFirstOccurrence + 1
    }
    return list
}

function virtualKeyboardKeyPress(key) {
    let behavior = verifyKeyPressed(key)
    handleButtonBehavior(key, behavior)
}

function handleButtonBehavior(key, behavior) {
    behavior = 'correct' ? behavior : 'incorrect'
    let keyEl = document.querySelector(`#key-${key}`)
    keyEl.className += ` ${behavior}`
    keyEl.setAttribute('disabled', 'disabled')
}

window.addEventListener("load", () => {
    renderForca()
    renderKeyboard()
})

window.addEventListener("keypress", (event) => {
    let behavior = verifyKeyPressed(event.key)
    handleButtonBehavior(event.key.toUpperCase(), behavior)
})