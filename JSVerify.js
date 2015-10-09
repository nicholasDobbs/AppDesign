var jsc = require( 'jsverify' );

console.log( "Running the Boolean test:" );
// forall (f: json -> bool, b: bool), f (f (f b)) ≡ f(b).
var boolFnAppliedThrice =
    jsc.forall( "bool -> bool", "bool",
        function( f, b )
        {
            return f( f( f( b ) ) ) === f( b );
        }
    );
jsc.assert( boolFnAppliedThrice );
console.log( "... OK, passed 100 tests" );

function arraysEqual( a1, a2 )
{
    try {
        if( a1.length !== a2.length )
            return false;
        for( var i = 0; i < a1.length; i++ )
        {
            if( a1[i] !== a2[i] )
                return false;
        }
        return true;
    }
    catch( exp ) {
        return false;
    }
}

console.log( "Running the sort idempotent test:" );
// forall (f: string -> nat, arr: array string),
// sortBy(sortBy(arr, f), f) ≡ sortBy(arr, f).
var sortIdempotent =
    jsc.forall( "array string",
        function( arr )
        {
            var arr_copy = arr.slice();
            arr.sort();
            arr_copy.sort().sort()
            return arraysEqual( arr, arr_copy );
    } );
jsc.assert( sortIdempotent );
console.log( "... OK, passed 100 tests" );


console.log( "Running the lengths equal test:" );
console.log( "Write a test that returns true if sorting doesn't change an array's length" );
var sortLength =
    jsc.forall( "array string",
        function( arr )
        {
          var arr_copy = arr.slice();
          arr.sort();
          arr_copy.sort();

          if( arr.length === arr_copy.length )
            {
              return true;
            }

          else
            {
              return false;
            }
        }

          //var arr_copy_length = arr_copy.length
          //var arr_length = arr.length

          //if( arr_length = arr_copy_length )
            //{
              //return true
            //}

          //else
          //{
            //return false;
          //}

        } );
jsc.assert( sortLength );
console.log( "... OK, passed 100 tests" );


console.log( "Running the in-order test:" );
console.log( "Write a test that returns true the elements of the sorted array are in order" );
var sortInOrder =
    jsc.forall( "array string",
        function( arr )
        {
          var arr_copy = arr.slice()
          arr_copy.sort()
          for( var i = 1; i < arr_copy.length; i++ )
            {
              if( arr_copy[i-1] > arr_copy[i] )
                {
                  return false;
                }
            }
            return true;
          //for( var i = 0; i < arr.length; i++ )
          //{
            //if( arr[i] = arr_copy[i] )
              //{
                //return true;
              //}
            //else
              //{
                //return false;
              //}
          //}

        } );
jsc.assert( sortInOrder );
console.log( "... OK, passed 100 tests" );


console.log( "Running the add/remove test:" );
console.log( "Write a test that returns true if every element that appears somewhere in the sorted array appears somewhere in the unsorted array and vice-versa" );
var sortAddRemove =
    jsc.forall( "array string",
        function( arr )
        {
          var match = 0
          var arr_copy = arr.slice();
          arr_copy.sort();
          for( var i = 0; i < arr.length; i ++ )
            {
              arr_var = arr[i];
              for( var j = 0; j < arr_copy.length; j++ )
                {
                  if( arr[i] = arr_copy[j] )
                    {
                      match++
                      arr_copy.splice( 1, j )
                    }
                }
            }
          if( match = arr.length )
            {
              return true;
            }
          else
            {
              return false;
            }

        } );
jsc.assert( sortAddRemove );
console.log( "... OK, passed 100 tests" );


console.log( "Running the sort number of copies test:" );
console.log( "Write a test that returns true if the number of copies of a particular value \
              in the unsorted array is the same as the number of copies of that value in the sorted array." );
var sortNumCopies =
    jsc.forall( "array string",
        function( arr, i )
        {
          var arr_copy = arr.splice();
          arr_copy.sort();
          i = i % arr.length;
          orig_ct = 0;
          sort_ct = 0;

          for( j = 0; j < arr.length; j++ )
            {
              if( arr[j] === arr[i] )
                {
                  orig_ct++
                }
              if( arr_copy[j] === arr[i] )
                {
                  sort_ct++
                }
            }
          if( orig_ct === sort_ct )
            {
              return true;
            }
          else
            {
              return false;
            }

        } );
jsc.assert( sortNumCopies );
console.log( "... OK, passed 100 tests" );
