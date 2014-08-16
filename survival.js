(function($, AssetManager, Map) {
$(document).ready(function() {
	function doneLoadingAssets() {
		console.log("FINISHED LOADING ASSETS!")
	}

	function doneLoadingMap() {
		console.log("FINISHED LOADING THE MAP!")
	}

	AssetManager.loadAssets(doneLoadingAssets)
	Map.loadMap(doneLoadingMap)
})
})(jQuery, AssetManager, Map)
