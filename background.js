
// Listens for external messages coming from pages that match url pattern defined in manifest.json
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        console.log("Got request", request, sender);
        if(request.getVersion) {
            sendResponse({ version: chrome.runtime.getManifest().version});
            return false; // Dispose of sendResponse
        } else if(request.getStream) {
            // Desktop video stream sources
            var sources = ["screen", "window"];
            if (request.sources) {
                // Default
                sources = request.sources;
            }
            // Gets chrome media stream token and returns it in the response.
            chrome.desktopCapture.chooseDesktopMedia(
                sources, sender.tab,
                function(streamId) {
                    sendResponse({ streamId: streamId});
                });
            return true; // Preserve sendResponse for future use
        } else {
            console.error("Unknown request");
            sendResponse({ error : "Unknown request" });
            return false;
        }
    }
);