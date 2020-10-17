let ws;
let notifyReceiver = function(receiver){
    if((ws === null) || (ws === undefined)) {
        initSocket().then(() => {
            console.log("sending notification to " + receiver);
            ws.send(JSON.stringify({type:"notification", sender:document.getElementById("userHandle").innerText,
                receiver:receiver}))
        });
    } else {
        console.log("sending notification to " + receiver);
        ws.send(JSON.stringify({type:"notification", sender:document.getElementById("userHandle").innerText,
            receiver:receiver}))
    }
    /*console.log("sending notification to " + receiver);
    ws.send(JSON.stringify({type:"notification", sender:document.getElementById("userHandle").innerText,
    receiver:receiver}))*/
};
function initSocket(){
    if(ws !== null) {return}
    const socketReady = new Promise((resolve, reject) => {
        ws = new WebSocket(`ws://localhost:2000`);
        ws.onopen = () => {
            ws.send(JSON.stringify({type:"sendingUsername", username:document.getElementById("userHandle").innerText}));
            ws.onmessage = __msg => {
                //console.log(__msg);
                const msg = JSON.parse(__msg.data);
                console.log(msg);
                let sender = msg.sender;
                if(sender) {
                    console.log("you have a new message from " + sender);
                }
            }
        }
    })
}
