const fs = require('fs');
const { exec } = require('child_process');

function getParent (p) {
	let index = prevIndex = -1;
	do {
		index = p.indexOf('/', prevIndex+1);
		if (index+1) prevIndex = index;
	} while (index+1);
	return p.slice(0, prevIndex);
}

String.prototype.padding = function (n, c) {
	var val = this.valueOf();
	if (Math.abs(n) <= val.length) {
		return val;
	}
	var m = Math.max((Math.abs(n) - this.length) || 0, 0);
	var pad = Array(m + 1).join(String(c || ' ').charAt(0));
	return (n < 0) ? pad + val : val + pad;
}

function log_format (n, l, sep, r) {
	return `${l.padding(n)} ${sep}   ${r}`;
}

class LOG {
	constructor (destination) {
		this.index = 0;
		this.setDestination(destination);
	}

	// Migth create a new log file
	checkPath(p){
		if (!p) return false;
		const fileExists = fs.existsSync(p);
		const parentDir = getParent(p);
		if (fileExists && !fs.lstatSync(p).isDirectory()) return true;
		if (fs.existsSync(parentDir) && !fileExists) {
			exec(`touch ${p}`);
			return true;
		}
		return false;
	}

	setDestination(p) {
		// I also have to check if this is a folder or a txt file.
		if (this.checkPath(p)) this.destination = p;
		else return console.log("Invalid log path.");
	}

	log (message) {
		if (!this.destination) return;
		const curdate = new Date();
        let log = "";
		// Getting filename, line, ...
		const e = new Error();
		const regex = /\((.*):(\d+):(\d+)\)$/
		const match = regex.exec(e.stack.split("\n")[2]);
		let trace = {
			filepath: '',
			line: 0,
			column: 0
		};
		if (match) trace = {
			filepath: match[1],
			line: match[2],
			column: match[3]
		};
		if (this.index === 0) log = `\n---- Script start ---- on '${trace.filepath}'\n`;
		const l = `${log_format(25, `[${curdate.getDate()}/${curdate.getMonth()+1}/${curdate.getFullYear()}  ${curdate.getHours()}:${curdate.getMinutes()}:${curdate.getSeconds()}.${curdate.getMilliseconds()}]`, '-', `(${this.index++})`)}`;
		const r = `${log_format(10, `${trace.line}:${trace.column}`,'|',message.split('\n').join(' \\ '))}`;
		log += log_format(35, l, '---', r);
		fs.appendFileSync(this.destination, `${log}\n`);
	}
}

module.exports = { LOG };