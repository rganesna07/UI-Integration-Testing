const arabicNumberInput = document.getElementById("arabic-number")
const form = document.getElementById("arabic-number-form")
const oldRomanResult = document.getElementById("old-roman-result")
const modernRomanResult = document.getElementById("modern-roman-result")

/*
 * Clear Arabic number input field when the page first loads.
 */
arabicNumberInput.value = ""

/*
 * Add a listener to the Arabic number input field to listen for typing and
 * update the "old" Roman numeral result "live" as the user types.  If the
 * value input by the user can't be converted to an "old" Roman numeral,
 * don't display any value.
 */
arabicNumberInput.addEventListener("input", function () {
    modernRomanResult.textContent = ""
    const arabicNumber = parseInt(arabicNumberInput.value)
    try {
        oldRomanResult.textContent = convertToOldRoman(arabicNumber)
    } catch (err) {
        oldRomanResult.textContent = ""
    }
})

/*
 * When the user actually submits the form, send a request to the API described
 * here to convert the number to a "modern" Roman numeral:
 *
 * https://helloacm.com/tools/romans/
 *
 * If an error occurs in the translation, an error message is displayed.
 */
form.addEventListener("submit", async function (event) {
    event.preventDefault()
    clearErrorMessages()
    const arabicNumber = arabicNumberInput.value
    try {
        const response = await fetch(
            `https://romans.justyy.workers.dev/api/romans/?n=${arabicNumber}`
        )
        const data = await response.json()
        if (data.error) {
            displayError(data.error)
        } else {
            modernRomanResult.textContent = data.result
        }
    } catch (err) {
        displayError(err.message)
    }
})

/*
 * This function displays an error message to the user if the translation
 * request failed for any reason.
 */
function displayError(errorMsg) {
    const errorDiv = document.createElement("div")
    errorDiv.classList.add("error")
    errorDiv.setAttribute("role", "alert")
    errorDiv.innerHTML = "<h3>❌ Error</h3>"

    /*
     * The error message may have come from the outside world, so we have to
     * treat it cautiously, making sure it's not executed as HTML code.
     */
    const errorMsgP = document.createElement("p")
    errorMsgP.textContent = errorMsg
    errorDiv.appendChild(errorMsgP)

    form.appendChild(errorDiv)
}

/*
 * This function removes any error message currently being displayed to the
 * user.
 */
function clearErrorMessages() {
    const errors = form.querySelectorAll(".error")
    errors.forEach(function (error) {
        error.remove()
    })
}

/*
 * This table represents the conversions between Roman digits and Arabic values.
 */
const conversionTable = {
    "M": 1000,
    "C": 100,
    "L": 50,
    "X": 10,
    "V": 5,
    "I": 1
}

/**
 * This function converts an Arabic number into the corresponding "old" Roman
 * numeral.  Old Roman numerals are based only on addition.  For example, the
 * Arabic number 9 is "VIIII" in old Roman numerals (it's "IX" in modern Roman
 * numerals).
 *
 * @param {number} input A numeric value representing the Arabic number to
 *   convert to old Roman numerals.  Must be in the range 1-3999.  Any decimal
 *   part of the number is ignored.
 *
 * @throws {RangeError} Throws a RangeError if the input value is a number
 *   outside the range 1-3999.
 * @throws {Error} Throws an Error if the input is not a number.
 *
 * @returns {string} Returns a string containing the old Roman numeral
 *   conversion for the specified input value.
 */
function convertToOldRoman(input) {
    if (input === undefined || typeof input !== "number") {
        throw Error("Expected a number parameter")
    }
    if (input < 1 || input > 3999) {
        throw RangeError("Input must be in range 1-3999")
    }

    /*
     * Cycle through Roman digits from greatest (M) to least (I).  For each
     * digit, subtract the corresponding Arabic value from the input number
     * as many times as possible, adding an instance of the current Roman
     * to the resultint translation for each subtraction.
     */
    const romanDigits = Object.keys(conversionTable)
    let currRomanIdx = 0
    let result = ""
    while (input > 0 && currRomanIdx < romanDigits.length) {
        const currRomanDigit = romanDigits[currRomanIdx]
        const currArabicValue = conversionTable[currRomanDigit]
        while (input >= currArabicValue) {
            result += currRomanDigit
            input -= currArabicValue
        }
        currRomanIdx++
    }
    return result
}
