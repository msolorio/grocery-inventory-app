console.log('in inventory js');

///////////////////////////////////////////////
// STATE
///////////////////////////////////////////////
var state = {
};

// simulates data from initial GET request
var MOCK_ITEMS_DATA = {
  items: [
    {
      "itemName": "Spinach",
      "currentAmount": 2,
      "targetAmount": 2,
      "unitName": "tubs",
      "incrementor": 0.25,
      "location": "Sprouts",
      "image": "images/salad.svg"
    },
    {
      "itemName": "Bananas",
      "currentAmount": 4,
      "targetAmount": 10,
      "unitName": "bananas",
      "incrementor": 1,
      "location": "Costco",
      "image": "images/salad.svg"
    }
  ]
};

function getItems(renderItems) {

  // mocks GET request for all items
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
          '<div class="edit" data-cardNum=' + index + '>Edit</div>' +
          '<div class="remove" data-cardNum=' + index + '>X</div>' +
          '<h3 class="itemName">' + item.itemName + '</h3>' +
          '<img class="image" src=' + item.image + ' alt="" title=""/>' +
          '<div class="amountChanger">' +
            '<img class="decrementor" data-cardNum=' + index + ' src="images/left-arrow.svg">' +
            '<span class="amountContainer">' +
              '<span>' + item.currentAmount + ' </span>' +
              '<span>/ </span>' +
              '<span>' + item.targetAmount + ' </span>' +
              '<span>' + item.unitName + '</span>' +
            '</span>' +
            '<img class="incrementor" data-cardNum=' + index + ' src="images/right-arrow.svg">' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }, '');

  $('.js-itemsRow').html(result);
}

function listenForDecrementorClick() {
  $('.js-itemsRow').on('click', '.decrementor', function() {
    console.log('decrementor clicked');
  });
}

///////////////////////////////////////////////
// ADD ITEM SCREEN
///////////////////////////////////////////////
function getNewItemData() {
  var newItem = {};
  newItem.itemName = $('.js-itemName').val();
  newItem.targetAmount = parseInt($('.js-targetAmount').val());
  newItem.currentAmount = parseInt($('.js-currentAmount').val());
  newItem.unitName = $('.js-unitName').val();
  newItem.location = $('.js-location').val();
  newItem.image = 'images/salad.svg';

  return newItem;
}

// adding an item
function addItem(renderItems) {

  // simulates POST request
  setTimeout(function() {

    var newItem = getNewItemData();

    state.items.unshift(newItem);

    renderItems(state.items);
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
});
