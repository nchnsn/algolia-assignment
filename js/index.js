

var algolia = algoliasearch('P66KPV0B4D', 'd21f68656aa0b122171c8138b26379a5');
var hitNumber = 5;


var helper = algoliasearchHelper(algolia, 'restaurant_data', {
  facets: ['food_type', 'stars_count', 'payment_options'],
  disjunctiveFacets:['stars_count', 'payment_options'],
  hitsPerPage: hitNumber,
  maxValuesPerFacet: 5
});

// facet methods
// star ratings
var fourStarsToggle = false;
function fourStarsFacet(){
  if(fourStarsToggle){
    helper.clearRefinements().search();
  } else {
    helper.addDisjunctiveFacetRefinement('stars_count', 4.1);
    helper.addDisjunctiveFacetRefinement('stars_count', 4.2);
    helper.addDisjunctiveFacetRefinement('stars_count', 4.3);
    helper.addDisjunctiveFacetRefinement('stars_count', 4.4);
    helper.addDisjunctiveFacetRefinement('stars_count', 4.5);
    helper.addDisjunctiveFacetRefinement('stars_count', 4.6);
    helper.addDisjunctiveFacetRefinement('stars_count', 4.7);
    helper.addDisjunctiveFacetRefinement('stars_count', 4.8);
    helper.addDisjunctiveFacetRefinement('stars_count', 4.9);
    helper.search()
  }
  fourStarsToggle = !fourStarsToggle;
}

var discoverToggle = false;
function discoverFacet(){
  alert('discovvvrrr');
  if(discoverToggle){
    helper.clearRefinements().search();
  } else {
    helper.addDisjunctiveFacetRefinement('payment_options', 'Discover');
    helper.addDisjunctiveFacetRefinement('payment_options', 'Diners Club');
    helper.addDisjunctiveFacetRefinement('payment_options', 'Carte Blanche');
    helper.search()
  }
  discoverToggle = !discoverToggle;
}

// helper.addDisjunctiveFacetRefinement('stars_count', 4.3);

helper.on("result", searchCallback);
// helper.on("result", function(results, state){
//   console.log(results);
  
// });

helper.on('searchQueueEmpty', function() {
  var searchIcon = document.getElementById("search-icon-loading");
  searchIcon.innerHTML = '<i class="fas fa-search fa-3x"></i>'; 
  var hideMore = document.getElementById("more-results-div");
  hideMore.classList.remove("hide-more");
  console.log('No more search pending');
  // This is received before the result event if we're not expecting new results
});

var $inputfield = $("#search-box");
var $hits = $('#hits');
var $facets = $('#facets');

$inputfield.keyup(function(e) {
  helper.setQuery($inputfield.val()).search();
});

$facets.on('click', handleFacetClick);

helper.setQueryParameter('aroundLatLngViaIP', true);
helper.search();


function searchCallback(results) {
  if (results.hits.length === 0) {
    $hits.empty().html("No Restaurants For That Search, Try Again!");
    return;
  }

  renderHits($hits, results);
  renderFacets($facets, results);
}

function renderHits($hits, results) {
  var hits = results.hits.map(function renderHit(hit, index) {
    var highlighted = hit._highlightResult;
    var attributes2 = results.hits.map(function(element, index){return JSON.stringify(element.name)});
    return (
      '<a href="' + hit.mobile_reserve_url + '" target="_blank">' +
      '<div class="hit-panel">'  +
      '<div class="hit-photo">'
      + '<img class="hit-image" src="' + hit.image_url + '" height="75" width="75">' +
      '</div>' 
      + '<div class="hit-meta">'
      + '<h3>' + hit.name + '</h3>' + starMaker(hit.stars_count, true) + '<p>' + hit.dining_style + ' | ' + hit.neighborhood + ' | ' + hit.price_range + '</p>' + 
      '</div>' +
      '</div>' 
      + '</a>'      
    );
  });

  document.getElementById('results-metrics').innerHTML = '<p>' + '<b>' + results.nbHits + '</b> result' + (results.nbHits > 1 ? 's' : '') + ' in <b>' + results.processingTimeMS + '</b> ms' + '</p>';
  
  $hits.html(hits);
}


