<?php
	$url = $_GET['url'];
	$filename = $_GET['filename'];
	rand(0, 9999999999);
	$output = [];
	exec('python scrape.py ' . $url, $output);
	echo $filename . "\n";
	echo join("\n", $output);
?>
