var baseUrl = "https://openapi.etsy.com/v2/listings/active.js"
var apiKey = "mvk7lu427evopxj9ggvyb3q3"
var searchUrl = "https://openapi.etsy.com/v2/listings/"

//******************
//Models
//******************
var EtsyCollection = Backbone.Collection.extend({
	url: baseUrl,
	parse: function(apiResponse) {
		return apiResponse.results
	},
})

var ProductModel = Backbone.Model.extend({
	url: searchUrl,
	parse: function(apiResponse) {
		return apiResponse.results[0]
	}
})

//******************
//Views
//******************
var ViewCollection = Backbone.View.extend({
	initialize: function() {
		document.querySelector('.pageContent').innerHTML = '<img class="loadingGif" src="hourglass.gif">'
		this.listenTo(this.collection,'sync',this.render)
	},
	render: function() {
		var containerNode = document.querySelector('.pageContent')
		var htmlStr = ''
		this.collection.forEach(function(inputModel) {
			htmlStr += "<a href='#details/" + inputModel.get('listing_id') + "'>"
			htmlStr +=		"<div class='item" + inputModel.get('listing_id') + "'>"
			htmlStr += 			"<img class='image' src='" + inputModel.get('Images')[0].url_170x135 + "'>"
			htmlStr +=			"<p class='title'>" + inputModel.get('title') + "</p>"
			htmlStr += 			"<p class= 'price'>$" + inputModel.get('price') + "</p>"
			htmlStr += "</div>" + "</a>"
		})
		containerNode.innerHTML = htmlStr
	}
})

var ViewModel = Backbone.View.extend({
	initialize: function() {
		document.querySelector('.pageContent').innerHTML = '<img class="loadingGif" src="hourglass.gif">'
		this.listenTo(this.model,'sync',this.render)
	},
	render: function() {
		var containerNode = document.querySelector('.pageContent')
		var htmlStr = ''
		htmlStr += "<div class='itemPage'>"
		htmlStr += 		"<div class='itemShop'"
		htmlStr += 		"<a href='https://www.etsy.com/listing/" + this.model.get('listing_id') + "' target='blank'>"
		htmlStr += 			"<button type='button' class='buyButton'>Buy Now!</button></a>"
		htmlStr += 		"<h2 class='itemTitle'>" + this.model.get('title') + "</h2>"
		htmlStr += 		"<img class='itemImg' src='" + this.model.get('Images')[0].url_570xN + "'>"
		htmlStr += 		"<p class='itemDetail'" + this.model.get('description') + "</p>"
		htmlStr += "</div>"
		containerNode.innerHTML = htmlStr
	}
})

//******************
//Controller
//******************
var PageRtr = Backbone.Router.extend({
 	routes: {
 	"home": "showViewCollection",
 	"search/:query": "showSearchCollection",
 	"details/:id": "showViewModel",
 	"*notFound": "goHome",
 	},
 	showViewCollection: function() {
 		var homeInstance = new EtsyCollection()
 		homeInstance.fetch({
 			dataType: 'jsonp',
 			data: {
 				includes: "Images,Shop",
 				"api_key": apiKey,
 				limit: 50,
 			}
 		})
 		new ViewCollection ({
 			collection: homeInstance
 		})
 	},
 	showSearchCollection: function(query) {
 		var searchInstance = new EtsyCollection()
 		searchInstance.fetch ({
 			"dataType": "jsonp",
 			data: {
 				"api_key": apiKey,
 				"keywords": query,
 				includes: "Images,Shop",
 				limit: 50
 			},
 		})
 		new ViewCollection ({
 			collection: searchInstance
 		})
 	},
 	showViewModel: function(id) {
 		var modelInstance = new ProductModel()
 		modelInstance.url += id + '.js'
 		modelInstance.fetch ({
 			dataType: "jsonp",
 			data:{
 				"api_key": apiKey,
 				includes: "Images,Shop"
 			}

 		})
 		new ViewModel({
 			model: modelInstance
 		})
 	},
 	goHome: function() {
 		location.hash = "home"
 	}
})

//******************
//Search
//******************
var searchBarNode = document.querySelector('.searchBar')
searchBarNode.addEventListener('keydown', function(eventObj) {
	if(eventObj.keyCode === 13) {
		var input = eventObj.target.value
		location.hash = 'search/' + input
		eventObj.target.value = ''
	}
})

//******************
//LET'S GET THIS PARTY STARTED!!!
//******************

new PageRtr
Backbone.history.start()









