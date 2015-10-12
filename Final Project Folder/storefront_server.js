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
    console.log( "kvs: ", kvs )
    return kvs
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

  db.run( "INSERT INTO currentOrder(COIID, quantity, size) VALUES( ?, ?, ? )", itemID, quantity, size,
  function( err ) {
      if( err === null )
      {
          console.log( err )
          console.log( "Current Order Updated!" )
          console.log( "cart: ", cart );
          console.log( "ITEM(S) ADDED" );
          resp_text = "<html><body>Item added to cart.<br><a href='storefront.html'>Continue Shopping</a></body></html>"
          res.end( resp_text );
      }
      else
      {
          console.log( err )
          console.log( "Current Order Failed To Update!" )
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
                  currentOrder.COIID, currentOrder.quantity, currentOrder.size \
           FROM currentOrder \
           INNER JOIN storeInventory ON currentOrder.COIID = storeInventory.SIID",
        function( err, rows )
          {
            if( err !== null )
            {
              console.log( err );
            }
            res.writeHead( 200 )
            resp_text = "<html><body><table border='5'><tbody><tr><td><b>Product Name</b></td><td><b>Quantity Ordered</b></td> \
                                                        <td><b>Size</b></td><td><b>Price per Item</b></td><td><b>Category</b></td></tr>"

            for( var i = 0; i < rows.length; i++ )
            {
              console.log( "GENERATING TABLE...")
              resp_text += "<tr><td>" + rows[i].ProductName;
              resp_text += "</td><td>" + rows[i].quantity;
              resp_text += "</td><td>" + rows[i].size;
              resp_text += "</td><td>" + rows[i].Price;
              resp_text += "</td><td>" + rows[i].Category + "</td></tr>";
            }

            resp_text += "</tbody></table><br><a href='checkout'>Continue to checkout!</body></html>"
            res.end( resp_text );
            console.log( "FINISHED LOOP" )
          } );


}

function checkout()
{
  console.log( "CHECKING OUT" );
  var db = new sql.Database( 'eCommerce.sqlite' );

  db.all( "SELECT ")

}

function addToPlacedOrders( req, res )
{

}

function server_fun( req, res )
{
    console.log( "The URL: '", req.url, "'" );

    if( req.url === "/" || req.url === "/storefront.html" )
    {
        req.url = "/storefront.html";
    }

    var filename = "./" + req.url;
    console.log( "filename: ", filename )
    try {
        var contents = fs.readFileSync( filename ).toString();
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
