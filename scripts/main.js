/*
 *  JS goes here
 */

function initializeWebPage() {
    genesys.wwe.service.subscribe(["agent", "interaction", "media", "system", "markdone"], eventHandler, this);
}

function eventHandler(message) {
    switch (message.event) {
        case "agent":
            log("Received agent event: " + JSON.stringify(message, null, "\t"));
            break;
        case "interaction":
            log("Received interaction event: " + JSON.stringify(message, null, "\t"));
            break;
        case "markdone":
            log("Received markdone event: " + JSON.stringify(message, null, "\t"));
            break;
        case "media":
            log("Received media event: " + JSON.stringify(message, null, "\t"));
            break;
        case "system":
            log("Received system event: " + JSON.stringify(message, null, "\t"));
            break;

        default:
    }
}

function log(text) {
    var divOutput = document.getElementById("output");
    divOutput.innerHTML = "<pre>" + text + "</pre><br/>" + divOutput.innerHTML;
}
