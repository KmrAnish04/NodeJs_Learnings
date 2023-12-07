
// Store this function in common file, so that the use case of this function is not limited to only resume share link,
// and you will be able to use this function in anywhere where you want to copy any hidden data to clipboard. So store it
// a common file.
function copyLinkToClipboard(url){
    console.log("Copy Function Called!")
    navigator.clipboard.writeText(url).then(function() {
        console.log('Link Copied!');
    }, function(err) { console.log('Copy Error', err) });
}