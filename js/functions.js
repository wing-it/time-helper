var handleFiles = function( files ) {
  $( "#csvFile" ).hide();
  Papa.parse( files[0], settings );
},
settings = {
  header: true,
  skipEmptyLines: true,
  complete: function( results, file ) {
    var weekHours = 0, monthHours = 0, expectedMonthHours = 0, expectedWeekHours = 0, arrayCounter = 0, totalMonthHours = 0,
        month = new Date( results.data[ 0 ].Date ),
        lastPunchDay = new Date( results.data[ results.data.length - 1 ].Date ).getDate(),
        nextDay = month.getDate(),
        monthLength = new Date( month.getYear(), month.getMonth() + 1, 0 ).getDate(),
        lastDay = new Date( month.getYear(), month.getMonth(), monthLength ).getDay(),
        title = results.data[0].Date.split(' ')[1] + ' ' + results.data[0].Date.split(' ')[3],
        blankDay = function( x, y ) {
          var style = x == ( y-1 ) ? " style='border-right: 1px solid black'" : "";
          return "<div class='dateCell blank'" + style + "></div>";
        },
        dayCell = function( day ) {
          return( "<div id='day" + day + "' class='dateCell'><div class='dateTitle'>" + day + "</div></div>" );
        },
        dayHours = function( x ) {
          return minutes( results.data[ x ].TotalHours.split(':') );
        },
        minutes = function( stringArray ) {
          return ( Number( stringArray[0] ) * 60 ) + Number( stringArray[1] );
        },
        timeString = function( minutes ) {
          return ( Math.floor( minutes / 60 ) + ':' + ( '0' + ( minutes % 60 ) ).slice( -2 ) );
        };

    //console.log( results.data );
    month.setDate( 1 );
    $( '#monthTitle' ).html( title );

    for( let x = 0; x < month.getDay(); x++ ) {
      $( '#calendar' ).append( blankDay( x, month.getDay() ) );
    }
    for( let x = 1; x <= monthLength; x++ ) {
      month.setDate( x );
      $( '#calendar' ).append( dayCell( x ) );
      if( month.getDay() != 6 && month.getDay() != 0 ) {
        if( month.getDate() <= lastPunchDay ) {
          expectedMonthHours += 480;
          expectedWeekHours += 480;
        }
        totalMonthHours += 480;
      } else {
        $( '#day' + x ).addClass( 'weekend' );
      }
      if( ( month.getDate() == nextDay ) && ( arrayCounter < results.data.length ) ) {
        let hours = dayHours( arrayCounter );
        $( '#day' + x ).append( '<p>' + timeString( hours ) + '</p>' );
        weekHours += hours;
        monthHours += hours;
        arrayCounter++;
        nextDay = arrayCounter < results.data.length ? new Date( results.data[arrayCounter].Date ).getDate() : nextDay;
      }
      if( month.getDay() == 6 || month.getDate() == monthLength ) {
        let recapString = "<div class='dateCell recap'><div class='dateTitle'>Week Total</div>";
        recapString += 'Worked: ' + timeString( weekHours ) + '<br>';
        recapString += 'Expected: ' + timeString( expectedWeekHours ) + '<br>';
        recapString += "</div>"
        $( '#calendar' ).append( recapString );
        expectedWeekHours = 0;
        weekHours = 0;
      }
      if( month.getDate() == monthLength ) {
        let recapString = "<div class='dateCell recap'><div class='dateTitle'>Month Total</div>";
        recapString += 'Worked: ' + timeString( monthHours ) + '<br>';
        recapString += 'Expected: ' + timeString( expectedMonthHours ) + '<br>';
        recapString += 'Month: ' + timeString( totalMonthHours ) + '<br>';
        recapString += "</div>"
        $( '#calendar' ).append( recapString );
      }
    }
  }
};
