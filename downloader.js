var http = require( 'http' );
var fs   = require( 'fs' );
var contents_lines_split = []
var url_array = [];
var name_array = [];

if( process.argv.length < 3 )
{
  console.log( "Usage: Need a filename." );
  process.exit( 1 );
}

var filename = process.argv[ 2 ];

console.log( "Reading File: ", filename );

try
{
  var fileBuffer = fs.readFileSync( filename );
}
catch( exp )
{
  console.log( "Failed to read file.", filename );
  process.exit( 2 );
}
var contents = fileBuffer.toString();
var contents_lines = contents.split( '\n' );
// \n matches line feed element
for( var i = 0; i < contents_lines.length; i++ )
{
  contents_lines[i] = contents_lines[i].trim();
  contents_lines_split.push(contents_lines[i].split( " " ));
}

for ( var i = 0; i < contents_lines_split.length - 1; i++ )
{
  var name = contents_lines_split[i][0];
  var url = contents_lines_split[i][1];

  name_array.push(name)
  url_array.push(url)
  //download(url, name, null)
  console.log("name: ", name)
  console.log("url: ", url)
}

function download( url, name, callback )
{
  console.log( "Start downloading!!" );
  var file = fs.createWriteStream( name );

  var request = http.get( url, function( response )
  {
    console.log( "Response: ", response );
    file.on( 'finish', function()
    {
      console.log( "Finished writing." );
    } );
    response.pipe( file );
  } );

    

  request.on( 'error', function( err )
  {
    console.log( "Error!", err );
  } );

  console.log( "Sent request." );
}

for( var i = 0; i < name_array.length; i++ )
{
  console.log(url_array[i])
  console.log(name_array[i])
  download( url_array[i], name_array[i], null );
}

console.log( "Done." );
