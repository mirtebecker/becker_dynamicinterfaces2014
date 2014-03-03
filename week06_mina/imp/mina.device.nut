local start;
local elapsed;
local position = 0;
local msg = array(140);
local timer = 0;

local receivedMsg = array(140);

local buttonPin = hardware.pin8;
local motorPin = hardware.pin9;

function pinChanged(){
    local buttonState = buttonPin.read();
    if(buttonState == 0){
        recording();
    }else{
        notrecording();
    }
}

function recording(){
    //server.log("recording");
    start = clock();
    timer = 0;
}

function notrecording(){
    //server.log("stoprecording");
    elapsed = clock() - start;
    //server.log("elapsed: "+elapsed);

    if (elapsed > 0.01 && elapsed < 0.2) {
        msg[position] = ".";
        server.log("dot");
    }
    if (elapsed > 0.2) {
        msg[position] = "-";
        server.log("dash");
    }
    position++;
}

function loop(){
    if(msg[0] != null){
        timer++;
        server.log(timer);
    }
    if(timer > 4){
        //outoging
        local outgoingData = { data = msg, }
        agent.send("outgoing", outgoingData);
        server.log("message send");
        msg.clear();
        msg.resize(140);
        server.log("message cleared");
        position = 0;
        timer = 0;
    }
    imp.wakeup(1.00, loop);
}

// incoming
function incomingData(data){
    receivedMsg = data;
    server.log("new message received");
    playMorse();
}
agent.on("incoming", incomingData);

function playMorse(){
    server.log("playing...");
    for(local i = 0; i < receivedMsg.len(); i++){
        if(receivedMsg[i] == "."){
            imp.sleep(0.5);
            motorPin.write(1);
            imp.sleep(0.3);
            motorPin.write(0);
        }else if(receivedMsg[i] == "-"){
            imp.sleep(0.5);
            motorPin.write(1);
            imp.sleep(1.0);
            motorPin.write(0);
        }
    }
    server.log("message played");
    receivedMsg.clear();
    receivedMsg.resize(140);
}

// setup
buttonPin.configure(DIGITAL_IN_PULLUP, pinChanged);
motorPin.configure(DIGITAL_OUT);
loop();