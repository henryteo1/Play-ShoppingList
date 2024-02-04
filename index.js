import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const appSettings = {
    databaseURL: "https://playground-c1728-default-rtdb.asia-southeast1.firebasedatabase.app"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppinginDB = ref(database, "ShoppingList")

const myinputEl = document.getElementById("inputField");
const addButtonEl = document.getElementById("addButton");
const shoppingListEl = document.getElementById("shoppingList");

addButtonEl.addEventListener("click", function () {
    let inputValue = myinputEl.value

    push(shoppinginDB, inputValue)
    alert(inputValue + ' was added.')
});

function clearmyInputEl() {
    myinputEl.value = ""
}

function appenditemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newEL = document.createElement("li");

    newEL.addEventListener("click", function () {

        var confirmDel = confirm('Confirm delete?')

        if (confirmDel) {


            let exactLocationofItemInDB = ref(database, `ShoppingList/${itemID}`)
            alert(itemValue + " was deleted.")
            remove(exactLocationofItemInDB)
            
        }
        else {
            alert('Nothing was deleted.')
        }
    })


    newEL.textContent = itemValue;
    shoppingListEl.append(newEL)
}


// when the db updates, pull the new list and display in shoppingListEl
onValue(shoppinginDB, function (snapshot) {

    if (snapshot.exists()) {
        let shoppingListArray = Object.entries(snapshot.val())

        clearShoppingListEl()

        clearmyInputEl();

        for (let i = 0; i < shoppingListArray.length; i++) {
            let currentShopItem = shoppingListArray[i];
            let currentShopItemID = currentShopItem[0];
            let currentShopItemValue = currentShopItem[1];

            appenditemToShoppingListEl(currentShopItem);
        }
    } else {
        shoppingListEl.innerHTML = "No items here..."
    }

});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}