console.log('in inventory js');

(function() {
///////////////////////////////////////////////
// STATE
///////////////////////////////////////////////
window.state = {
};

// simulates data from initial GET request
var MOCK_ITEMS_DATA = {
  items: [
    {
      itemName: "Spinach",
      currentAmount: 2,
      targetAmount: 2,
      unitName: "tubs",
      stepVal: 0.25,
      location: "Sprouts",
      image: "images/salad.svg"
    },
    {
      "itemName": "Bananas",
      currentAmount: 4,
      targetAmount: 10,
      unitName: "bananas",
      stepVal: 1,
      location: "Costco",
      image: "images/salad.svg"
    }
  ]
};

function getItems(renderItems) {

  // simulates GET request for all items
  setTimeout(function() {
    state.items = MOCK_ITEMS_DATA.items;

    renderItems(state.items);
  }, 0);
}

function renderItems(items) {

  var result = items.reduce(function(resultStr, item, index) {
    return resultStr + (
      '<div class="col">' +
        '<div class="card">' +
          '<div class="edit" data-cardnum=' + index + '>Edit</div>' +
          '<div class="remove js-remove" data-cardnum=' + index + '>X</div>' +
          '<h3 class="itemName">' + item.itemName + '</h3>' +
          '<img class="image" src=' + item.image + ' alt="" title=""/>' +
          '<div class="amountChanger">' +
            '<img class="decrementor js-decrementor" data-cardnum=' + index + ' src="images/left-arrow.svg">' +
            '<span class="amountContainer">' +
              '<span>' + item.currentAmount + ' </span>' +
              '<span>/ </span>' +
              '<span>' + item.targetAmount + ' </span>' +
              '<span>' + item.unitName + '</span>' +
            '</span>' +
            '<img class="incrementor js-incrementor" data-cardnum=' + index + ' src="images/right-arrow.svg">' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }, '');

  $('.js-itemsRow').html(result);
}

function decrementItem(itemNum, renderItems) {
  // simulates PUT request
  setTimeout(function() {
    state.items[itemNum].currentAmount -= state.items[itemNum].stepVal;

    renderItems(state.items);
  }, 100); 
}

function listenForDecrementorClick() {
  $('.js-itemsRow').on('click', '.js-decrementor', function(event) {
      var itemNum = $(event.target).data('cardnum');
      decrementItem(itemNum, renderItems);
  });
}

function incrementItem(itemNum, renderItems) {
  // simulates PUT request
  setTimeout(function() {

    state.items[itemNum].currentAmount += state.items[itemNum].stepVal;

    renderItems(state.items);
  }, 100);
}

function listenForIncrementorClick() {
  $('.js-itemsRow').on('click', '.js-incrementor', function(event) {
      var itemNum = $(event.target).data('cardnum');
      incrementItem(itemNum, renderItems);
  });
}

function removeItem(itemNum, renderItems) {

  // simulates DELETE REQUEST
  setTimeout(function() {
    state.items.splice(itemNum, 1);

    renderItems(state.items);
  }, 300);
  
}

function listenForDeleteClick() {
  $('.js-itemsRow').on('click', '.js-remove', function(event) {
    var itemNum = $(event.target).data('cardnum');
    removeItem(itemNum, renderItems);
  });
}

///////////////////////////////////////////////
// UTILITY FUNCTIONS
///////////////////////////////////////////////
function parseDecimal(string) {
  return Math.round(parseFloat(string) * 100) / 100;
}

///////////////////////////////////////////////
// ADD ITEM SCREEN
///////////////////////////////////////////////
function getNewItemData() {
  var newItem = {};
  newItem.itemName = $('.js-itemName').val();
  newItem.targetAmount = parseDecimal($('.js-targetAmount').val());
  newItem.currentAmount = parseDecimal($('.js-currentAmount').val());
  newItem.stepVal = parseDecimal($('.js-stepVal').val());
  newItem.unitName = $('.js-unitName').val();
  newItem.location = $('.js-location').val();
  newItem.image = 'images/salad.svg';

  return newItem;
}

function clearForm() {
  $('.js-itemName').val('');
  $('.js-targetAmount').val('');
  $('.js-currentAmount').val('');
  $('.js-stepVal').val('');
  $('.js-unitName').val('');
  $('.js-location').val('');
}

// adding an item
function addItem(renderItems) {

  // simulates POST request
  setTimeout(function() {
    var newItem = getNewItemData();
    state.items.unshift(newItem);
    renderItems(state.items);

    clearForm();
  }, 0);
}

function listenForAddItem() {
  $('.js-addItemButton').click(function(event) {
    event.preventDefault();
    addItem(renderItems);
  });
}

$(function() {

  getItems(renderItems);

  listenForAddItem();
  listenForDecrementorClick();
  listenForIncrementorClick();
  listenForDeleteClick();
});

}());