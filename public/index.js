// client-side js, loaded by index.html

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");
const myData = document.getElementById("myData");

// helper function that creates a list of <li>. takes items='dream' adds to the <ul>'dreamsList'
function appendNewDream(dream) {
  const newListItem = document.createElement("li");
  newListItem.innerText = dream;
  dreamsList.appendChild(newListItem);
}

// fetch the initial list of dreams from server
fetch("/dreams")
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text (added in HTML)
    dreamsList.firstElementChild.remove();

    // iterate through every dream and add it to our page
    dreams.forEach(appendNewDream);
  });

// listen for the form to be submitted and add a new <Li> when it is
dreamsForm.addEventListener("submit", event => {
  // stop our form submission from refreshing the page
  event.preventDefault();
  console.log(event.target);
  if (!document.getElementById("verifiedName").value) {
    document.getElementById("tryAgain").innerHTML =
      "Please complete form above to fill in verified name";
    document.getElementById("capitalRequest").value = "";
    return;
  }
  if (
    !document.getElementById("capitalRequest").value &&
    (document.getElementById("noCapitalExpense").checked = false)
  ) {
    document.getElementById("formLabel").value =
      "Please enter Capital expense ";
    return;
  }
  // get dream value and add it to the list
  let newDream = document.getElementById("capitalRequest").value;
  const thisName = document.getElementById("verifiedName").value;
  if (document.getElementById("noCapitalExpense").checked == true) {
    newDream = "Avoid all Capital Expense related to: " + newDream;
  }
  newDream = `${newDream} Voter: ${thisName}`;
  appendNewDream(newDream); // wraps item in <Li> and adds to our list
  // reset form Capital Expense only
  //dreamsForm.reset();
  document.getElementById("capitalRequest").value = ""; // reset to allow multiple items
  document.getElementById("capitalRequest").focus();
});

//myData.addEventListener("click", event => {

//});
