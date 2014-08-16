var Map = (function(imgs) {
	var map;

	var loadMap = function(downloadCallback) {
		var mapFile = new File()
		mapFile.name = survival_map.map
		var textType = /text.*/
		
		if (mapFile.type.match(textType)) {
			var reader = new FileReader()
			reader.onload = function(e) {
				var text = reader.result
			}
			reader.readAsText(mapFile)
		}
		else {
			console.log("ERROR: NO MAP FILE FOUND! MUST BE NAMED, 'survival_map.map'")
		}
	}

	return {
		loadMap : loadMap
	}
})(AssetManager.imgs)
