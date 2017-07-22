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
    },
    {
      "itemName": "Avocados",
      currentAmount: 4,
      targetAmount: 10,
      unitName: "avs",
      stepVal: 1,
      location: "Sprouts",
      image: "images/salad.svg"
    }
  ]
};

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// INVENTORY SCREEN
///////////////////////////////////////////////////////////

function getItems(renderItems) {

  // simulates GET request for all items
  // /api/users/:user_id/items
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

  // TODO: will be called when switching to list view
  generateLists(renderLists);
}

function decrementItem(itemNum, renderItems) {
  // simulates PUT request
  // /api/users/:user_id/items/:item_id
  setTimeout(function() {
    state.items[itemNum].currentAmount -= state.items[itemNum].stepVal;

    renderItems(state.items);
  }, 0); 
}

function listenForDecrementorClick() {
  $('.js-itemsRow').on('click', '.js-decrementor', function(event) {
      var itemNum = $(event.target).data('cardnum');
      decrementItem(itemNum, renderItems);
  });
}

function incrementItem(itemNum, renderItems) {
  // simulates PUT request to update grocery item
  // /api/users/:user_id/items/:item_id
  setTimeout(function() {

    state.items[itemNum].currentAmount += state.items[itemNum].stepVal;

    renderItems(state.items);
  }, 0);
}

function listenForIncrementorClick() {
  $('.js-itemsRow').on('click', '.js-incrementor', function(event) {
      var itemNum = $(event.target).data('cardnum');
      incrementItem(itemNum, renderItems);
  });
}

function removeItem(itemNum, renderItems) {

  // simulates DELETE request
  // /api/users/:user_id/items/:item_id
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

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// ADD ITEM SCREEN
///////////////////////////////////////////////////////////
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

  // simulates POST request to create new item
  // /api/users/:user_id/items
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

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// LISTS SCREEN
///////////////////////////////////////////////////////////
function generateSingleListMarkup(list) {
  var singleListMarkup = (
    '<div class="col singleList">' +
      '<h3 class="location">' + list.location + '</h3>'
  );
  singleListMarkup += list.items.reduce(function(itemsList, item, index) {
    return itemsList += (
      '<div class="listItem js-listItem" data-listitemnum="' + index + '" data-location="' + list.location + '" data-itemname="' + item.itemName +'">' +
        '<div class="itemName">' + item.itemName + '</div>' +
        '<img class="checkmark js-checkmark" src="images/checked-button.svg" title="' + item.itemName + '" alt="check ' + item.itemName + '">' +
        '<div class="amountNeeded">' + item.amountNeeded + ' ' + item.unitName + '</div>' +
      '</div>'
    );
  }, '');

  singleListMarkup += '</div>';

  return singleListMarkup;
}

function renderLists(listsObj) {

  var allListsMarkup = '';

  for (var list in listsObj) {
    allListsMarkup += generateSingleListMarkup(listsObj[list]);
  }

  $('.js-listsRow').html(allListsMarkup);
}

function generateLists(renderLists) {
  
  var listsArray = state.items.reduce(function(lists, item) {
    if (item.targetAmount - item.currentAmount <= 0) {
      return lists;
    }

    if (!(item.location in lists)) {
      lists[item.location] = {
        location: item.location,
        items: []
      };
    }

    var newItem = {
      itemName: item.itemName,
      amountNeeded: (item.targetAmount - item.currentAmount),
      unitName: item.unitName,
      stepVal: item.stepVal
    }

    lists[item.location].items.push(newItem);

    return lists;
  }, {});

  state.lists = listsArray;

  renderLists(state.lists);
}

function checkOffListItem(listItemLocation, listItemNum, itemName) {

  setTimeout(function() {
    // simulates HTTP DELETE request remove list item
    // /api/users/:user_id/lists/:list_item_id
    state.lists[listItemLocation].items.splice(listItemNum, 1);

    // simulates HTTP PUT request to update item
    // /api/users/:user_id/items/:item_id
    state.items.forEach(function(item, index) {
      if (item.itemName === itemName) {
        state.items[index].currentAmount = state.items[index].targetAmount;
      }
    });

    renderItems(state.items);
  }, 0);
}

function listenForListItemClick() {
  $('.js-listsRow').on('click', '.js-listItem', function(event) {
      event.target = this;

    var listItemNum = $(event.target).data('listitemnum');
    var listItemLocation = $(event.target).data('location');
    var itemName = $(event.target).data('itemname');

    checkOffListItem(listItemLocation, listItemNum, itemName);
  });
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// ON LOAD
///////////////////////////////////////////////////////////
$(function() {

  getItems(renderItems);

  listenForAddItem();
  listenForDecrementorClick();
  listenForIncrementorClick();
  listenForDeleteClick();
  listenForListItemClick();
});

}());