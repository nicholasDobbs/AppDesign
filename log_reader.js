var table_elem = document.getElementById( "the_data" );
var address_location = document.getElementById( "address_location" );
var time_stamp_location = document.getElementById( "time_stamp_location")
var sel_elem = document.getElementById( 'selector' );
var contents_elem = document.getElementById( 'contents' );

function readTheFile()
{
    console.log( sel_elem.files[ 0 ] );
    // making an instance of the library class FileReader
    var reader = new FileReader();

    // When the file read is finished, call fileReadFinished
    reader.onload = fileReadFinished;

    // Start reading the file
    reader.readAsText( sel_elem.files[ 0 ] );

    console.log( "Reading..." );
}

function fileReadFinished( evt )
{
    var reader = evt.target;
    var content = reader.result;
    var lines = content.match( /^.*((\r\n|\n|\r)|$)/gm );

    var address_pattern = /(\d*\.\d*\.\d*\.\d*)/g;
    var time_stamp_pattern = /\[\d{2}\/\b\w{3}\b\/\d{4}.\d{2}.\d{2}.\d{2}\s[-]\d{4}\]/g;

    var time_stamp_data = content.match(time_stamp_pattern);
    var address_data = content.match(address_pattern);

    time_stamp_data = String(time_stamp_data);
    address_data = String(address_data);

    time_stamp_data_split_array = time_stamp_data.split(",");
    address_data_split_array = address_data.split(",");

    console.log(time_stamp_data_split_array)
    console.log(address_data_split_array)

    for( var i = 0; i < lines.length; i++ )
    {
      var address_row_location = document.createElement( 'tr' );
      var time_stamp_row_location = document.createElement( 'tr' );
      var address_cell_location = document.createElement( 'td' );
      var time_stamp_cell_location = document.createElement( 'td' );

      address_cell_location.innerHTML = address_data_split_array[i]
      time_stamp_cell_location.innerHTML = time_stamp_data_split_array[i]

      address_row_location.appendChild( address_cell_location );
      time_stamp_row_location.appendChild( time_stamp_cell_location );

      table_elem.appendChild( address_row_location );
      table_elem.appendChild( address_cell_location) ;
      table_elem.appendChild( time_stamp_cell_location );
    }
}
