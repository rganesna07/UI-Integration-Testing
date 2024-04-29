const form = document.getElementById("add-photo-form")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")

/*
 * Hook up a form submission listener that validate the email and password
 * entered by user, and if they are valid, clears the form and displays a
 * success message.  If the email and/or password aren't valid, the listener
 * doesn't clear the form and displays an informative error message.
 */
form.addEventListener("submit", function (event) {
    event.preventDefault()
    clearStatusMessages()

    const email = emailInput.value
    const password = passwordInput.value

    const emailValid = verifyEmail(email)
    const passwordValid = verifyPassword(password)
    if (emailValid && passwordValid.pass) {
        emailInput.value = ""
        passwordInput.value = ""
        displaySuccess()
    } else {
        displayError(emailValid, passwordValid)
    }
})

/*
 * This function displays a success message to let the user know when they
 * submitted a valid email address and password and registered successfully.
 */
function displaySuccess() {
    const successDiv = document.createElement("div")
    successDiv.classList.add("success", "status")
    successDiv.setAttribute("role", "status")
    successDiv.innerHTML = "<h3>✅ Success</h3>"
    successDiv.innerHTML += "<p>You have successfully registered.</p>"
    form.appendChild(successDiv)
}

/*
 * This function displays an error message to let the user know how their
 * submitted email address and/or password are invalid.
 */
function displayError(emailValid, passwordValid) {
    const errorDiv = document.createElement("div")
    errorDiv.classList.add("error", "status")
    errorDiv.setAttribute("role", "alert")

    errorDiv.innerHTML = "<h3>❌ Error</h3>"
    if (!emailValid) {
        errorDiv.innerHTML += "<p>The email address you entered is invalid.</p>"
    }

    if (!passwordValid.pass) {
        errorDiv.innerHTML += "<p>The password you entered is invalid.</p>"
        let listHtml = "<ul>"
        if (!passwordValid.length) {
            listHtml += "<li>Password needs to be at least 8 characters</li>"
        }
        if (!passwordValid.lowercase) {
            listHtml += "<li>Password needs a lower case letter</li>"
        }
        if (!passwordValid.uppercase) {
            listHtml += "<li>Password needs an upper case letter</li>"
        }
        if (!passwordValid.digit) {
            listHtml += "<li>Password needs a numeric digit (0-9)</li>"
        }
        if (!passwordValid.symbol) {
            listHtml += "<li>Password needs a symbol (!@#$%^&*)</li>"
        }
        if (!passwordValid.noInvalid) {
            listHtml += "<li>Password contains an invalid character (only letters, numbers, and the symbols !@#$%^&* are allowed)</li>"
        }
        listHtml += "</ul>"
        errorDiv.innerHTML += listHtml
    }

    form.appendChild(errorDiv)
}

/*
 * This function removes any error message or success message currently being
 * displayed to the user.
 */
function clearStatusMessages() {
    const statuses = form.querySelectorAll(".status")
    statuses.forEach(function (status) {
        status.remove()
    })
}

/*
 * This function verifies whether an email address is a valid email address.
 * It does not verify that an email address exists but only whether it matches
 * the correct structure of an email address.  Note that a simplified email
 * address structure is used here, and not all email addresses that are valid
 * under RFC 5322 (https://datatracker.ietf.org/doc/html/rfc5322) will be
 * considered valid by this function.  Most typical email addresses will pass,
 * though.
 *
 * @param email An email address
 *
 * @returns {boolean} Returns true if the email address is valid and false
 *     otherwise.
 */
function verifyEmail(email) {
    /*
     * Short-circuit checks if password is not a string
     */
    if (!email || typeof email !== "string") {
        return false
    }

    /*
     * This is a regular expression for verifying most email addresses.  It's
     * from Regular Expressions Cookbook by Jan Goyvaerts and Steven Levithan:
     *
     * https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s01.html
     */
    const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-z0-9-]+\.)+[a-z]{2,6}$/i

    return emailRegex.test(email)
}


/*
 * This function verifies whether a password satisfies the following criteria:
 *   * Contains at least 8 characters
 *   * Contains at least one lowercase letter
 *   * Contains at least one uppercase letter
 *   * Contains at least one numerical digit
 *   * Contains at least one of the following symbols: !@#$%^&*
 *   * Does not contain invalid characters (spaces and other symbols not listed
 *     above)
 *
 * @param password The password to be validated
 *
 * @returns {object} Returns an object with the following fields, all boolean
 *   valued:
 *     pass - true if the password passes overall verification
 *     length - true if the password contains at least 8 characters
 *     lowercase - true if the password contains at least one lowercase letter
 *     uppercase - true if the password contains at least one uppercase letter
 *     digit - true if the password contains at least one digit
 *     symbol - true if the password contains at least one valid symbol
 *     noInvalid - true if the password doesn't contain invalid symbols/spaces
 *
 *   An example return value for a password that doesn't contain a symbol or
 *   an uppercase character looks like this:
 *
 *     {
 *       pass: false,
 *       length: true,
 *       lowercase: true,
 *       uppercase: false,
 *       digit: true,
 *       symbol: false,
 *       noInvalid: true
 *     }
 */
function verifyPassword(password) {
    /*
     * Short-circuit checks if password is not a string
     */
    if(!password || typeof password !== "string") {
        return { pass: false }
    }

    /*
     * Perform individual verification checks.
     */
    const checks = {
        length: _containsAtLeast8Chars(password),
        lowercase: _containsOneLowercase(password),
        uppercase: _containsOneUppercase(password),
        digit: _containsOneDigit(password),
        symbol: _containsOneSymbol(password),
        noInvalid: _containsNoInvalidChars(password)
    }

    /*
     * Determine overall verification result based on individual checks.
     */
    const pass = (
        checks.length &&
        checks.lowercase &&
        checks.uppercase &&
        checks.digit &&
        checks.symbol &&
        checks.noInvalid
    )

    return { ...checks, pass: pass }
}

function _containsAtLeast8Chars(password) {
    return password && password.length >= 8
}

function _containsOneLowercase(password) {
    const regex = /[a-z]/
    return regex.test(password)
}

function _containsOneUppercase(password) {
    const regex = /[A-Z]/
    return regex.test(password)
}

function _containsOneDigit(password) {
    const regex = /[0-9]/
    return regex.test(password)
}

function _containsOneSymbol(password) {
    const regex = /[!@#$%^&*]/
    return regex.test(password)
}

function _containsNoInvalidChars(password) {
    const regex = /[^a-zA-Z0-9!@#$%^&*]/
    return !regex.test(password)
}
