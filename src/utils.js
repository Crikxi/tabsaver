export function withDefault(obj, def){
	if(obj === null || typeof obj === "undefined"){
		return def;
	}
	return obj;
}

export function sleep(n){
	return new Promise(resolve => {
		setTimeout(resolve, n);
	});
}

export function pipe(obj, ...fns){
	return fns.reduce((c, fn)=>{
		return (c instanceof Promise) ? c.then(c => fn(c)) : fn(c);
	}, obj);
}

export async function saveFile(value, fileName, fileType="application/json"){
	const host = document.body;
	const blob = new Blob([value], {type: fileType});
	const url = URL.createObjectURL(blob);

	await browser.downloads.download({
		url,
		filename: fileName,
		saveAs: true,
	});
}

export function readFile(accept = ".json"){
	function readContent(file){
		return new Promise(resolve => {
			const fr = new FileReader();
			fr.onload = function(e){
				resolve(e.target.result);
			}
			fr.readAsText(file);
		})
	}
	return new Promise((resolve, reject) => {
		const input = document.createElement("input");
		const host = document.body;
		input.type = "file";
		input.accept = accept;
		input.value = null;
		input.style.display = "none";
		host.appendChild(input);
		input.addEventListener("change", async function(e) {
			if (e.target.files.length < 1) {
				reject(new Error("no file was selected"));
			}
			try{
				resolve(await readContent(e.target.files[0]));
				host.removeChild(input);
			} catch (e) {
				reject(new Error("error while reading import file"));
				host.removeChild(input);
			}
			host.removeChild(input);
		}, false);
		input.click();
	})
}

export async function readFileAsJson(){
	return JSON.parse(await readFile());
}

export function first(array, fn){
	for(let item of array){
		if(fn(item)) return item;
	}
	return null;
}

export function firstIndex(array, fn){
	const item = first(array, fn);
	return array.indexOf(item);
}

export function setsAreEqual(setA, setB){
	setB = setB.slice(0);
	if(setA.length !== setB.length){
		return false;
	};
	for(let item of setA){
		if(setB.length < 1) return false;
		const index = setB.indexOf(item);
		if (index === -1){
			return false;
		};
		setB.splice(index, 1);
	}
	return true;
}

export function live(parent, selector, event, fn, capture = false) {
	parent.addEventListener(
		event,
		function(e) {
			if (e.target.matches(selector)) {
				fn.call(e.target, e);
			}
		},
		capture
	);
}

export function once(node, type, fn, capture = false) {
	return node.addEventListener(type, function handler(e) {
		node.removeEventListener(type, handler);
		return fn.call(node, e);
	}, capture);
}

export function oneOf(obj, ...subjs){
	for(let subj of subjs){
		if(obj === subj) return true;
	};
	return false;
}

export function strAfter(str, search){
	if(str.indexOf(search) === -1) return str;
	return str.substr(str.indexOf(search) + search.length);
}

export function getKey(obj, key, def = null){
	if(key in obj) return obj[key];
	return def;
}

export function padLeft(length, padder = " ", str){
	str = str.toString();
	if(str.length >= length) return str;
	return padder.repeat(length - str.length) + str;
}

export function parseQuery(query){
	return query
	.substr(1)
	.split("&")
	.map(x => {
		return x
		.split("=")
		.map(x => decodeURIComponent(x));
	}).reduce((c, x) => {
		c[x[0]] = x[1];
		return c;
	}, {});
}

export function findParent(el, selector){
	while((el = el.parentElement) && !el.matches(selector) && el !== document){}
	return el;
}

export async function tryOR(fn, def = null){
	try{
		return await fn();
	} catch (e) {
		return def;
	}
}