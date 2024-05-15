/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom")

const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default


const fs = require('fs');


function initDomFromFiles(htmlPath, jsPath) {
  const html = fs.readFileSync(htmlPath, "utf8")
  document.open()
  document.write(html)
  document.close()
  jest.isolateModules(function () {
    require(jsPath)
  })
}


test("successfully loads application into DOM", function () {
  initDomFromFiles(
    __dirname + "/registerUser.html",
    __dirname + "/registerUser.js"
  )
  
  const emailButton = domTesting.getByLabelText(document, "Email")
  expect(emailButton).toHaveTextContent("")
})

test("checks to see if both password and email were valid", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, "validEmail@gmail.com")
    await user.type(password, "validPassw0rd!")
    await user.click(register)

    const successDiv = domTesting.getByRole(document, "status")
    expect(successDiv).toHaveClass("success status")
})

test("email does not pass, but password is valid", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, "validEmailgmail.com")
    await user.type(password, "validPassw0rd!")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")
    expect(errorDiv).not.toHaveTextContent("The password you entered is invalid.")
})

test("email is invalid because it is empty, but password is valid", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, " ")
    await user.type(password, "validPassw0rd!")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")
})

test("password is invalid because it is empty, but email is valid", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, "validEmail@gmail.com")
    await user.type(password, " ")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).not.toHaveTextContent("The email address you entered is invalid.")
})


test("neither the email nor the password pass because they are both empty", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, " ")
    await user.type(password, " ")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The email address you entered is invalid.")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs to be at least 8 characters")
    expect(errorDiv).toHaveTextContent("Password needs a lower case letter")
    expect(errorDiv).toHaveTextContent("Password needs an upper case letter")
    expect(errorDiv).toHaveTextContent("Password needs a numeric digit (0-9)")
    expect(errorDiv).toHaveTextContent("Password needs a symbol (!@#$%^&*)")
    expect(errorDiv).toHaveTextContent("Password contains an invalid character (only letters, numbers, and the symbols !@#$%^&* are allowed)")
})




test("email passes, but password does not have 8 characters (other reqs are met though)", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, "validEmail@gmail.com")
    await user.type(password, "1234Aa!")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs to be at least 8 characters")
})

test("email passes, but password does not have a lower case letter (other reqs are met though)", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, "validEmail@gmail.com")
    await user.type(password, "123456A!")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs a lower case letter")
})

test("email passes, but password does not have a upper case letter (other reqs are met though)", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, "validEmail@gmail.com")
    await user.type(password, "123456a!")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs an upper case letter")
})

test("email passes, but password does not have a numeric digit (other reqs are met though)", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, "validEmail@gmail.com")
    await user.type(password, "validPassword!")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs a numeric digit (0-9)")
})

test("email passes, but password does not have a symbol (other reqs are met though)", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, "validEmail@gmail.com")
    await user.type(password, "validPassword1")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password needs a symbol (!@#$%^&*)")
})

test("email passes, but password contains an invalid character (other reqs are met though)", async function(){
    initDomFromFiles(
        __dirname + "/registerUser.html",
        __dirname + "/registerUser.js"
      )
    
    const email = domTesting.getByLabelText(document, "Email")
    const password = domTesting.getByLabelText(document, "Password")
    const register = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(email, "validEmail@gmail.com")
    await user.type(password, "validPassword1!_")
    await user.click(register)

    const errorDiv = domTesting.getByRole(document, "alert")
    expect(errorDiv).toHaveClass("error status")
    expect(errorDiv).toHaveTextContent("The password you entered is invalid.")
    expect(errorDiv).toHaveTextContent("Password contains an invalid character (only letters, numbers, and the symbols !@#$%^&* are allowed)")
})


