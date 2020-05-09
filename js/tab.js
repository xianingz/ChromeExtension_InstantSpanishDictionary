document.getElementById("conj").addEventListener("click", SwitchCon);
document.getElementById("dict").addEventListener("click", SwitchDic);

function SwitchCon(){
    $('#example').hide();
	$('#conjugate').show();
}

function SwitchDic(){
    $('#conjugate').hide();
	$('#example').show();
	
}