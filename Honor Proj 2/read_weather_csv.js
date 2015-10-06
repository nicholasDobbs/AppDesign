var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();
var db = new sql.Database( 'weather.sqlite' );

var contents_lines_split = [];

if( process.argv.length < 3 )
{
  console.log( "Usage: Need a filename." );
  process.exit( 1 );
}

var filename = process.argv[ 2 ];

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
var contents_lines = contents.split( /\r\n|\n|\r/ );

for( var i = 0; i < contents_lines.length; i++ )
{
  contents_lines[i] = contents_lines[i].trim();
  contents_lines_split.push(contents_lines[i].split( "," ));
}

var loadData = putDataInTable();

function putDataInTable()
{
  for( var i = 1; i < contents_lines_split.length - 1; i++ )
  {
    var values = "("
    values += "'" + contents_lines_split[i][0] + "',";  // 1
    values += "'" + contents_lines_split[i][1] + "',";  // 2
    values += "'" + contents_lines_split[i][2] + "',";  // 3
    values += "'" + contents_lines_split[i][3] + "',";  // 4
    values += "'" + contents_lines_split[i][4] + "',";  // 5
    values += "'" + contents_lines_split[i][5] + "',";  // 6
    values += "'" + contents_lines_split[i][6] + "',";  // 7
    values += "'" + contents_lines_split[i][7] + "',";  // 8
    values += "'" + contents_lines_split[i][8] + "',";  // 9
    values += "'" + contents_lines_split[i][9] + "',";  // 10
    values += "'" + contents_lines_split[i][10] + "',"; // 11
    values += "'" + contents_lines_split[i][11] + "',"; // 12
    values += "'" + contents_lines_split[i][12] + "',"; // 13
    values += "'" + contents_lines_split[i][13] + "',"; // 14
    values += "'" + contents_lines_split[i][14] + "')"; // 15

    db.run( "INSERT INTO weatherData ( TimeMDT, TimeOfDay, TemperatureF, DewPointF, Humidity, SeaLevelPressureIn, VisibilityMPH, WindDirection, \
                                       WindSpeedMPH, GustSpeedMPH, PrecipitationIn, Events, Conditions, WindDirDegrees, DateUTC ) VALUES " + values );

  }
}

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

        if ( req.url.indexOf( "add_data?" ) >= 0 )
          {
            var db = new sql.Database( 'weather.sqlite' );

            var kvs = getFormValuesFromURL( req.url );
            var values = "("
            values += "'" + kvs['TimeMDT'] + "',";
            values += "'" + kvs['TimeOfDay'] + "',";
            values += "'" + kvs['TemperatureF'] + "',";
            values += "'" + kvs['DewPointF'] + "',";
            values += "'" + kvs['Humidity'] + "',";
            values += "'" + kvs['SeaLevelPressureIn'] + "',";
            values += "'" + kvs['VisibilityMPH'] + "',";
            values += "'" + kvs['WindDirection'] + "',";
            values += "'" + kvs['WindSpeedMPH'] + "',";
            values += "'" + kvs['GustSpeedMPH'] + "',";
            values += "'" + kvs['PrecipitationIn'] + "',";
            values += "'" + kvs['Events'] + "',";
            values += "'" + kvs['Conditions'] + "',";
            values += "'" + kvs['WindDirDegrees'] + "',";
            values += "'" + kvs['DataUTC'] + "')";

            db.run( "INSERT INTO weatherData ( TimeMDT, TimeOfDay, TemperatureF, DewPointF, Humidity, SeaLevelPressureIn, VisibilityMPH, WindDirection, \
                                               WindSpeedMPH, GustSpeedMPH, PrecipitationIn, Events, Conditions, WindDirDegrees, DateUTC ) VALUES " + values,
                                                  function( err ){
                                                    res.writeHead( 200 );
                                                    res.end( "Data Added" + err )
                                                  } );
          }

        else if ( req.url.indexOf( "show_table?" ) >= 0 )
          {
            var db = new sql.Database( 'weather.sqlite' );

            db.all( "SELECT * FROM weatherData",
              function( err, rows )
                {
                  res.writeHead( 200 );
                  resp_text = "<html><body><table><tbody>";


                    for( var i = 0; i < rows.length; i++ )
                      {

                        resp_text += "<tr><td>" + rows[i].TimeMDT;
                        resp_text += "</td><td>" + rows[i].TimeOfDay;
                        resp_text += "</td><td>" + rows[i].TemperatureF;
                        resp_text += "</td><td>" + rows[i].DewPointF;
                        resp_text += "</td><td>" + rows[i].Humidity;
                        resp_text += "</td><td>" + rows[i].SeaLevelPressureIn;
                        resp_text += "</td><td>" + rows[i].VisibilityMPH;
                        resp_text += "</td><td>" + rows[i].WindDirection;
                        resp_text += "</td><td>" + rows[i].WindSpeedMPH;
                        resp_text += "</td><td>" + rows[i].GustSpeedMPH;
                        resp_text += "</td><td>" + rows[i].PrecipitationIn;
                        resp_text += "</td><td>" + rows[i].Events;
                        resp_text += "</td><td>" + rows[i].Conditions;
                        resp_text += "</td><td>" + rows[i].WindDirDegrees;
                        resp_text += "</td><td>" + rows[i].DateUTC;
                      }

                      resp_text += "</tbody></table></body></html>"
                      res.end( resp_text );

                } );
          }

        else if ( req.url.indexOf( "show_table_of_input_range" ) >= 0 )
          {
            console.log( "GOT TO INPUT RANGE BRANCH" );

            var db = new sql.Database( 'weather.sqlite' );

            var kvs = getFormValuesFromURL( req.url );

            time_1 = kvs['time_1'].split('%3A');
            time_1_string = time_1.toString().replace( ",", "" );
            time_1_int = parseInt( time_1_string );
            console.log( "time_1_int: ", time_1_int );

            time_day_1 = kvs['time_day_1'].toString();
            //console.log( "time_day_1: ", time_day_1 );

            if( time_day_1 === "PM" )
            {
              //console.log( "time_day_1 = AM")
              if( time_1_int <= 1300 )
              {
                //console.log( "time_day_1 + 1200")
                time_1_int = time_1_int + 1200;
              }
              else
              {
                //console.log( "time_day_1 = PM" );
                time_1_int = time_1_int;
              }
            }

            time_2 = kvs['time_2'].split('%3A');
            time_2_string = time_2.toString().replace( ",", "" );
            time_2_int = parseInt( time_2_string );
            console.log( "time_2_int: ", time_2_int );

            time_day_2 = kvs['time_day_2'].toString();
            //console.log( "time_day_2: ", time_day_2 );

            if( time_day_2 === "PM" )
            {
              //console.log( "time_day_2 = AM")
              if( time_2_int <= 1300 )
              {
                //console.log( "time_day_2 + 1200")
                time_2_int = time_2_int + 1200;
              }
              else
              {
                //console.log( "time_day_1 = PM" );
                time_2_int = time_2_int;
              }
            }

            db.all( "SELECT * FROM weatherData",
                  function( err, rows )
                {
                  if( err !== null )
                  {
                    console.log( err );
                    return
                  }
                  console.log( "GOT TO SELECT FUNCTION")
                  res.writeHead( 200 )
                  resp_text = "<html><body><table><tbody>";

                  for( var i = 0; i < rows.length; i++ )
                  {
                    time = rows[i].TimeMDT.split(':');
                    //console.log( "time: ", time )
                    time_string = time.toString().replace(",","");
                    //console.log( "time_string: ", time_string )
                    time_int = parseInt( time_string );
                    //console.log( "time_int: ", time_int )
                    //console.log( "TimeOfDay: ", rows[i].TimeOfDay )
                    if( rows[i].TimeOfDay === "PM" )
                    {
                      //console.log( "TimeOfDay = AM" )
                      if( time_int <= 1300 )
                      {
                        //console.log( "time_int + 1200" )
                        time_int = time_int + 1200
                        console.log( i, time_int)
                      }
                    }
                    else
                    {
                      //console.log( "TimeOfDay = PM")
                      time_int = time_int
                      console.log(i, time_int)
                    }

                    if( time_1_int < time_int && time_int < time_2_int )
                    {
                      console.log( "GENERATING TABLE...")
                      resp_text += "<tr><td>" + rows[i].TimeMDT;
                      resp_text += "</td><td>" + rows[i].TimeOfDay;
                      resp_text += "</td><td>" + rows[i].TemperatureF;
                      resp_text += "</td><td>" + rows[i].DewPointF;
                      resp_text += "</td><td>" + rows[i].Humidity;
                      resp_text += "</td><td>" + rows[i].SeaLevelPressureIn;
                      resp_text += "</td><td>" + rows[i].VisibilityMPH;
                      resp_text += "</td><td>" + rows[i].WindDirection;
                      resp_text += "</td><td>" + rows[i].WindSpeedMPH;
                      resp_text += "</td><td>" + rows[i].GustSpeedMPH;
                      resp_text += "</td><td>" + rows[i].PrecipitationIn;
                      resp_text += "</td><td>" + rows[i].Events;
                      resp_text += "</td><td>" + rows[i].Conditions;
                      resp_text += "</td><td>" + rows[i].WindDirDegrees;
                      resp_text += "</td><td>" + rows[i].DateUTC;
                    }
                  }

                  resp_text += "</tbody></table></body></html>"
                  res.end( resp_text );

                } );

         }

        else
          {
            res.writeHead( 404 );
            res.end( "Error!" );
          }
      }

}

var server = http.createServer( server_fun );

server.listen( 8080 );
