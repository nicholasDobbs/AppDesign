var list_elem = document.getElementById( "the_list" );
var new_elem = document.getElementById( "new_item_text" );
var new_elem_priority = document.getElementById( "new_item_priority" );

var js_obj1 = { priority: 1, name: "shop" }
var js_obj2 = { priority: 7, name: "homework" }
var js_obj3 = { priority: 15, name: "car" }
var items = [ js_obj1, js_obj2, js_obj3 ];

//target = document.getElementById("test")

function compareToDoItems( item1, item2 )
{
  return item1.priority - item2.priority;
}

function renderList()
{
  items.sort( compareToDoItems )
  while( list_elem.firstChild != null )
  {
    list_elem.removeChild( list_elem.firstChild );
  }

  for( var i = 0; i < items.length; i++ )
    {
      var item_elem = document.createElement( 'li' );
      item_elem.itemIndex = i;
      item_elem.innerHTML = items[i].name + " (" + items[i].priority + ")";
      console.log(item_elem.itemIndex)
      list_elem.appendChild( item_elem );

      if ( items[i].priority <= 5 )
        {
          item_elem.style.color = 'red'
        }

      if ( 5 < items[i].priority && items[i].priority < 10 )
        {
          item_elem.style.color = 'orange'
        }

      if ( items[i].priority > 10 )
        {
          item_elem.style.color = 'green'
        }

      list_elem.onclick = deleteItem;
    }
}

function addItem()
{
  var new_obj = { priority: new_elem_priority.value, name: new_elem.value };
  items.push( new_obj );
  renderList();
}

function deleteItem(list_elem)
{
  var i = list_elem.target.itemIndex;
  console.log(items);
  items.splice(i, 1);
  console.log(items);
  renderList();
}

function pageLoaded()
{
  renderList();
}

function priorityChange()
{
  console.log( new_elem_priority.value );
}
