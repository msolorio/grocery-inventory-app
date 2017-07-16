console.log('in inventory js');

var MOCK_ITEMS_DATA = {
  items: [
    {
      "itemName": "Spinach",
      "quantity": 2,
      "target": 2,
      "unit": "tubs",
      "incrementor": 0.25,
      "location": "Sprouts",
      "image": "images/salad.svg"
    },
    {
      "itemName": "Bananas",
      "quantity": 4,
      "target": 10,
      "unit": "bananas",
      "incrementor": 1,
      "location": "Costco",
      "image": "images/salad.svg"
    }
  ]
};

// TODO: replace with HTTP call
function getItems(callback) {
  setTimeout(function() {
    callback(MOCK_ITEMS_DATA.items);
  }, 0);
}

function printItems(items) {
  console.log('in printItems');

  var result = items.reduce(function(resultStr, item) {
    return resultStr + (
      '<div class="col itemCard">' +
        '<div class="card">' +
          '<div class="remove">X</div>' +
          '<h3 class="itemName">' + item.itemName + '</h3>' +
          '<img class="image" src=' + item.image + ' alt="" title=""/>' +
          '<div class="amountChanger">' +
            '<img class="decrementor" src="images/left-arrow.svg">' +
            '<span class="amountContainer">' +
              '<span>' + item.quantity + ' </span>' +
              '<span>/ </span>' +
              '<span>' + item.target + ' </span>' +
              '<span>' + item.unit + '</span>' +
            '</span>' +
            '<img class="incrementor" src="images/right-arrow.svg">' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }, '');

  $('.js-itemsRow').append(result);
}

$(function() {
  getItems(printItems);
});
