// - Accepted only
// - Best runtime AC sub for each problem
// - Language file detection
// - Save in a folder

var left;
var zip = new JSZip();

var problems = {}, queue = [];

function getID(sub){
	return "" + sub.contestId + sub.problem.index;
}

function saveText(data){
	lines = data.split("\n");
	var filename = lines[0];
	var code = lines.slice(1).join("\n");
	zip.file(filename, code);
	--left;
	$("#progress").text(left);
	if(!left){
		zip.generateAsync({type:"blob"}).then(function(content) {
			saveAs(content, "submissions.zip");
		});
	}
}

function language(name){
	if(name.indexOf("C++") >= 0) return "cpp";
	else if(name.indexOf("Java") >= 0) return "java";
	else if(name.indexOf("Python") >= 0) return "py";
	else return "txt";
}

function makeName(sub){
	return getID(sub) + "." + language(sub.programmingLanguage);
}

function saveSub(){
	if(queue.length == 0) return
	sub = queue.pop();
	var url = "https://codeforces.com/contest/" + sub.contestId + "/submission/" + sub.id;
	$.get('script.php', {
		url: url,
		filename: makeName(sub)
	}, saveText);

	if(left) window.setTimeout(saveSub, 500);
}

function bestTime(subs){
	var best = {timeConsumedMillis: 9999999999999};
	for(var i = 0; i < subs.length; i++){
		var sub = subs[i];
		if(sub.timeConsumedMillis < best.timeConsumedMillis)
			best = sub;
	}
	return best;
}

function handle(d){
	var data = d.result;
	for(var i = 0; i < data.length; i++){
		var sub = data[i];
		if(sub.verdict != "OK") continue;
		var id = getID(sub);
		if(id in problems)
			problems[id].push(sub);
		else
			problems[id] = [sub];
	}

	left = Object.keys(problems).length;
	$("#progress").text(left);

	for(var id in problems){
		var problemSubs = problems[id];
		var bestSub = bestTime(problemSubs);
		queue.push(bestSub);
	}
	saveSub();
}

function get(){
	var username = $("#username").val();
	$.get("https://codeforces.com/api/user.status?handle=" + username + "&from=1", handle);
}

$(document).ready(function(){
	$("#go").click(get);
	$(document).keydown(function(e){
		if(e.which == 13) get();
	});
});
