/** @jsx React.DOM **/
var Gallery = React.createClass({displayName: "Gallery",
	
	getInitialState: function() {
		return {
			galleryType : "simple",
			items : [],
			tagFilter : "",
			tagInputFilter : "",
			showOnlyPopular: false
		};
	},
	loadItems: function(url) {
		$.get(url, function(result) {

			var json = JSON.parse(result);
			var jsonItens = json.data;
			if(this.state.items.length > 0) {
				jsonItens = this.state.items.concat(json.data);
			}
			if (this.isMounted()) {
				this.setState({
								items : jsonItens,
								pagination: json.pagination.next_page});
			
			}
		}.bind(this));
    },

    componentDidMount: function() {
    	if(this.state.items.length <= 0) {
			var url = "https://api.getchute.com/v2/albums/aus6kwrg/assets?oauth_bearer=98d95c4e1c349ba369ee2231d544cade9ee40a9e0f610fb6ccc08af969204b49&per_page="+ this.props.maxPerPage;
			this.loadItems(url);
    	}
    },

	onLayoutChange: function(type) {
		this.setState({galleryType: type});
	},
	onTagSelected: function(tag) {
		this.setState({
						tagFilter: tag,
						tagInputFilter : "",
						showOnlyPopular : false
					});
	},
	onMostPopularSelected: function() {
		this.setState({
						tagInputFilter : "",
						tagFilter : "",
						showOnlyPopular : true
					});
	},
	onInputFilter: function(val) {
		this.setState({
						tagInputFilter : val,
						tagFilter : "",
						showOnlyPopular : false
					});
	},
	onLoadMore: function() {
		this.loadItems(this.state.pagination);
	},

	render: function() {
		var type = this.state.galleryType;
		var tag = this.state.tagFilter;
		var inputFilter = this.state.tagInputFilter;
		var showOnlyPopular = this.state.showOnlyPopular;

		var itemsFill = this.state.items.map(function(item) {
			if(inputFilter.length > 0) {
				for(var index = 0; index < item.tags.length; index++){
					var itemTag = item.tags[index].toLowerCase();
					inputFilter = inputFilter.toLowerCase();
					if(itemTag.indexOf(inputFilter) >= 0){
						tag = item.tags[index];
						break;
					}
					tag = inputFilter;
				}
			}
			if((tag != "" && item.tags.indexOf(tag) < 0 ) 
				|| (showOnlyPopular && item.hearts < 10))
			{
				return null;
			}
			return (
				React.createElement(GalleryItem, {item: item, galleryType: type})
				);
		});
		return(
			React.createElement("div", null, 
				React.createElement("div", {className: "container-fluid"}, 
					React.createElement("div", {className: "row", style: {padding: "20px"}}, 
						React.createElement(TagFilter, {onTagSelected: this.onTagSelected, onMostPopularSelected: this.onMostPopularSelected}), 
				 		React.createElement(InputFilter, {onInputFilter: this.onInputFilter, value: this.state.tagInputFilter})
					)
				), 

				React.createElement("div", {className: "container-fluid"}, 
					React.createElement("div", {className: "row"}, 
						React.createElement("ul", {className: "media-list clearfix"}, 
							itemsFill
						)
					), 
					
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-xs-12"}, 
							React.createElement("a", {href: "#nike", className: "thm-btn-auto", onClick: this.onLoadMore}, "Load more")
						)
					)
				)
			)
		);
	}
})