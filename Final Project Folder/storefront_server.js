var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();

var cart = [];

function getFormValuesFromURL( url )
{
    var kvs = {};
    var parts = url.split( "?" );
    var key_value_pairs = parts[1].split( "&" );
    for( var i = 0; i < key_value_pairs.length; i++ )
    {
        var key_value = key_value_pairs[i].split( "=" );
        kvs[ key_value[0] ] = key_value[1];
    }
    console.log( "kvs: ", kvs );
    return kvs;
}

function addToCart( req, res )
{
  console.log( "ADDING ITEM(S) TO CART" )
  var kvs = getFormValuesFromURL( req.url )
  cart.push( kvs );
  var db = new sql.Database( 'eCommerce.sqlite' );
  var itemID = kvs[ 'itemID' ];
  var quantity = kvs[ 'quantity' ];
  var size = kvs[ 'size' ];
  console.log( "WORKING..." )

  db.run( "INSERT INTO cart(COIID, quantity, size) VALUES( ?, ?, ? )", itemID, quantity, size,
  function( err ) {
      if( err === null )
      {
        console.log( err );
        console.log( "Cart Updated!" );
        console.log( "cart: ", cart );
        console.log( "ITEM(S) ADDED" );
        resp_text = "<html><body>Item added to cart.<br><a href='storefront.html'>Continue Shopping</a> or <a href='show_cart'>view cart.</a></body></html>"
        res.end( resp_text );
      }
      else
      {
        console.log( err );
        console.log( "Current Order Failed To Update!" );
        resp_text = "<html><body>Item failed to add to cart.<br><a href='storefront.html'>Continue Shopping</a></body></html>"
        res.end( resp_text );
      }
    } );
}

function showCart( arr, req, res )
{
  console.log( "SHOWING CART" );
  console.log( "cart: ", cart );

  var db = new sql.Database( 'eCommerce.sqlite' );

  db.all( "SELECT storeInventory.SIID, storeInventory.ProductName, storeInventory.Price, storeInventory.Category,  \
                  cart.COIID, cart.quantity, cart.size \
           FROM cart \
           INNER JOIN storeInventory ON cart.COIID = storeInventory.SIID",
        function( err, rows )
          {
            if( err !== null )
            {
              console.log( err );
            }
            res.writeHead( 200 );
            resp_text = "<html><body><table border='5'><tbody><tr><td><b>Product Name</b></td><td><b>Quantity Ordered</b></td> \
                                                        <td><b>Size</b></td><td><b>Price per Item</b></td><td><b>Category</b></td></tr>"

            for( var i = 0; i < rows.length; i++ )
            {
              console.log( "GENERATING TABLE...");
              resp_text += "<tr><td>" + rows[i].ProductName;
              resp_text += "</td><td>" + rows[i].quantity;
              resp_text += "</td><td>" + rows[i].size;
              resp_text += "</td><td>" + rows[i].Price;
              resp_text += "</td><td>" + rows[i].Category + "</td></tr>";
            }

            resp_text += "</tbody></table><br> \
                                  <a href='checkout'>Continue to checkout</a> \
                                  or \
                                  <a href='storefront.html'>continue shopping.</a>\
                                  </body></html>"
            res.end( resp_text );
            console.log( "FINISHED LOOP" );
          } );
}

function checkout( req, res )
{
  console.log( "CHECKING OUT" );
  var db = new sql.Database( 'eCommerce.sqlite' );

  db.all( "SELECT cart.quantity, storeInventory.Price, storeInventory.SIID, storeInventory.ProductName,  \
                  cart.size, cart.COIID \
           FROM cart \
           INNER JOIN storeInventory ON cart.COIID = storeInventory.SIID",
           function( err, rows )
             {
               if( err !== null )
               {
                 console.log( err );
               }
               res.writeHead( 200 );
               resp_text = "<html><head><script> \
                                    function disableButton() \
                                      { \
                                        window.setTimeout(function(){ document.getElementById('submit_order_button').disabled = 'true' }, 50)\
                                      } \
                                  </script></head> \
                            <body><table border='5'><tbody><tr><td><b>Product Name</b></td><td><b>Quantity Ordered</b></td> \
                                                           <td><b>Size</b></td><td><b>Subtotal</b></td></tr>"

               var total = 0;
               for( var i = 0; i < rows.length; i++ )
               {
                 console.log( "GENERATING TABLE...");
                 resp_text += "<tr><td>" + rows[i].ProductName;
                 resp_text += "</td><td>" + rows[i].quantity;
                 resp_text += "</td><td>" + rows[i].size;
                 rows[i].itemPrice = rows[i].quantity * rows[i].Price;
                 resp_text += "</td><td>" + rows[i].itemPrice + "</td></tr>";
                 total += rows[i].itemPrice;
                 console.log( rows[i].Total, rows[i].quantity, rows[i].Price );
               }
               resp_text += "<tr><td colspan='3'></td><td>Final Price<br><hr>" + total + "</td></tr>"
               resp_text += "</tbody></table><br> \
                             <form> \
                             This is your final order. To place your order, please fill out the fields below and submit \
                             or <a href='storefront.html'>return to main page</a> <br> \
                             <input type='text' name='firstname' value='Firstname'></input> <br> \
                             <input type='text' name='lastname' value='Lastname'></input> <br> \
                             <input type='number' name='creditCardNum' value='123456789123456'></input> <br> \
                             <input type='text' name='address' value='Address'></input> <br>\
                             <input onclick='disableButton()' type='submit' name='submit_order' value='Submit' id='submit_order_button'></input> \
                             </form> \
                             </body></html>"
               res.end( resp_text );
               console.log( "FINISHED LOOP" );
               cart.push(total);
               return total;
             } );

}

