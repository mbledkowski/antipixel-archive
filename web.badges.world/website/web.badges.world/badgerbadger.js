//-------------init-----------------//
$( function() {
    $("#accordion").accordion({
      heightStyle: "content"
    }).slideToggle('fast',function(){
      $('#accordion').removeClass('preloader');
    });
    $('#controls').slideToggle('fast',function(){
      $('#controls').removeClass('preloader');
    });
  });

$('.my-float').hover(
    function(){$(this).addClass('rotate')},
    function(){$(this).removeClass('rotate')}
  );

$('.info-button').click(function(){
  $('#accordion').slideToggle();
});
$('.nav-button').click(function(){
  $('#controls').slideToggle();
});



(function(){

  const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var bc = (vw/80)*(vh/15).toFixed(0)  // # of badges that fit viewport!
  var badgeTotal = nojson.length;
  var badgeCount = (bc>960) ? 960 : bc;  // limited by content max-width...
  var buttonFilters = {}; // store filter for each group
  var buttonFilter;
  var qsRegex; // quick search regex
  var badgeCounter = $('.badge-counter');

  //--------------helpers-----------------//  

  // flatten object by concatting values
  function concatValues( obj ) {
    var value = '';
    for ( var prop in obj ) {
      value += obj[ prop ];
    }
    return value;
  }

  function updateCounter(){
    badgeCounter.text('Showing '+ iso.filteredItems.length + ' out of ' + badgeTotal + ' badges');
  }

  //----------------core-----------------//

  var $badges = $('.grid');

  // init isotope
  $badges.isotope({
    itemSelector: '.grid-item',
    layoutMode: 'fitRows',
    stagger: 2,
    transitionDuration: 100,
    filter: function() {
      var $this = $(this);
      var searchResult = qsRegex ? $this.text().match( qsRegex ) : true;
      var buttonResult = buttonFilter ? $this.is( buttonFilter ) : true;
      return searchResult && buttonResult;
    }
  });

  var iso = $badges.data('isotope');

  // init infinite scroll
  $badges.infiniteScroll({
    path: 'page{{#}}',
    loadOnScroll: false,
    itemSelector:'.grid-item',
    outlayer: iso,
    scrollThreshold:300,
  });


  //-------------search/filter--------------//

  // use value of search field to filter
  var $quicksearch = $('.quicksearch').keyup( _.debounce( function() {
    qsRegex = new RegExp( $quicksearch.val(), 'gi' );
    window.scrollTo(0, 0);
    $badges.isotope();
    updateCounter();
  }, 300));



  $('.filters').on( 'click', '.button', function() {
    var $this = $(this);
    // get group key
    var $buttonGroup = $this.parents('.button-group');
    var filterGroup = $buttonGroup.attr('data-filter-group');
    // set filter for group
    buttonFilters[ filterGroup ] = $this.attr('data-filter');
    // combine filters
    buttonFilter = concatValues( buttonFilters );
    // Isotope arrange
    window.scrollTo(0, 0);
    $badges.isotope();
    updateCounter();
  });

  // button is-checked checker
  $('.button-group').each( function( i, buttonGroup ) {
    var $buttonGroup = $( buttonGroup );
    $buttonGroup.on( 'click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $( this ).addClass('is-checked');
    });
  });

  $('.button').mousedown(function(){
    $('.page-load-status').removeClass('preloader');
  })

  $badges.on('arrangeComplete', function(event,filteredItems){
    $('.page-load-status').addClass('preloader');
  });


  //append first screen of badges!
  $(window).on('load',function(){
    var freshBadges = $(nojson.splice(0,badgeCount).join('')); // from nojson.js
    freshBadges.imagesLoaded().always(function(){
      $badges.append(freshBadges).isotope('appended',freshBadges);
      $('.grid-item').removeClass('preloader');
      $('.page-load-status').addClass('preloader');
      $('#loadsplash').addClass('preloader');
      $badges.isotope('shuffle');
      updateCounter();
    });
  });


  // load badges on scroll!
  $(window).on('scrollThreshold.infiniteScroll', _.throttle(function(){
    $('.page-load-status').removeClass('preloader');
    var freshBadges = $(nojson.splice(0,badgeCount).join('')); // from nojson.js
    freshBadges.imagesLoaded(function(){
      $('.page-load-status').addClass('preloader');
      $badges.append(freshBadges).isotope('appended',freshBadges);
      $('.grid-item').removeClass('preloader');
      updateCounter();
    });
  }, 5000));

})();