function renderFacets($facets, results) {
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

    var header = '<h4 style="margin-top:15px">' + facetName + '</h4>';
    var facetValues = results.getFacetValues(name);
    var facetsValuesList = $.map(facetValues, function(facetValue) {
      var facetValueClass = facetValue.isRefined ? 'refined'  : '';
      console.log(facetValue.name);
      if(facet.name === 'stars_count'){
        var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' +  facetValue.name + starMaker(facetValue.name) + ' (' + facetValue.count + ')' + '</a>';
        // var valueAndCount = '<a href="#">' + starMaker(facetValue.name) + '</a>';
      } else if(facetValue.name === 'Discover'){
        var valueAndCount = '<a  onclick="discoverFacet()"' + 'href="#">' + facetValue.name + ' (' + facetValue.count + ')' + '</a>';
      } else if(facetValue.name === 'Diners Club'){
        var valueAndCount = '';
      } else{
        var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' + facetValue.name + ' (' + facetValue.count + ')' + '</a>';
      }
      
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

function starMaker(number, includeNumber){
  switch(true){
    case (number > 0 && number < .75):
        if(includeNumber){
          return(
            '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
            '<span class="fa-layers fa-fw">' +
              '<i class="fa-inverse fas fa-star empty-star"></i>' +
              '<i class="fas fa-star-half"></i>' +
            '</span>' +
            '<i class="fas fa-star empty-star"></i>' +
            '<i class="fas fa-star empty-star"></i>' +
            '<i class="fas fa-star empty-star"></i>' +
            '<i class="fas fa-star empty-star"></i>')
        } else {
          return(
            '<span class="fa-layers fa-fw">' +
              '<i class="fa-inverse fas fa-star empty-star"></i>' +
              '<i class="fas fa-star-half"></i>' +
            '</span>' +
            '<i class="fas fa-star empty-star"></i>' +
            '<i class="fas fa-star empty-star"></i>' +
            '<i class="fas fa-star empty-star"></i>' +
            '<i class="fas fa-star empty-star"></i>')
        }
      ;
      break;

    case (number >= .75 && number < 1.25):
    if(includeNumber){
      return(
        '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star empty-star"></i>'  +
        '<i class="fas fa-star empty-star"></i>'  +
        '<i class="fas fa-star empty-star"></i>'  +
        '<i class="fas fa-star empty-star"></i>' 
      );
    } else {
      return(
        '<i class="fas fa-star"></i>' +
        '<i class="fas fa-star empty-star"></i>'  +
        '<i class="fas fa-star empty-star"></i>'  +
        '<i class="fas fa-star empty-star"></i>'  +
        '<i class="fas fa-star empty-star"></i>' 
      );
    }
      break;
      case (number >= 1.25 && number < 1.75):
      if(includeNumber){
        return(
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
      } else {
        return(
          '<i class="fas fa-star"></i>' +
          '<span class="fa-layers fa-fw">' +
          '<i class="fa-inverse fas fa-star empty-star"></i>' +
          '<i class="fas fa-star-half"></i>' +
          '</span>' +
          '<i class="fas fa-star empty-star"></i>' +
          '<i class="fas fa-star empty-star"></i>' +
          '<i class="fas fa-star empty-star"></i>' 
        );
      }
      break;
      case (number >= 1.75 && number < 2.25):
      if(includeNumber){
        return(
          '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star empty-star"></i>'  +
          '<i class="fas fa-star empty-star"></i>'  +
          '<i class="fas fa-star empty-star"></i>' 
        );
      } else {
        return(
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star empty-star"></i>'  +
          '<i class="fas fa-star empty-star"></i>'  +
          '<i class="fas fa-star empty-star"></i>' 
        );
      }
      break;
      case (number >= 2.25 && number < 2.75):
      if(includeNumber){
        return(
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
      } else {
        return(
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<span class="fa-layers fa-fw">' +
          '<i class="fa-inverse fas fa-star empty-star"></i>' +
          '<i class="fas fa-star-half"></i>' +
          '</span>' +
          '<i class="fas fa-star empty-star"></i>' +
          '<i class="fas fa-star empty-star"></i>' 
        );
      }
      break;
      case (number >= 2.75 && number < 3.25):
      if(includeNumber){
        return(
          '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star empty-star"></i>'  +
          '<i class="fas fa-star empty-star"></i>' 
        );
      } else {
        return(
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star empty-star"></i>'  +
          '<i class="fas fa-star empty-star"></i>' 
        );
      }
      break;
      case (number >= 3.25 && number < 3.75):
      if(includeNumber){
        return(
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
      } else {
        return(
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<span class="fa-layers fa-fw">' +
          '<i class="fa-inverse fas fa-star empty-star"></i>' +
          '<i class="fas fa-star-half"></i>' +
          '</span>' +
          '<i class="fas fa-star empty-star"></i>' 
        );
      }
      break;
      case (number >= 3.75 && number < 4.25):
      if(includeNumber){
        return(
          '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star empty-star"></i>' 
        );
      } else {
        return(
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star empty-star"></i>' 
        );
      }
      break;
      case (number >= 4.25 && number < 4.75):
      if(includeNumber){
        return(
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
      } else {
        return(
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<i class="fas fa-star"></i>' +
          '<span class="fa-layers fa-fw">' +
          '<i class="fa-inverse fas fa-star empty-star"></i>' +
          '<i class="fas fa-star-half"></i>' +
          '</span>' 
        );
      }
      break;
      case (number >= 4.75):
      
        if(includeNumber){
          return(
            '<strong style="color:rgb(255, 200, 90)">' + number + ' </strong>' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>'
          );
        } else {
          return(
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>'
          );
        }
      break;
  }
}

// toggle the filters on/off for mobile view

function toggleFilters(){
  var filter = document.getElementById("facet-list");
  filter.classList.toggle("hide-facets");
}

function showMoreHits(){
  helper.setQueryParameter('hitsPerPage', hitNumber + 20).search();
  var hideMore = document.getElementById("more-results-div");
  hideMore.classList.add("menu-toggle");
};

