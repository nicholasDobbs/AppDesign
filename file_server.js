var http = require( 'http' );
var fs   = require( 'fs' );

function server_fun( req, res )
{
  try{
      var filename = req.url.substring(1, req.url.length);
      var fileBuffer = fs.readFileSync( filename );
      var contents = fileBuffer.toString();
      var contents_lines = contents.trim();
      res.writeHead( 200 );
      res.end( contents_lines )
     } catch( err )
      {
        console.log("Invalid Filename!")
      }
}

var server = http.createServer( server_fun );

server.listen( 8080 );
