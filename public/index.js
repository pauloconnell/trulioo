// client-side js, loaded by index.html

console.log("hello world :o");

// define variables that reference elements on our page
const dreamsList = document.getElementById("dreams");
const dreamsForm = document.querySelector("form");
const noExpenseButton=document.getElementById("button-no");
// a helper function that creates a list of <li>. takes items='dream' adds to list ='dreamsList'
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
  if((!document.getElementById("capitalRequest").value) && (document.getElementById("noCapitalExpense").checked=false)){
    document.getElementById("formLabel").value="Please enter Capital expense or click check box to avoid all expenses";
    return;
  }
  // get dream value and add it to the list
  let newDream = document.getElementById("capitalRequest").value;
  const thisName=document.getElementById("verifiedName").value;
  newDream=`${newDream} Voter: ${thisName}`
  if(document.getElementById("noCapitalExpense")){
    newDream= "Avoid all Capital Expense "  
  }

  appendNewDream(newDream);  // wraps item in <Li> and adds to our list
  // reset form Capital Expense only
  //dreamsForm.reset();
  document.getElementById("capitalRequest").value="";  // reset to allow multiple items 
  document.getElementById("capitalRequest").focus();
});

//listen for the 2nd button to be clicked
// replaced with checkBox for simplicity

// noExpenseButton.addEventListener("click", event=>{
//   console.log("Inside button id:",event.target.id);
//   let newDream = document.getElementById("capitalRequest".value); 
//   if (!newDream){
//     newDream=" *ALL/ANY  AVOIDABLE *";
//   }
//   newDream="Avoid Captital expense related to: "+newDream;
//   const thisName=document.getElementById("verifiedName").value;
//   newDream=newDream+thisName;
//   console.log(dreamsList, newDream);
  
//   appendNewDream(newDream);
//   // reset form Capital Expense only
//   //dreamsForm.reset();
//    document.getElementById("capitalRequest").value="";  // reset to allow multiple items 
//   dreamsForm.elements.dream.focus();

// })
