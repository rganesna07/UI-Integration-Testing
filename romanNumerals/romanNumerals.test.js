/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom")

const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

const http = require("msw").http
const HttpResponse = require("msw").HttpResponse
const setupServer= require("msw/node").setupServer

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

const search = require("./romanModernValues.json")

const server = setupServer(
    http.get(
        "https://romans.justyy.workers.dev/api/romans/",
        function(){
            return HttpResponse.json(search)
        }
    )
)

beforeAll(function() {
    server.listen()
})

afterAll(function() {
    server.close()
})

test("old Roman Numeral is converted accurately as user types it in (doesn't click)", async function(){
    initDomFromFiles(
        __dirname + "/romanNumerals.html",
        __dirname + "/romanNumerals.js",
    )

    const inputNum = domTesting.getByLabelText(document, "Arabic number (1-3999)")

    const user= userEvent.setup()
    await user.type(inputNum, "438")

    const oldNum = await domTesting.findByText(document, '"Old" Roman Numeral')
    const modernNum = await domTesting.findByText(document, '"Modern" Roman Numeral')

    expect(oldNum).toHaveTextContent("CCCCXXXVIII")
    expect(modernNum).toHaveTextContent(" ")
})


test("numbers are converted into old and new roman numbers and shown in their respective sections", async function(){
    initDomFromFiles(
        __dirname + "/romanNumerals.html",
        __dirname + "/romanNumerals.js",
    )

    const inputNum = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    const convert = domTesting.getByRole(document, "button")

    const user= userEvent.setup()
    await user.type(inputNum, "438")
    await user.click(convert)

    const oldNum = await domTesting.findByText(document, '"Old" Roman Numeral')
    const modernNum = await domTesting.findByText(document, '"Modern" Roman Numeral')

    expect(oldNum).toHaveTextContent("CCCCXXXVIII")
    expect(modernNum).toHaveTextContent("CDXXXVIII")
})

test("modern Roman Numeral is cleared when user changes input number", async function(){
    initDomFromFiles(
        __dirname + "/romanNumerals.html",
        __dirname + "/romanNumerals.js",
    )

    const inputNum = domTesting.getByLabelText(document, "Arabic number (1-3999)")
    const convert = domTesting.getByRole(document, "button")

    const user= userEvent.setup()
    await user.type(inputNum, "438")
    await user.click(convert)

    const oldNum = await domTesting.findByText(document, '"Old" Roman Numeral')
    const modernNum = await domTesting.findByText(document, '"Modern" Roman Numeral')

    expect(oldNum).toHaveTextContent("CCCCXXXVIII")
    expect(modernNum).toHaveTextContent("CDXXXVIII")

    await user.type(inputNum, "43")

    expect(oldNum).not.toHaveTextContent("CCCCXXXVIII")
    expect(modernNum).toHaveTextContent(" ")

})
