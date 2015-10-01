var list_elem = document.getElementById( "link_Table" );
var new_link_address_elem = document.getElementById( "new_link_address" );
var new_link_text_elem = document.getElementById( "new_link_text" );

var pairs = []

function addPair()
{
  var new_pair_obj = { name: new_link_text_elem.value, address: new_link_address_elem.value };
  new_pair_obj.id="pair_obj"
  pairs.push(new_pair_obj);
  renderTable();
}

function deletePair(table_elem)
{
  var i = table_elem.target.itemIndex;
  pairs.splice(i, 1);
  renderTable();
}

function editPair(table_elem)
{
  var i = table_elem.target.itemIndex;
  pairs.splice(i, 1)

  //var obj_elem = getElementById( "pair_obj" )
  //var text = obj_elem.innerHTML
  //obj_elem.innerHTML = "<textfield>text</textfield>"
  //var textfield = getElementById
  //var inputName = document.createElement( "input" )
  //inputName.setAttribute( 'id', 'editedName')
  //inputName.setAttribute( 'type', 'text' )
  //inputName.setAttribute( 'value', 'Edit Name' )
  //var editedName_elem = document.getElementById( "editedName" )

  //var inputAddress = document.createElement( "input" )
  //inputAddress.setAttribute( 'id', 'editedAddress')
  //inputAddress.setAttribute( 'type', 'text' )
  //inputAddress.setAttribute( 'value', 'Edit Address' )
  //var editedAddress_elem = document.getElementById( "editedAddress" )

  var new_pair_obj_edited = { name: new_link_text_elem.value, address: new_link_address_elem.value }
  pairs.push(new_pair_obj_edited)
  renderTable();
}

function renderTable()
{
  while( list_elem.firstChild != null )
  {
    list_elem.removeChild( list_elem.firstChild );
  }

  for( var i = 0; i < pairs.length; i++ )
    {
      var table_elem = document.createElement( 'tr' );
      table_elem.itemIndex = i;
      table_elem.innerHTML = pairs[i].name + ": " + "<a href='" + pairs[i].address + "'>[Link]</a>";

      btn_elem_del = document.createElement( "input" );
      btn_elem_del.value="Delete";
      btn_elem_del.type="button";
      btn_elem_del.array_index = i;
      btn_elem_del.onclick = deletePair;

      btn_elem_edit_pair = document.createElement( "input" );
      btn_elem_edit_pair.value="Edit Name & Address";
      btn_elem_edit_pair.type="button";
      btn_elem_edit_pair.array_index = i;
      btn_elem_edit_pair.onclick = editPair;

      list_elem.appendChild( btn_elem_edit_pair );
      list_elem.appendChild( btn_elem_del );
      list_elem.appendChild( table_elem );

      //var table_elem_name = document.createElement('tr')
      //table_elem_name.itemIndex = i
      //table_elem_name.innerHTML = pairs[i].name
      //list_elem.appendChild(table_elem_name)

      //var table_elem_address = document.createElement('td')
      //table_elem_address.itemIndex = i
      //table_elem_address.innerHTML = "<a href='" + pairs[i].address + "'>[Link]</a>"
      //list_elem.appendChild(table_elem_address)





    }
}