function addToCustomerInformation( req, res )
{
  console.log( "PLACED THE ORDER" );
  var kvs = getFormValuesFromURL( req.url );
  var db = new sql.Database( 'eCommerce.sqlite' );
  var firstname = kvs[ 'firstname' ];
  var lastname = kvs[ 'lastname' ];
  var creditCardNum = kvs[ 'creditCardNum' ];
  var address = kvs[ 'address' ];
  console.log( "WORKING..." );

  db.run( "INSERT INTO customerInformation(firstname, lastname, creditCardNum, address) VALUES( ?, ?, ?, ? )", firstname, lastname, creditCardNum, address,
  function( err ) {
      if( err === null )
      {
        console.log( err );
        console.log( "Customer Information Added!" );
        console.log( "DATA ADDED" );
        resp_text = "<html><body>Thank you for your purchase.<br><a href='storefront.html'>Back to main.</a></body></html>"
        res.end( resp_text );
      }
      else
      {
        console.log( err );
        console.log( "Current Order Failed To Update!" );
        resp_text = "<html><body>Something went wrong with the order, please try again.<br><a href='storefront.html'>Back to main.</a></body></html>"
        res.end( resp_text );
      }

      populateOrders( req, res );
    } );
}

function populateOrders( req, res )
{
  console.log( "FIRING THE LASER" )
  var db = new sql.Database( 'eCommerce.sqlite' );

  db.all( "INSERT INTO orders (customerID)  \
           SELECT customerID FROM customerInformation",
         function( err ) {
           if( err === null )
           {
             console.log( "ORDERS TABLE UPDATED" )
           }
           else
           {
             console.log( err );
             console.log( "ORDERS TABLE FAILED TO UPDATE" );
           }

         });

  db.all( "INSERT INTO itemOrdered(orderID, SIID, quantity, size) \
           SELECT orders.orderID, cart.COIID, cart.quantity, cart.size FROM cart, orders",
        function( err ) {
          if( err === null )
          {
            console.log( "ITEM ORDERED TABLE UPDATED" );
          }
          else
          {
            console.log( err )
            console.log( "ITEM ORDERED TABLE FAILED TO UPDATE" );
          }

        });

  db.all( "DELETE FROM cart \
           WHERE cart.COIID > 0",
        function( err ) {
          if( err === null )
          {
            console.log( "CART CLEANED" )
          }
          else
          {
            console.log( err )
            console.log( "ERROR CLEANING CART")
          }
          resp_text = "<html><body>Your order has been placed. Thank you for your business.<a href='storefront.html'>Return to main?</a></body></html>"
          res.end( resp_text )
        });
}

function server_fun( req, res )
{
    if( req.url === "/" || req.url === "/storefront.html" )
    {
        req.url = "/storefront.html";
    }

    var filename = "./" + req.url;
    try {
        var contents = fs.readFileSync( filename );
        res.writeHead( 200 );
        res.end( contents );
    }

    catch( exp ) {
      console.log( req.url )
      if( req.url.indexOf( "shirts_page.html?" ) >= 0 )
        {
          addToCart( req, res );
        }
      if( req.url.indexOf( "pants_page.html?" ) >= 0 )
        {
          addToCart( req, res );
        }
      if( req.url.indexOf( "jackets_page.html?" ) >= 0 )
        {
          addToCart( req, res );
        }
      if( req.url.indexOf( "hats_page.html?" ) >= 0 )
        {
          addToCart( req, res );
        }
      if( req.url.indexOf( "underwear_page.html?" ) >= 0 )
        {
          addToCart( req, res );
        }
      if( req.url.indexOf( "socks_page.html?" ) >= 0 )
        {
          addToCart( req, res );
        }
      if( req.url.indexOf( "shoes_page.html?" ) >= 0 )
        {
          addToCart( req, res );
        }
      if( req.url.indexOf( "/show_cart" ) >= 0 )
        {
          showCart( cart, req, res );
        }
      if( req.url.indexOf( "/checkout" ) >= 0 )
        {
          checkout( req, res );
        }
      if( req.url.indexOf( "/checkout?") >= 0 )
        {
          addToCustomerInformation( req, res );
        }
      //else
        //{
            //console.log( "SHIT'S FUCKED, BRUV" )
            //console.log( exp );
            //res.writeHead( 404 );
            //res.end( "Cannot find file: "+filename );
        //}
    }
}

var server = http.createServer( server_fun );

server.listen( 8080 );
