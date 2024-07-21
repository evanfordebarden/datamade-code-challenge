"use strict"
/* method that displays an error beneath the form when an input is invalid*/
function inputError (message) {
  // create p element for error text
  const errorText = document.createElement("p")
  // get the form element from the DOM
  const addressForm = document.querySelector(".form")
  // set the text of the p element
  addressForm.appendChild(errorText).innerHTML = message
  // add an id to the p element so we can identify it later
  errorText.setAttribute("id", "input-alert")
}

/* method that constructs a tr elemenet for insertion into tbody */
function rowBuilder (part, tag, tbody) {
  // create tr element
  const tr = document.createElement("tr")
  // add a class to the row so we can identify all similar rows later
  tr.setAttribute("class", "body-row")
  // create td elements for each piece of data in the row
  const tdAddress = document.createElement("td")
  const tdTag = document.createElement("td")
  // set the text for each of the created td elements
  tr.appendChild(tdAddress).innerHTML = part
  tr.appendChild(tdTag).innerHTML = tag
  // append the row within the specified tbody element
  tbody.appendChild(tr)
}

/* method responsible for parsing the address in the input and displaying
appropriate elements on the page */
async function parseAddress () {
  /* FIRST, clean up any previous outputs, if they exist*/
  // remove the "input-alert" if it exists
  const apiAlert = document.getElementById("input-alert")
  if (!!apiAlert) {
    apiAlert.remove()
  }
  // reset display of "address-results" to "none"
  const resultsTable = document.getElementById("address-results")
  if (resultsTable.style.display === "block") {
    resultsTable.style.display = "none"
  }
  // reset "parse-type" text to ""
  const parseType = document.getElementById("parse-type")
  if (parseType.innerHTML.length) {
    parseType.innerHTML = ""
  }
  // remove all "body-row" elements within tbody
  const allBodyRows = document.querySelectorAll(".body-row")
  if (allBodyRows.length) {
    allBodyRows.forEach((row) => row.remove())
  }

  /*SECOND, let's parse the address */
  // get address from input field "address"
  const address = document.getElementById("address").value

  // if no address, display error to user
  if (!address) {
    inputError("Enter an address")
    return
  }

  // attempt to parse the address via api
  try {
    const response = await fetch(
      `/api/parse/?input_string=${encodeURIComponent(address)}`
    )

    // if response is not successful, display error to user and throw Error
    if (!response.ok) {
      inputError("API error, please modify address and try again.")
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    // convert response to json and extract desired data
    const { address_components, address_type } = await response.json()

    // add the address_type text to "parse-type" element
    parseType.innerHTML = address_type

    // create array from address_components
    const addreessComponentArray = Object.entries(address_components)
    // get the desired tbody element
    const tbody = document.getElementById("address-results-body")

    // iterate through address components and add tr rows to tbody
    addreessComponentArray.forEach((row) => {
      rowBuilder(row[1], row[0], tbody)
    })

    // set the display of of "address-results" to "block" so it is visible
    resultsTable.style.display = "block"
  } catch (error) {
    // if this fails, log the error
    console.error("Error:", error)
  }
}
