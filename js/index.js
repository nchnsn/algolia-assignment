


// Algolia client. Mandatory to instantiate the Helper.


var algolia = algoliasearch('P66KPV0B4D', 'd21f68656aa0b122171c8138b26379a5');

// Algolia Helper
var helper = algoliasearchHelper(algolia, 'restaurant_data', {
  // Facets need to be explicitly defined here
  facets: ['food_type', 'stars_count', 'payment_options'],
  // Misc. configuration for the demo purpose 
  hitsPerPage: 5,
  maxValuesPerFacet: 5
});

// Bind the result event to a function that will update the results
helper.on("result", searchCallback);

// The different parts of the UI that we want to use in this example
var $inputfield = $("#search-box");
var $hits = $('#hits');
var $facets = $('#facets');

// When there is a new character input:
// - update the query
// - trigger the search
$inputfield.keyup(function(e) {
  helper.setQuery($inputfield.val()).search();
});

$facets.on('click', handleFacetClick);

// Trigger a first search, so that we have a page with results
// from the start.
helper.setQueryParameter('aroundLatLngViaIP', true);
helper.search();

// Result event callback
function searchCallback(results) {
  if (results.hits.length === 0) {
    // If there is no result we display a friendly message
    // instead of an empty page.
    $hits.empty().html("No results :(");
    return;
  }

	// Hits/results rendering
  renderHits($hits, results);
  renderFacets($facets, results);
}

function renderHits($hits, results) {
  // Scan all hits and display them
  var hits = results.hits.map(function renderHit(hit, index) {
    // We rely on the highlighted attributes to know which attribute to display
    // This way our end-user will know where the results come from
    // This is configured in our index settings
    
    var highlighted = hit._highlightResult;
    var attributes2 = results.hits.map(function(element, index){return JSON.stringify(element.name)});
    console.log(attributes2);
    // var attributes = $.map(highlighted, function renderAttributes(attribute, name) {
      
    //   console.log(attribute);
    //   console.log(name);
    //   console.log(results);
      
    //   // if(name === 'name'){
    //   //   return (
    //   //     '<div class="attribute">'  + '<h3>' + attribute.value + '</h3>' +
    //   //     '</div>');
    //   // } else if(name === 'stars_count') {
    //   //   return (
    //   //     '<div class="attribute">' +
    //   //     '<strong>' + attribute.value + '</strong>' +
    //   //     '</div>');
    //   // } else if(name === 'image_url') {
    //   //   return (
    //   //     '<div class="attribute">' +
    //   //     '<img src="' + attribute.value + '" height="75" width="75">' +
    //   //     '</div>');
    //   // } else {
    //   //   return (
    //   //     '<div class="attribute">' + attribute.value + '</div>');
    //   // }
    //     return (
    //       '<div class="attribute">' + attribute.value + '</div>');

    // }).join('');
    return (
      '<div class="hit-panel">' 
      + '<div>' + '<h3>' + hit.name + '</h3>' + '</div>' +
      '<div class="hit-photo">'
      + '<img src="' + hit.image_url + '" height="75" width="75">' +
      '</div>' 
      + '<div class="hit-meta">'
      + starMaker(hit.stars_count) + '| American | $30 to $50' +
      '</div>' +
      '</div>'
            
    );
  });

  // add response metrics to page
  document.getElementById('results-metrics').innerHTML = '<h3>' + '<b>' + results.nbHits + '</b> result' + (results.nbHits > 1 ? 's' : '') + ' in <b>' + results.processingTimeMS + '</b> ms' + '</h3>';
  
  $hits.html(hits);
}



function renderFacets($facets, results) {
  console.log(results.facets);
  var facets = results.facets.map(function(facet) {
    var facetName;

    var name = facet.name;
    var facetName;
    if(name === 'food_type'){
      facetName = 'Food Type';
    } else if(name === 'stars_count'){
      facetName = 'Rating';
    } else if(name === 'payment_options'){
      facetName = 'Payment Options';
    } else {
      facetName = '';
    }

    var header = '<h4>' + facetName + '</h4>';
    var facetValues = results.getFacetValues(name);
    var facetsValuesList = $.map(facetValues, function(facetValue) {
      var facetValueClass = facetValue.isRefined ? 'refined'  : '';
      var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' + facetValue.name + ' (' + facetValue.count + ')' + '</a>';
      return '<li class="' + facetValueClass + '">' + valueAndCount + '</li>';
    })
    return header + '<ul>' + facetsValuesList.join('') + '</ul>';
  });
  
  $facets.html(facets.join(''));
}

function handleFacetClick(e) {
  e.preventDefault();
  var target = e.target;
  var attribute = target.dataset.attribute;
  var value = target.dataset.value;
  if(!attribute || !value) return;
  helper.toggleRefine(attribute, value).search();
}

// Make Stars

function starMaker(number){
  var rating = 'hey';
  console.log('starting switch statement');
  switch(true){
    case (number > 0 && number < .75):
      return( 
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<span class="fa-layers fa-fw">' +
          '<i class="fa-inverse fas fa-star empty-star"></i>' +
          '<i class="fas fa-star-half"></i>' +
        '</span>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' 
   
      );
      break;

    case (number >= .75 && number < 1.25):
      return( 
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' 
      );
      break;
      case (number >= 1.25 && number < 1.75):
      return (
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<span class="fa-layers fa-fw">' +
          '<i class="fa-inverse fas fa-star empty-star"></i>' +
          '<i class="fas fa-star-half"></i>' +
        '</span>' + 
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' 
      );
      break;
      case (number >= 1.75 && number < 2.25):
      return (
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' 
      );
      break;
      case (number >= 2.25 && number < 2.75):
      return (
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<span class="fa-layers fa-fw">' +
          '<i class="fa-inverse fas fa-star empty-star"></i>' +
          '<i class="fas fa-star-half"></i>' +
        '</span>' + 
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' 
      );
      break;
      case (number >= 2.75 && number < 3.25):
      return (
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' 
      );
      break;
      case (number >= 3.25 && number < 3.75):
      return (
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<span class="fa-layers fa-fw">' +
          '<i class="fa-inverse fas fa-star empty-star"></i>' +
          '<i class="fas fa-star-half"></i>' +
        '</span>' + 
        '<i class="fas fa-star empty-star"></i>' 
      );
      break;
      case (number >= 3.75 && number < 4.25):
      return (
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star empty-star"></i>' 
      );
      break;
      case (number >= 4.25 && number < 4.75):
      return (
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<span class="fa-layers fa-fw">' +
          '<i class="fa-inverse fas fa-star empty-star"></i>' +
          '<i class="fas fa-star-half"></i>' +
        '</span>' 
      );
      break;
      case (number >= 4.75):
      return (
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star"></i>' 
      );
      break;
  }
  // if(number < 3){
  //   return '<i class="fa fa-star" aria-hidden="true" color="yellow"</i>';
  // } else if(number > 3) {
  //   return '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>';
  // }
  return rating;
}

function toggleFilters(){
  var filter = document.getElementById("facet-list");
  filter.classList.toggle("hide-facets");
}