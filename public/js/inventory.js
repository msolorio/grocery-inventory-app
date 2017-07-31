
(function() {
///////////////////////////////////////////////
// STATE
///////////////////////////////////////////////
// set to window for dev
window.state = {
  currentView: 'inventory',
  username: '',
  items: []
};

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// INVENTORY SCREEN
///////////////////////////////////////////////////////////

function renderView(viewToShow) {
    $('.js-addItem').css('display', 'none');
    $('.js-inventory').css('display', 'none');
    $('.js-lists').css('display', 'none');

    switch(viewToShow) {
      case 'lists':
        generateLists(renderLists);
        break;
      case 'inventory':
        getItems(state.username, renderItems);
        break;
    }

    $('.js-' + viewToShow).css('display', 'block');
}

/**
 * Returns username from url
 */
function getUsername() {
  var path = location.pathname;
  var pathArray = path.split('/');
  return pathArray[pathArray.length - 1];
}

function renderItems(items) {

  var result = items.reduce(function(resultStr, item, index) {
    return resultStr + (
      '<div class="col col-card">' +
        '<div class="card">' +
          '<div class="remove js-remove" data-cardnum=' + index + '>X</div>' +
          '<h3 class="itemName">' + item.itemName + '</h3>' +
          '<div class="imageContainer">' +
          // '<img class="image" src=' + item.image + ' alt="" title=""/>' +
          '</div>' +
          '<div class="amountChanger">' +
            '<div class="amountContainer">' +
              '<div class="amount">' +
                '<span class="js-currentAmount-' + index + '">' + item.currentAmount + ' </span>' +
                '<span>/ </span>' +
                '<span>' + item.targetAmount + ' </span>' +
              '</div>' +
              '<div>' +
                item.unitName +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="amountArrows">' +
            '<div class="decrementor js-decrementor" data-cardnum=' + index + '>' +
              '&#10094;' +
            '</div>' +
            '<div class="incrementor js-incrementor" data-cardnum=' + index + '>' +
              '&#10095;' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }, '');

  $('.js-itemsRow').html(result);
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

function renderItemAmount(itemIndex, updatedAmount) {
  $('.js-currentAmount-' + itemIndex).html(updatedAmount + ' ');
}

function updateItemInServer(username, itemIndex) {

  var updateItem = state.items[itemIndex];
  var itemId = updateItem._id;

  var settings = {
    type: 'PUT',
    url: '/users/' + username + '/items/' + itemId,
    data: state.items[itemIndex],
    dataType: 'json',
    async: true,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  $.ajax(settings)
    .done(function(data) {
      state.items[itemIndex] = data.updatedItem;
      state.items[itemIndex].clickVal = 0;
    })
    .fail(function(err) {
      console.log('there was an error updating your item.');
      console.log('error:', err);
      var originalClickVal = state.items[itemIndex].clickVal;
      renderItemAmount(itemIndex,
        (state.items[itemIndex].currentAmount - (stepVal * originalClickVal)));
    });
}

function renderItemDecrement(itemIndex) {
  var updateItem = state.items[itemIndex];
  var updatedAmount = state.items[itemIndex].currentAmount -= updateItem.stepVal;
  state.items[itemIndex].clickVal--;
  renderItemAmount(itemIndex, updatedAmount);
}

function renderItemIncrement(itemIndex) {
  var updateItem = state.items[itemIndex];
  var updatedAmount = state.items[itemIndex].currentAmount += updateItem.stepVal;
  state.items[itemIndex].clickVal++;
  renderItemAmount(itemIndex, updatedAmount);
}

function removeItem(username, itemIndex, callback) {
  var itemToRemove = state.items[itemIndex];
  var itemId = itemToRemove._id;

  var settings = {
    type: 'DELETE',
    url: '/users/' + username + '/items/' + itemId,
    dataType: 'json'
  }

  $.ajax(settings)
    .done(function(data) {
      state.items = data.items;
      callback(state.items);
    })
    .fail(function(err) {
      console.log('there was an error adding a new item.');
      console.log('error:', err);
    });
}

///////////////////////////////////////////////
// UTILITY FUNCTIONS
///////////////////////////////////////////////
function parseDecimal(string) {
  return Math.round(parseFloat(string) * 100) / 100;
}

function makeCapitalCase(string) {
  var wordsArray = string.split(' ');
  var capitalCaseWordsArray = wordsArray.map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalCaseWordsArray.join(' ');
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
  newItem.itemName = makeCapitalCase($('.js-itemName').val() || 'Anonymous Item');
  newItem.targetAmount = parseDecimal($('.js-targetAmount').val() || 5);
  newItem.currentAmount = newItem.targetAmount;
  newItem.stepVal = parseDecimal($('.js-stepVal').val() || 1);
  newItem.unitName = ($('.js-unitName').val() || 'units').toLowerCase();
  newItem.location = makeCapitalCase($('.js-location').val() || 'general');
  newItem.image = 'images/salad.svg';
  newItem.clickVal = 0;

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
function addItem(username, renderItem) {
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
    state.items.unshift(data.newItem);
    renderItems(state.items);
    renderView('inventory');
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
      '<div class="listItem js-listItem" data-itemname="' + item.itemName +'"' +
        ' data-itemId="' + item._id + '">' +
        '<div class="itemName">' + item.itemName + '</div>' +
        '<div class="cross js-remove" data-listitemnum="' + index + '" data-location="' + list.location + '">&#10799;</div>' +
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
    if (Math.round(item.targetAmount - item.currentAmount) <= 0) {
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
      amountNeeded: Math.round(item.targetAmount - item.currentAmount),
      unitName: item.unitName,
      stepVal: item.stepVal,
      _id: item._id
    }

    lists[item.location].items.push(newItem);

    return lists;
  }, {});

  state.lists = listsArray;

  renderLists(state.lists);
}

function checkOffListItem(listItemLocation, listItemNum) {
  var listItem = state.lists[listItemLocation].items[listItemNum];
  var checkedItemId = listItem._id;
  var amountPurchased = listItem.amountNeeded;

  state.lists[listItemLocation].items.splice(listItemNum, 1);

  var itemIndex;
  state.items.forEach(function(item, index) {
    if (item._id === checkedItemId) {
      itemIndex = index;
      state.items[index].currentAmount += amountPurchased;
    }
  });

  generateLists(renderLists);

  updateItemInServer(state.username, itemIndex);
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// EVENT LISTENERS
///////////////////////////////////////////////////////////////////////////
function listenForListItemClick() {
  $('.js-listsRow').on('click', '.js-remove', function(event) {
      event.target = this;

    var listItemNum = $(event.target).data('listitemnum');
    var listItemLocation = $(event.target).data('location');

    checkOffListItem(listItemLocation, listItemNum);
  });
}

function listenForNavButtonClick() {
  $('.js-navButton').click(function(event) {
    var viewClicked = $(event.target).data('view');
    renderView(viewClicked);
  });
}

function listenForDeleteClick() {
  $('.js-itemsRow').on('click', '.js-remove', function(event) {
    var itemIndex = $(event.target).data('cardnum');
    removeItem(state.username, itemIndex, renderItems);
  });
}

function listenForDecrementorClick() {
  var itemIndexes = {};

  $('.js-itemsRow').on('click', '.js-decrementor', function(event) {
      var itemIndex = $(event.target).data('cardnum');
      itemIndexes[itemIndex] = 0;
      renderItemDecrement(itemIndex);
  });

  $('.js-itemsRow').on('click', '.js-decrementor', $.debounce(1000, function(event) {
      for (var itemIndex in itemIndexes) {
        updateItemInServer(state.username, itemIndex);
      }
      itemIndexes = {};
  }));
}

function listenForIncrementorClick() {
  var itemIndexes = {};

  $('.js-itemsRow').on('click', '.js-incrementor', function(event) {
    var itemIndex = $(event.target).data('cardnum');
    itemIndexes[itemIndex] = 0;
    renderItemIncrement(itemIndex);
  });

  $('.js-itemsRow').on('click', '.js-incrementor', $.debounce(1000, function(event) {
    for (var itemIndex in itemIndexes) {
      updateItemInServer(state.username, itemIndex);
    }
    itemIndexes = {};
  }));
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

  // getItems(state.username, renderItems);
  renderView('inventory');
  listenForNavButtonClick();
  listenForAddItem();
  listenForDecrementorClick();
  listenForIncrementorClick();
  listenForDeleteClick();
  listenForListItemClick();
});

}());