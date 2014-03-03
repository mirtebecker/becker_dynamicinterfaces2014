$(document).ready(function(){
	var start;
	var elapsed;

	var msg = new Array();
	var receivedMsg = new Array();

	var remaining;

	updateCountdown();

	console.log(msg.length);

	function updateCountdown() {
    	remaining = 140 - msg.length;
    	jQuery('.countdown').text(remaining);
	}

	$("#button").mousedown(function() {
		recording();
	});

	$("#button").mouseup(function() {
		stoprecording();
		updateCountdown();
	});

	function recording(){
		start = new Date().getTime();
	}

	function stoprecording(){
		elapsed = new Date().getTime() - start;
		if(remaining > 0){
			if (elapsed > 1 && elapsed < 200) {
	    		msg.push(".");
	    		$(".text").append(".");
	  		}
	  		if (elapsed > 200 && elapsed < 800) {
	    		msg.push("-"); 
	    		$(".text").append("-");
	  		}
  		}
	}

	$("#submit").click(function(){
		if(msg[0] != null){
			sendQuery();
		}else{
			$(".err").css("display", "inline");
			$(".err").text("Nothing to send!");
     		$( ".err" ).fadeOut( 5000, function() {});
		}	
	});

	$("#submit").mousedown(function() {
		$("#submit").css("background-color", "#DBDBDB");
	});

	$("#submit").mouseup(function() {
		$("#submit").css("background-color", "#b2b2b2");
	});

	$("#clear").click(function(){
		if(msg[0] != null){
			msg = [];
			$(".text").empty();
			updateCountdown();
			console.log("message cleared");
		}
	});

	$("#clear").mousedown(function() {
		$("#clear").css("background-color", "#6B6B6B");
	});	

	$("#clear").mouseup(function() {
		$("#clear").css("background-color", "#000000");
	});	

	// post
	function sendQuery(){
		var message = JSON.stringify(msg);

		$.ajax({
 			type: "POST",
 			url: "https://agent.electricimp.com/gPnUzcbXrA-S/incoming/",
 			data: message,
  			statusCode: {
     			200: function (response) {
     				msg = [];
					$(".text").empty();
					updateCountdown();
     				$(".err").css("display", "inline");
     				$(".err").text("Message received!");
     				$( ".err" ).fadeOut( 5000, function() {});
     			}
   			}
		});
	}

	// get
    function poll(){
        $.ajax({
            type: "get",
            url: "https://agent.electricimp.com/gPnUzcbXrA-S/outgoing/",
            dataType: "json",
            success: function(agentMsg) {
            	if(agentMsg[0] != null){
            		receivedMsg = agentMsg;
            		console.log("new message received");
            		playMorse();
            	}
            },
            error: function(err) {
                console.log("err" + err.status)
            }
        });
    }
    setInterval(function(){ 
    	poll(); 
    }, 1000);

    function playMorse(){		
		console.log("playing...");
		$("#receivedMsg").text("");
	    for(var i = 0; i < receivedMsg.length; i++){
	        if(receivedMsg[i] == "."){
	        	$("#receivedMsg").append(".");
	        	console.log("dot");
	        }else if(receivedMsg[i] == "-"){
	        	$("#receivedMsg").append("-");
	        	console.log("dash");
	        }
	    }
	    console.log("message played");
	    receivedMsg = [];
    }

    function sleep(milliseconds) {
  		var start = new Date().getTime();
  		for (var i = 0; i < 1e7; i++) {
    		if ((new Date().getTime() - start) > milliseconds){
      			break;
    		}
  		}
	}

});