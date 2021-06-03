//Command to test whether the JS file is working.
//Enters the String "Here" in the Console of the Web Browser when a user visits the webpage.
console.log("Here");

// Check whether the HTML content in the document is done loadeing. Should be done since 
// we added the 'async' procperty to the script tag in the HTML document.
if(document.readyState = 'loading') {

    // If HTML document is loaded, then run the 'ready' function[Wihich has the code 
    // relevant to buttons].
    // 'DOMContentLoaded' checks whether the HTML content is loaded.
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {

    /*
    Create a document Object[A type of Object that JavaScript gives the page, that 
    has a bunch of classes. A document object is everything inside the HTML document].

    Then call the 'getElementsByClassName' method which queries elements based on a given class.

    Get all elements in the HTML document with the class name 'btn-danger'
    and assign it to variable 'removeCartItemButtons'
    */
    var removeCartItemButtons = document.getElementsByClassName('btn-danger');

    //Displays the info in variable removeCartItemButton in the log.
    console.log(removeCartItemButtons);



    /*
    Create for loop going through each Element in the 'removeCartItemButtons' variable.
    Within the loop,

        Each element is assigned to a variable 'button' which checks for a 'click'
        event, in order to execute a function using the 'addEventListener' method.

        'AddEventListener' method also creates and returns the object 'event' which has the 
        attribute 'target'. target variable of event object is assigned to 'buttonClicked'
        variable.

        the parentElement of the parentElement[btn-danger -> cart-column -> cart-row]
        of the target of the event is then removed using the 'remove' method.
    */

    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    /*
    Get all elements in the HTML document with the class name 'cart-quantity-input'
    and assign it to variable 'quantityInputs'.

    Then loop through the elements in the 'quantityInputs' variable and for each element,
    add an EventListener that checks whether the value has changed.
    If the value changes, run the 'quantityChanged' function.
    */
    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    /*
    Get all elements in the HTML document with the class name 'shop-item-button'
    and assign it to variable 'addToCartButtons'.

    Then loop through the elements in the 'addToCartButtons' variable and for each 
    element in the array,
    Add an eventListner which reacts when the 'add to Cart' button is clicked.
    If said event occurs, run function 'addToCartClicked'.
    */
    var addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    // Run 'purchaseButtonClicked' function when the PURCHSE button is clicked.
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purcaseButtonClicked);
    
}

// ^^
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();

    // call 'updateCartTotal()' function
    updateCartTotal();
}

/*
When the PURCHASE button is clicked, 
Display a Thank you alert.
Then, while the HTML div with class 'cart-items' still has child elements, remove each,
untill there are no child elements (Clear the cart).
Finally, update the Total to reflect the changes made.
*/
function purcaseButtonClicked() {
    alert("Thank You for your purchase");
    var cartItems = document.getElementsByClassName('cart-items')[0];
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

//Assigns the target of the event[The quantity inputs] to a variable 'input'.
function quantityChanged(event) {
    var input = event.target;

    //If the value in the input is either 'null' or less than zero, change it to 1.
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }

    // Call 'updateCartTotal()' function
    updateCartTotal();
}

/*
When clicked, assign target of the event to variable 'button' and select the parentElement
of the parentElement of it. (Select class 'shop-item').

Then extract the title, price, and Image Source form the 'shop-item' class Elements.

Then run 'addItemtoCart' function. Afterwards, update the cart total.
*/ 
function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
    console.log(title, price, imageSrc);

    addItemToCart(title, price, imageSrc);
    updateCartTotal();
    
}

/*
> Create a div and add the class 'cart-row' to it.

> Check if item is already in the cart. If so, send message saying that the item is already
included in cart.

> Assign HTML code for creating a new cart row and assign it to variable 'cartRowContents'.
> Then assign that variable as the HTML code for the cartRow div.

> Add the 'cartRow' div to the div with the 'cartItems' class.

> Add the Remove button eventListener which calls the 'removeCartItem' function.
> Add the quantity change eventListener which calls the 'quantityChanged' function.

*/
function addItemToCart(title, price, imageSrc){
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');

    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = document.getElementsByClassName('cart-item-title');
    for( var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert("This item is already added to the cart.");
            return;
        }
    }

    var cartRowContents = `
                            <div class="cart-item cart-column">
								<img class="cart-item-image" src="${imageSrc}" alt="Cover art" width="100" height="100">
								<span class="cart-item-title">${title}</span>
							</div>
							<span class="cart-price cart-column">${price}</span>
							<div class="cart-quantity cart-column">
								<input class="cart-quantity-input" type="number" value="1">
								<button class="btn btn-danger" type="button">REMOVE</button>
							</div>
                            `
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);

}


/*
Making a function updateCartTotal which loops through all rows, multiplies price by
Quantity and finally gets the sum of all rows.
*/
function updateCartTotal() {

    /*
    Get only the first element in the HTML document with the class name 'cart-items'
    and assign it to variable 'cartItemContainer'. || Yes, the [0] to select the 1st element
    of the array is redundant and not needed as there is only one 'cart-items' class.
    */
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];

    // Get all elements inside the 'cart-items' class, with the class name 'cart-row',
    // and assign it to the variable 'cartRows'.
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    console.log(cartRows);

    var total = 0;

    // Loop through the 'cartRows' array using a 'for' loop
    for (var i = 0; i < cartRows.length; i++) {

        // Assign each element in the array 'cartRows' to the variable 'cartRow' for the loop.
        var cartRow = cartRows[i];

        // Assign only the first element of class 'cart-quantity-input' which is within the class 'cart-price' to a variable
        // quantityElement.
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        
        // Display the priceElement and quantityElement arrays in the console.
        console.log(priceElement, quantityElement);
        
        // Extract the price from the priceElement, using 'innerText' command and then remove the '$' sign so that we can
        // perform arithmetic operations using it.
        // Then convert the String obtained from 'innerText' into a Float value using 'parseFloat'.
        var price = parseFloat(priceElement.innerText.replace('$',''));      

        // Extract the value entered in the quantity section of the quantityElement.
        var quantity = quantityElement.value;

        // Displaying the price, quantity, and total in the console (Without $ sign).
        console.log('price = '+price, ', quantity = '+ quantity, ', total = ' + price * quantity);

        // Calculate the total price so far.
        total = total + (price * quantity);
    }

    // Limit decimal places to only 2, so that we don't get values like $299.84999999999997.
    total = Math.round(total * 100) / 100;

    // Get only the first element of the elements inside the class 'cart-total-price'. 
    // Replace the text inside the class 'cart-total=price' with '$' and the value of the 'total' variable
    // obtained inside the loop. 
    document.getElementsByClassName('cart-total-price')[0].innerText = '$'+total;

    console.log(cartItemContainer);
}






