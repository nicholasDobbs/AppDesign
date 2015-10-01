var sel_elem = document.getElementById( 'selector' );

function readTheFile()
{
  console.log( sel_elem.files[0] );
  var reader = new FileReader();
  reader.onload = fileReaderFinished;
  reader.readAsText( sel_elem.files[0] );
}

function fileReaderFinished( evt )
{
  var reader = evt.target;
  console.log( reader.result );
}
