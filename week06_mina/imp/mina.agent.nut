server.log("Mina Online " + http.agenturl());

/* DEVICE EVENT HANDLERS ----------------------------------------------------*/
_msg <- array();
device.on("outgoing", function(iv) {
    _msg = iv.data;
});

/* HTTP EVENT HANDLERS ------------------------------------------------------*/
http.onrequest(function(request, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    response.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

    if(request.path == "/incoming" || request.path == "/incoming/") {
        try{ 
            local data = http.jsondecode(request.body);
            device.send("incoming", data)
            response.send(200, "OK");
        }catch(ex){
            response.send(500, "Internal Server Error: " + ex);
        }
        
    }else if(request.path == "/outgoing" || request.path == "/outgoing/") {
        try{ 
            local jvars = http.jsonencode(_msg);
            response.header("Access-Control-Allow-Origin", "*");
    
            if(jvars != null){
                response.send(200, jvars);
                _msg.clear();
                jvars = "";
            }
        }catch(ex){
            response.send(500, "Internal Server Error: " + ex);
        }
    }
});