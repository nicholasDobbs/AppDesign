var fs = require( 'fs' );
var http = require( 'http' );
var sql = require( 'sqlite3' ).verbose();

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

function addStudent( req, res )
{
    console.log( "GOT TO ADD_STUDENT" )
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'Name' ];
    var sandwich = kvs[ 'SandwichPreference' ];
    console.log( "WORKING..." )
    db.run( "INSERT INTO Students(Name, SandwichPreference) VALUES ( ?, ? )", name, sandwich,
            function( err ) {
                if( err === null )
                {
                    console.log( "I'M ALIVE" )
                    res.writeHead( 200 );
                    res.end( "Added student" );
                }
                else
                {
                    console.log( "I'M DEAD" )
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addTeacher( req, res )
{
    console.log( "GOT TO ADD_TEACHER")
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'Name' ];
    console.log( "WORKING..." )
    db.run( "INSERT INTO Teachers(Name) VALUES ( ? )", name,
            function( err ) {
                if( err === null )
                {
                    console.log( "I'M ALIVE" )
                    res.writeHead( 200 );
                    res.end( "Added teacher" );
                }
                else
                {
                    console.log( "I'M DEAD" )
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addCourse( req, res )
{
    console.log( "GOT TO ADD_COURSE" )
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var name = kvs[ 'Name' ];
    console.log( "WORKING..." )
    db.run( "INSERT INTO Courses(Name) VALUES ( ? )", name,
            function( err ) {
                if( err === null )
                {
                    console.log( "I'M ALIVE" )
                    res.writeHead( 200 );
                    res.end( "Added course" );
                }
                else
                {
                    console.log( "I'M DEAD" )
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addEnrollment( req, res )
{
    console.log( "GOT TO ADD_ENROLLMENT" )
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var student = kvs[ 'sid' ];
    var course = kvs[ 'cid' ];
    console.log( "WORKING..." )
    db.run( "INSERT INTO Enrollments(student, class) VALUES ( ?, ? )", student, course,
            function( err ) {
                if( err === null )
                {
                    console.log( "I'M ALIVE" )
                    res.writeHead( 200 );
                    res.end( "Added enrollment" );
                }
                else
                {
                    console.log( "I'M DEAD" )
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function addTeachingAssignment( req, res )
{
    console.log( "GOT TO TEACHING_ASSIGNMENT" )
    var kvs = getFormValuesFromURL( req.url );
    var db = new sql.Database( 'registrar.sqlite' );
    var teacher = kvs[ 'tid' ];
    var course = kvs[ 'cid' ];
    console.log( "WORKING..." )
    db.run( "INSERT INTO TeachingAssignments(teacher, class) VALUES ( ?, ? )", teacher, course,
            function( err ) {
                if( err === null )
                {
                    console.log( "I'M ALIVE" )
                    res.writeHead( 200 );
                    res.end( "Added teaching assignment" );
                }
                else
                {
                    console.log( "I'M DEAD" )
                    console.log( err );
                    res.writeHead( 200 );
                    res.end( "FAILED" );
                }
            } );
}

function server_fun( req, res )
{
    console.log( "The URL: '", req.url, "'" );

    if( req.url === "/" || req.url === "/index.htm" )
    {
        req.url = "/index.html";
    }

    var filename = "./" + req.url;
    console.log( "filename: ", filename )
    try {
        console.log( "GOT TO TRY" )
        var contents = fs.readFileSync( filename ).toString();
        res.writeHead( 200 );
        res.end( contents );
        console.log( "EXITING TRY" )
    }

    catch( exp ) {
      console.log( "GOT INTO CATCH" )
      console.log( req.url )
      if( req.url.indexOf( "add_student?" ) >= 0 )
        {
            console.log( "GOT TO SERVER_FUN.ADD_STUDENT" )
            addStudent( req, res );
        }

      if( req.url.indexOf( "/show_student_data" ) >= 0 )
        {
          console.log( "GOT TO SERVER_FUN.SHOW_STUDENT_DATA")
          var db = new sql.Database( 'registrar.sqlite' );

          db.all( "SELECT * FROM Students",
                function( err, rows )
                  {
                    if( err !== null )
                    {
                      console.log( "I'M DEAD" )
                      console.log( err );
                    }

                    console.log( "GOT TO SELECT FUNCTION")
                    res.writeHead( 200 )
                    resp_text = "<html><body><table><tbody>";

                    for( var i = 0; i < rows.length; i++ )
                    {
                      console.log( "GENERATING TABLE...")
                      resp_text += "<tr><td>" + rows[i].sid;
                      resp_text += "</td><td>" + rows[i].Name;
                      resp_text += "</td><td>" + rows[i].SandwichPreference + "</td></tr>";
                      console.log( resp_text );
                    }

                    resp_text += "</tbody></table></body></html>"
                    res.end( resp_text );
                    console.log( "FINISHED LOOP" )
                  } );
        }

      if( req.url.indexOf( "add_teacher?" ) >= 0 )
        {
          console.log( "GOT TO SERVER_FUN.ADD_TEACHER" )
          addTeacher( req, res );
        }

      if( req.url.indexOf( "/show_teacher_data" ) >= 0 )
        {
          var db = new sql.Database( 'registrar.sqlite' );

          db.all( "SELECT * FROM Teachers",
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
                      console.log( "GENERATING TABLE...")
                      resp_text += "<tr><td>" + rows[i].tid;
                      resp_text += "</td><td>" + rows[i].Name + "</td></tr>";
                      console.log( resp_text );
                    }

                    resp_text += "</tbody></table></body></html>"
                    res.end( resp_text );
                    console.log( "FINISHED LOOP" )
                  } );
        }

      if( req.url.indexOf( "add_course?" ) >= 0 )
        {
          console.log( "GOT TO SERVER_FUN.ADD_COURSE" )
          addCourse( req, res );
        }

      if( req.url.indexOf( "/show_course_data" ) >= 0 )
        {
          var db = new sql.Database( 'registrar.sqlite' );

          db.all( "SELECT * FROM Courses",
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
                      console.log( "GENERATING TABLE...")
                      resp_text += "<tr><td>" + rows[i].cid;
                      resp_text += "</td><td>" + rows[i].Name + "</td></tr>";
                      console.log( resp_text );
                    }

                    resp_text += "</tbody></table></body></html>"
                    res.end( resp_text );
                    console.log( "FINISHED LOOP" )
                  } );
        }

      if( req.url.indexOf( "add_enrollment?" ) >= 0 )
        {
          console.log( "GOT TO SERVER_FUN.ADD_ENROLLMENT" )
          addEnrollment( req, res );
        }

      if( req.url.indexOf( "/show_enrollment_data") >= 0 )
        {
          var db = new sql.Database( 'registrar.sqlite' );

          db.all( "SELECT Enrollments.student, Enrollments.class, Students.Name as sName, Courses.Name as cName \
                   FROM Enrollments \
                   INNER JOIN Students ON Enrollments.student = Students.sid \
                   JOIN Courses ON Enrollments.class = Courses.cid",
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
                      console.log( "GENERATING TABLE...")
                      resp_text += "<tr><td>" + rows[i].sName;
                      resp_text += "</td><td>" + rows[i].cName + "</td></tr>";
                      console.log( resp_text );
                    }

                    resp_text += "</tbody></table></body></html>"
                    res.end( resp_text );
                    console.log( "FINISHED LOOP" )
                  } );
        }

      if( req.url.indexOf( "add_teaching_assignment?" ) >= 0 )
        {
          console.log( "GOT TO SERVER_FUN.ADD_TEACHING_ASSIGNMENT" )
          addTeachingAssignment( req, res );
        }

      if ( req.url.indexOf( "/show_teaching_assignment") >= 0 )
        {
          var db = new sql.Database( 'registrar.sqlite' );

          db.all( "SELECT TeachingAssignments.teacher, TeachingAssignments.class, Teachers.Name as tName, Courses.Name as cName \
                   FROM TeachingAssignments \
                   INNER JOIN Teachers ON TeachingAssignments.teacher = Teachers.tid \
                   JOIN Courses ON TeachingAssignments.class = Courses.cid",
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
                      console.log( "GENERATING TABLE...")
                      resp_text += "<tr><td>" + rows[i].tName;
                      resp_text += "</td><td>" + rows[i].cName + "</td></tr>";
                      console.log( resp_text );
                    }

                    resp_text += "</tbody></table></body></html>"
                    res.end( resp_text );
                    console.log( "FINISHED LOOP" )
                  } );
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
