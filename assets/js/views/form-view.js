define([
       "jquery", "underscore", "backbone"
      , "views/temp-snippet-view"
      , "helper/pubsub"
      , "text!templates/app/renderform.html"
      , "views/row-container-view"
      , "collections/rowcontainer-collection"
], function(
  $, _, Backbone
  , TempSnippetView
  , PubSub
  , _renderForm
  , RowContainerView
  , RowContainerCollection
){
  return Backbone.View.extend({
    tagName: "fieldset"
    , initialize: function(){
      //this.collection.on("add", this.render, this);
      this.collection.on("remove", this.render, this);
      this.collection.on("change", this.render, this);
      PubSub.on("UniqueIdGiven", this.prepare_render, this);
      PubSub.on("mySnippetDrag", this.handleSnippetDrag, this);
      PubSub.on("tempMove", this.handleTempMove, this);
      PubSub.on("tempDrop", this.handleTempDrop, this);
      PubSub.on("rowContainerRendered", this.render_controls, this);
      this.$build = $("#build");
      this.build = document.getElementById("build");
      this.buildBCR = this.build.getBoundingClientRect();
      this.renderForm = _.template(_renderForm);
      this.render();
    }
  	, prepare_render: function(snippet){
  		this.render();
  		var snippetType = snippet.attributes.fields.id.type;
  		if (snippetType == "rowcontainer") {
      	  //initialize row-container view
  		  if (typeof(snippet.row_container_views) == 'undefined') {
  			snippet.row_container_views = {}
  		  } 
  		  if (!(snippet in snippet.row_container_views)){
  			  var rcv = new RowContainerView({model: snippet, collection: new RowContainerCollection([])});
  			  snippet.row_container_views[snippet] = rcv
  		  }
  		}
  	}
  	, render_controls: function(){
  		var that = this;
  		var rendered_collection = this.collection.renderAllClean();
        var text = _.map(rendered_collection, function(e){return e.html()}).join("\n")
        var rendered = that.renderForm({
            multipart: this.collection.containsFileType(),
            text: text
          })
        $("#render").val(rendered);
        
        var rendered_collection_json = this.collection.renderAllJSON();
        localStorage.rendered_json = rendered_collection_json;
        $("#render_json").val(rendered_collection_json);
  	}
    , render: function(){
      //Render Snippet Views
      this.$el.empty();
      var that = this;
      var containsFile = false;
      _.each(this.collection.renderAll(), function(snippet){
        that.$el.append(snippet);
      });
      var rendered_collection = this.collection.renderAllClean();
      var text = _.map(rendered_collection, function(e){return e.html()}).join("\n")
      var rendered = that.renderForm({
          multipart: this.collection.containsFileType(),
          text: text
        })
      $("#render").val(rendered);

      var rendered_collection_json = this.collection.renderAllJSON();
      localStorage.rendered_json = rendered_collection_json;
      $("#render_json").val(rendered_collection_json);

      this.$el.appendTo("#build div#target");
      this.delegateEvents();
    }

    , getBottomAbove: function(eventY){
      var myFormBits = $(this.$el.find(".component"));
      var topelement = _.find(myFormBits, function(renderedSnippet) {
        if (($(renderedSnippet).position().top + $(renderedSnippet).height()) > eventY  - 160) {
          return true;
        }
        else {
          return false;
        }
      });
      if (topelement){
        return topelement;
      } else {
        return myFormBits[0];
      }
    }

    , handleSnippetDrag: function(mouseEvent, snippetModel) {
      $("body").append(new TempSnippetView({model: snippetModel}).render());
      this.collection.remove(snippetModel);
      PubSub.trigger("newTempPostRender", mouseEvent);
    }

    , handleTempMove: function(mouseEvent){
      $(".target").removeClass("target");
      if(mouseEvent.pageX >= this.$el.offset().left &&
  	     mouseEvent.pageX < (this.$el.offset().left + this.$el.width()) &&
         mouseEvent.pageY >= this.$el.offset().top &&
         mouseEvent.pageY < (this.$el.offset().top + this.$el.height())){
        $(this.getBottomAbove(mouseEvent.pageY)).addClass("target");
      } else {
        $(".target").removeClass("target");
      }
    }

    , handleTempDrop: function(mouseEvent, model, index){
    	if(mouseEvent.pageX >= this.$el.offset().left &&
	       mouseEvent.pageX < (this.$el.offset().left + this.$el.width()) &&
           mouseEvent.pageY >= this.$el.offset().top &&
           mouseEvent.pageY < (this.$el.offset().top + this.$el.height())){
        var index = $(".target").index();
        $(".target").removeClass("target");
        this.collection.add(model,{at: index+1});
      } else {
        $(".target").removeClass("target");
      }
    }
  })
});
