(function($, AssetManager) {
$(document).ready(function() {
	function doneLoading() {
		console.log("FINISHED LOADING ASSETS!")
	}

	AssetManager.loadAssets(doneLoading)
})
})(jQuery, AssetManager)
