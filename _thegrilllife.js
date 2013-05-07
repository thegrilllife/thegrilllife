
	var showDropdown = function ($tag, ht) {
		//grab the dropdown
		var $dropdown = $(".dropdown", $tag);
		//animate the height
		$dropdown.stop().animate({"height":ht}, 500);
	};
	
	//ANIMATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU
	var hideDropdown = function ($tag) {
		$(".dropdown", $tag).stop().animate({"height":"0px"}, 500);
	};

	//IMEDIATE RETRACTION OF MAIN CATEGORY DROPDOWN MENU WHEN HEADER IS CLICKED
	var clickDropdown = function ($tag) {
		$(".dropdown", $tag).stop().animate({"height":"0px"}, 0);
	};
	
	