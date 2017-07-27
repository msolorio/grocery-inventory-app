console.log('in inventory js');

(function() {
///////////////////////////////////////////////
// STATE
///////////////////////////////////////////////
// set to window for dev
window.state = {
  username: '',
  items: []
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

/**
 * Returns username from url
 */
function getUsername() {
  var path = location.pathname;
  var pathArray = path.split('/');
  return pathArray[pathArray.length - 1];
}

/**
 * Makes request to retrieve user's items
 * Calls a callback sending in retrieved data
 * @param {function} renderItems 
 */
function getItems(username, callback) {
  var settings = {
    type: 'GET',
    url: '/users/' + username + '/items',
    dataType: 'json'
  }

  $.ajax(settings)
    .done(function(data) {
      state.items = data.items;
      callback(state.items);
    })
    .fail(function(err) {
      console.log('there was an error getting all of your items');
      console.error('error:', err);
    });
}

function renderItems(items) {

  var result = items.reduce(function(resultStr, item, index) {
    return resultStr + (
      '<div class="col col-card">' +
        '<div class="card">' +
          '<div class="edit" data-cardnum=' + index + '>Edit</div>' +
          '<div class="remove js-remove" data-cardnum=' + index + '>X</div>' +
          '<h3 class="itemName">' + item.itemName + '</h3>' +
          '<img class="image" src=' + item.image + ' alt="" title=""/>' +
          '<div class="amountChanger">' +
            '<img class="decrementor js-decrementor" data-cardnum=' + index + ' src="images/left-arrow.svg">' +
            '<div class="amountContainer">' +
              '<div class="amount"' +
                '<span>' + item.currentAmount + ' </span>' +
                '<span>/ </span>' +
                '<span>' + item.targetAmount + ' </span>' +
              '</div>' +
              '<div>' +
                item.unitName +
              '</div>' +
            '</div>' +
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

function decrementItem(username, itemIndex, callback) {
  var updatedItem = state.items[itemIndex];
  var itemId = updatedItem._id;
  var stepVal = updatedItem.stepVal;
  state.items[itemIndex].currentAmount -= stepVal;

  var settings = {
    type: 'PUT',
    url: '/users/' + username + '/items/' + itemId,
    data: updatedItem,
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  $.ajax(settings)
  .done(function(data) {
    console.log(data);
    state.items[itemIndex] = data.updatedItem;
    callback(state.items);
  })
  .fail(function(err) {
    console.log('there was an error adding a new item.');
    console.log('error:', err);
  });
}

function listenForDecrementorClick() {
  $('.js-itemsRow').on('click', '.js-decrementor', function(event) {
      var itemIndex = $(event.target).data('cardnum');
      decrementItem(state.username, itemIndex, renderItems);
  });
}

function incrementItem(username, itemIndex, callback) {
  var updatedItem = state.items[itemIndex];
  var itemId = updatedItem._id;
  var stepVal = updatedItem.stepVal;
  state.items[itemIndex].currentAmount += stepVal;

  var settings = {
    type: 'PUT',
    url: '/users/' + username + '/items/' + itemId,
    data: updatedItem,
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  $.ajax(settings)
  .done(function(data) {
    console.log(data);
    state.items[itemIndex] = data.updatedItem;
    callback(state.items);
  })
  .fail(function(err) {
    console.log('there was an error adding a new item.');
    console.log('error:', err);
  });
}

function listenForIncrementorClick() {
  $('.js-itemsRow').on('click', '.js-incrementor', function(event) {
      var itemIndex = $(event.target).data('cardnum');
      incrementItem(state.username, itemIndex, renderItems);
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

// TODO: validate inputs
// check content lengths, types, required
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

/**
 * makes POST request to send new item data
 * pass new item data to renderItem
 * @param {function} callback 
 */
function addItem(username, callback) {
  var newItem = getNewItemData();

  var settings = {
    type: 'POST',
    url: '/users/' + username + '/items',
    data: newItem,
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  $.ajax(settings)
  .done(function(data) {
    console.log(data);
    state.items.unshift(data.newItem);
    callback(state.items);
  })
  .fail(function(err) {
    console.log('there was an error adding a new item.');
    console.log('error:', err);
  });
  
}

function listenForAddItem() {
  $('.js-addItemButton').click(function(event) {
    event.preventDefault();
    addItem(state.username, renderItems);
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
  state.username = getUsername();
  
  getItems(state.username, renderItems);

  listenForAddItem();
  listenForDecrementorClick();
  listenForIncrementorClick();
  listenForDeleteClick();
  listenForListItemClick();
});

}());