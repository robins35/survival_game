var AssetManager = (function() {
	var successCount = 0
	var errorCount = 0
	var imgs = {}
	var imgPaths = [
		"images/grass.png",
		"images/dirt.gif",
		"images/water.gif"
	]

	var isDone = function() {
		return (imgPaths.length == (successCount + errorCount))
	}

	var loadImages = function(downloadCallback) {
		if (imgPaths.length == 0) downloadCallback()
		for (var i = 0; i < imgPaths.length; i++) {
			(function(src) {
				var name = src.split('/').slice(-1)[0].split('.')[0]
				imgs[name] = new Image()

				imgs[name].addEventListener("load", function() {
					successCount++
					console.log("SUCCESSFULLY LOADED IMAGE " + name)
					if (isDone()) downloadCallback()
				}, false);

				imgs[name].addEventListener("error", function() {
					errorCount++
					console.log("COULDN'T LOAD IMAGE " + name)
					if (isDone()) downloadCallback()
				}, false)

				imgs[name].src = src
			})(imgPaths[i])
		}
	}

	var loadAudio = function(downloadCallback) {
		if(imgPaths.length == 0) downloadCallback()
	}

	var loadAssets = function(downloadCallback) {
		loadImages(downloadCallback)
	}

	var getImage = function(name) {
		return imgs[name]
	}

	var getAudio = function(name) {
		return snds[name]
	}

	return {
		loadAssets : loadAssets,
		getImage : getImage,
		getAudio : getAudio
	}
})()
