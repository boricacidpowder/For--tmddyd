document.addEventListener("click", (e) =>{
	
	if(e.target.innerText == '내 정보') {
	   document.querySelector("body > div > div.row > div > div > h3").innerText = "송승용"
	}
	
	if(e.target.innerText == '송승용'){
		
		document.querySelector("body > div > div.row > div > div > p").innerText += "\n 생일 : 1999-01-14"
	}
	
	
	
	/*if(e.target.innerText == '송승용'){
		location.href='/listpost'
		//document.querySelector("#navbarSupportedContent > ul > li:nth-child(3) > a").click()

	}*/
});
/*
$(document).bind('keydown', (e) => {

	if( e.which == 70 & e.ctrlKey ) {
		alert("dfmf");
		document.querySelector("#search-input").click()
}
});
*/
// window.onkeydown = function() {
// 	var kcode = event.keyCode;
// 	console.log(event.keyCode);
// 	if(kcode == 70 && kcode.ctrlKey == true){
// 		console.log(event.returnValue,' 아 일단 됨.');
// 		
// 	}
// };

window.addEventListener('keydown', (e) => {
	//console.log(e);
	if(e.code =='KeyF' && e.ctrlKey === true) {
		e.preventDefault();
		document.querySelector("#search-input").focus();
		
	}
})