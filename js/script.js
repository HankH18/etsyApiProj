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
		var headerNode = document.querySelector('header')
		var botHtmlStr = ''
		var topHtmlStr = ''
		botHtmlStr += "<div class='itemPage'>" 
		botHtmlStr += 		"<div class='itemBottom'>"
		botHtmlStr += 			"<h2 class='itemTitle'>" + this.model.get('title') + "</h2>"
		botHtmlStr += 			"<img class='itemImg' src='" + this.model.get('Images')[0].url_570xN + "'>"
		botHtmlStr += 			"<p class='itemDetail'" + this.model.get('description') + "</p>"
		botHtmlStr += 			"<p class='itemPrice'>$" + this.model.get('price') + "</p>"
		botHtmlStr += 			"<a href='https://www.etsy.com/listing/" + this.model.get('listing_id') + "' target='blank'>"
		botHtmlStr += 				"<button type='button' class='buyButton'>Buy Now!</button></a></div>"
		topHtmlStr += 		"<div class='itemTop'>"
		topHtmlStr += 			"<h1 class='itemShop'>" + this.model.get('Shop').shop_name +"</h1>"
		topHtmlStr += 			"<a href='" + this.model.get('Shop').url + "' target='blank'>"
		topHtmlStr += 				"<button type='button' class='shopButtton'>Visit My Store!</button></a></div>"
		topHtmlStr += "</div>"
		containerNode.innerHTML = botHtmlStr
		headerNode.innerHTML = topHtmlStr
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









