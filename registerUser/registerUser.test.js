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


test("email passes, but password does not have a number", async function(){
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
    expect(errorDiv).toHaveTextContent("Password needs a numeric digit (0-9)")
})



