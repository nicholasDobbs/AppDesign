var sql = require( 'sqlite3' );
var fs = require( 'fs' );
var http = require( 'http' );

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
    return kvs
}

function server_fun( req, res )
{
  try {
        var filename = "./" + req.url;

        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
      } catch( exp ) {

        if ( req.url.indexOf( "show_table_of_input_range" ) >= 0 )
          {
            console.log( "GOT TO INPUT RANGE BRANCH" );

            var db = new sql.Database( 'telluride.sqlite' );

            var kvs = getFormValuesFromURL( req.url );

            time_1 = kvs['time_1'].split('%3A');
            time_1_string = time_1.toString().replace( ",", "" );
            time_1_int = parseInt( time_1_string );
            console.log( "time_1_int: ", time_1_int );

            if( time_1_int <= 1260 && time_1_int >= 1200 )
            {
              time_1_int = 0;
            }


            time_2 = kvs['time_2'].split('%3A');
            time_2_string = time_2.toString().replace( ",", "" );
            time_2_int = parseInt( time_2_string );
            console.log( "time_2_int: ", time_2_int );

            if( time_2_int <= 1260 && time_2_int >= 1200 )
            {
              time_2_int = 0;
            }


            db.all( "SELECT Performances.Time, Performers.Name as Perfname, Stages.Name as Stagename \
                     FROM Performances INNER JOIN Performers ON Performances.PID = Performers.ID \
                     JOIN Stages ON Performances.SID = Stages.ID",

                  function( err, rows )
                {
                  if( err !== null )
                  {
                    console.log( err );
                  }

                  console.log( "GOT TO SELECT FUNCTION")
                  res.writeHead( 200 )
                  resp_text = "<html><body><table><tbody>";

                  for( var i = 0; i < rows.length; i++ )
                  {
                    time = rows[i].Time.split(':');

                    time_string = time.toString().replace(",","");

                    time_int = parseInt( time_string );
                    console.log( time_int )

                    if( time_1_int < time_int && time_int < time_2_int )
                    {
                      console.log( "GENERATING TABLE...")
                      resp_text += "<tr><td>" + rows[i].Time;
                      resp_text += "</td><td>" + rows[i].Perfname;
                      resp_text += "</td><td>" + rows[i].Stagename + "</td></tr>";
                      console.log( resp_text );
                    }
                  }
                  console.log( "EXITED LOOP" )
                  resp_text += "</tbody></table></body></html>"
                  res.end( resp_text );
                  console.log( "FINISHED LOOP" )
                } );

         }

        if( req.url.indexOf( "get_performer_info?" ) >= 0 )
         {
             var kvs = getFormValuesFromURL( req.url );
             var db = new sql.Database( 'telluride.sqlite' );
             console.log( kvs['perf_id'] );
             db.all( "SELECT * FROM Performers WHERE Name = ?",
                     kvs['perf_id'],
             // db.all( "SELECT * FROM Performers",
                     function( err, rows ) {
                         if( err )
                         {
                             res.writeHead( 200 );
                             res.end( "ERROR: " + err );
                         }
                         else
                         {
                             res.writeHead( 200 );
                             var response_text = "<html><body>"+rows.length+"<table><tbody>";
                             for( var i = 0; i < rows.length; i++ )
                             {
                                 response_text += "<tr><td>" + rows[i].Name +
                                     "</td><td>"+rows[i].GroupSize+"</td></tr>";
                             }
                             response_text += "</tbody></table></body></html>";
                             res.end( response_text );
                         }
                     } );
          }

        //else
          //{
            //res.writeHead( 404 );
            //res.end( "Error!" );
          //}
      }

}

var server = http.createServer( server_fun );

server.listen( 8080 );
