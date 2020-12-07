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

 

// fetch the initial list of dreams
fetch("/dreams")
  .then(response => response.json()) // parse the JSON from the server
  .then(dreams => {
    // remove the loading text
    dreamsList.firstElementChild.remove();
  
    // iterate through every dream and add it to our page
    dreams.forEach(appendNewDream);
  
    // listen for the form to be submitted and add a new dream when it is
    dreamsForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();
      console.log(event.target);
      // get dream value and add it to the list
      let newDream = document.getElementById("capitalRequest").value;
      //dreams.push(newDream);
       const thisName=document.getElementById("verifiedName").value;
      newDream=`${newDream} Voter: ${thisName}`
      appendNewDream(newDream);
      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
    });
  
   
  });

noExpenseButton.addEventListener("click", event=>{
      console.log("Inside button id:",event.target.id);
      let newDream = event.target.value; //dreamsForm.elements.dream.value;
      if (!newDream){
        newDream=" *ALL/ANY  AVOID or MINIMIZE *";
      }
      newDream="Avoid Captital expense related to: "+newDream;
      const thisName=document.getElementById("verifiedName").value;
      newDream=newDream+thisName;
      console.log(dreamsList, newDream);
      //dreamsList.push(newDream);
      appendNewDream(newDream);
      // reset form
      dreamsForm.reset();
      dreamsForm.elements.dream.focus();
    
    })
