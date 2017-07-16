console.log('in inventory js');

var MOCK_ITEMS_DATA = {
  items: [
    {
      "itemName": "spinach",
      "quantity": 2,
      "target": 2,
      "unit": "tub",
      "incrementor": 0.25,
      "location": "Sprouts"
    },
    {
      "itemName": "bananas",
      "quantity": 4,
      "target": 10,
      "unit": "banana",
      "incrementor": 1,
      "location": "Costco"
    }
  ]
};

// viewing inventory
function getItems(callback) {
  setTimeout(function() {
    callback(MOCK_ITEMS_DATA.items);
  }, 300);
}

function printItems(items) {
  console.log('in printItems');

  var result = items.reduce(function(resultStr, item) {
    return resultStr + (
      '<div class="itemCard">' +
        '<div class="itemCard_remove">X</div>' +
        '<h3 class="itemCard_itemName">Spinach</h3>' +
        '<img src="" alt="" title=""/>' +
        '<div class="itemCard_ammountChanger">' +
          '<div class="itemCard_decrementor"><<</div>' +
          '<div class="itemCard_ammountContainer">' +
            '<span>1 </span>' +
            '<span>/ </span>' +
            '<span>2 </span>' +
            '<span>bins</span>' +
          '</div>' +
          '<div class="itemCard_decrementor">>></div>' +
        '</div>' +
      '</div>'
    );
  }, '');

  $('.items').append(result);
}

$(function() {
  getItems(printItems);
});
