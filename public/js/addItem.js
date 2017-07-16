console.log('in addItem js');

var MOCK_NEW_ITEM = {
  item: {
    "itemName": "sweet potato",
    "quantity": 4,
    "target": 8,
    "unit": "unit",
    "incrementor": 1,
    "location": "Krisps"
  }
};

// adding an item
function addItem(callback) {
  setTimeout(function() {
    callback(MOCK_NEW_ITEM.item);
  }, 3000);
}

function printItem(item) {
  console.log(
    'name: ' + item.itemName
  );
}

