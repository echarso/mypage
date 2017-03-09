// node.js
//^(.*?)pm

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('nbaResults')
});

var out =  [];
var outD=[];
var visitorTeamOutOffence =[];
var visitorTeamOutDefence = [];
var hostingTeamOutOffence =[];
var hostingTeamOutDefence=[];

var lineNo = 0;
var i =0;
var dI=0;
var dhI =0;
var ohI = 0;
var dvI = 0;
var ovI =0;

var teams={};
lineReader.on('line', function (line) {
	  line.trim();
	  line = line.split("\t").join(",");
	  lineNo++;
	  if (line[0]==","){
	  	line =line.substring(1);
	  	while(line[line.length-1] == ","){
	  		//console.log("emp1");
	  		line =line.substring(0,line.length-1);
	  	}
	  }
	  var lineA=line.split(",");
	  
	  // visitor team SCORED so many points ( lineA[1] ) to team visiting
	  out[i]= [];out[i].push(lineA[0]);out[i].push(lineA[2]); out[i].push(lineA[1]);i++;
	  // host team scored so many points lineA[3] to the team that is the visitor
	  out[i]=[];out[i].push(lineA[2]);out[i].push(lineA[0]);out[i].push(lineA[3]);i++;
	  // time to fix defence 
	  // hosted team RECEVICED lineA[3] points from the visito team 
	  outD[dI]=[];outD[dI].push(lineA[0]);outD[dI].push(lineA[2]); outD[dI].push(lineA[3]);dI++;
	  // visitor team  RECEVICED lineA[3] points from the hosted team 
	  outD[dI]=[];outD[dI].push(lineA[2]);outD[dI].push(lineA[0]); outD[dI].push(lineA[1]);dI++;

	  //so hosting teams 
	  // offense


	  hostingTeamOutOffence[ohI]=[];
	  hostingTeamOutOffence[ohI].push(lineA[2]);
	  hostingTeamOutOffence[ohI].push(lineA[0]);
	  hostingTeamOutOffence[ohI].push(lineA[3]);
	  ohI++;
	  // defense
	  hostingTeamOutDefence[dhI]=[];
	  hostingTeamOutDefence[dhI].push(lineA[2]);
	  hostingTeamOutDefence[dhI].push(lineA[0]);
	  hostingTeamOutDefence[dhI].push(lineA[1])
	  dhI++;


	  // one array for offence
	  // one array for defence

	  // so visitor teams 
	  visitorTeamOutOffence[ovI]=[];
	  visitorTeamOutOffence[ovI].push(lineA[0]);
	  visitorTeamOutOffence[ovI].push(lineA[2]);
	  visitorTeamOutOffence[ovI].push(lineA[1]);
	  ovI++;
	   // defense
	  visitorTeamOutDefence[dvI]=[];
	  visitorTeamOutDefence[dvI].push(lineA[0]);
	  visitorTeamOutDefence[dvI].push(lineA[2]);
	  visitorTeamOutDefence[dvI].push(lineA[3]);
	  dvI++;



		i++
		if ( lineNo == 849){
			//printTeams();
			//  print();// offence results
			//printDefence();
			printVisitor();
			printHosting();	
		}
});

function print(){
	 
	 
	 var fs = require('fs');
	fs.writeFile("output.json", JSON.stringify(out) , function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
	});

}

function printDefence(){
	 var fs = require('fs');
	fs.writeFile("outputDefence.json", JSON.stringify(outD) , function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
	});
}

function printHosting(){
	var fs = require('fs');
	fs.writeFile("outputHostingDefence.json", JSON.stringify(hostingTeamOutDefence) , function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file outputHostingDefence was saved!");
	});

	var fs = require('fs');
	fs.writeFile("outputHostingOffence.json", JSON.stringify(hostingTeamOutOffence) , function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file outputHostingOffence was saved!");
	});

}


function printVisitor(){
	var fs = require('fs');
	fs.writeFile("outputVisitorDefence.json", JSON.stringify(visitorTeamOutDefence) , function(err) {
	    if(err) {
	        return console.log(err);
	    }
   		console.log("The file outputVisitorDefence was saved!");
	});

	var fs = require('fs');
	fs.writeFile("outputVisitorOffence.json", JSON.stringify(visitorTeamOutOffence) , function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("The file outputVisitorOffence was saved!");
	});

}


function printTeams(){
	var teamNo = 0 ;
	var teamsList=[];
	for ( j in teams){
		teamNo++;
		console.log(j);
		teamsList.push(j);
	}
	var fs = require('fs');
	fs.writeFile("teams.json", JSON.stringify(teamsList) , function(err) {
    	if(err) {
    	    return console.log(err);
   		 }
	});
}
