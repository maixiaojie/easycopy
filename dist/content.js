chrome.runtime.onConnect.addListener(function (port) {//建立监听
    if(port.name == "firstPort"){//判断通道名称
        port.onMessage.addListener(function (msg) {//监听消息
            if(msg.event== "getData"){
                getSomeValue(function(rs) {
                	port.postMessage({event: "returnData", data : rs});//向扩展返回消息
                })
            };
        });
    }
    if(port.name == "writePage") {
    	port.onMessage.addListener(function (msg) {//监听消息
            if(msg.event== "writePage"){  
            	writeToPage(msg.data, function(data) {            	
            		port.postMessage({event: "writeOK", rs : data});//向扩展返回消息
            	})            	                
            };
        });
    }

});
function writeToPage(data, callback) {
	if(typeof data == "object") {
		var tbody = $("#layui-layer-iframe1").contents().find('#userDefinedResTbl').find('tr');
		var resourceKey = tbody.find('input[name="resourceKey"]');
		var len = resourceKey.length;
		if(len > 0) {
			for(var i in data) {
				for(var j=0; j<len; j++) {
					if($(resourceKey[j]).val() == data[i].resourceKey) {
						$(resourceKey[j]).closest('tr').find('input[name="resourceValue"]').val(data[i].resourceValue);
						$(resourceKey[j]).closest('tr').find('input[name="resourceDesc"]').val(data[i].resourceDesc);
						callback('changed success');
						break;
					}else {	
						var html = '<tr><td><input type="text" class="w160" value="'+data[i].resourceKey+'" name="resourceKey"></td><td><input type="text" class="w160" name="resourceValue" value="'+data[i].resourceValue+'"></td><td><input type="text" name="resourceDesc" value="'+data[i].resourceDesc+'"></td><td class="centerAlign" style="text-align: center;font-size: 125%;"><a href="javascript:void(0)" onclick="deleteRow(this)"><i class=" ">-</i></a></td></tr>'
						tbody.closest('tbody').append(html);
						callback('added success');
						break;
					}
				}
			}
		}
		
	}
}
function getSomeValue(callback) {
	try {
		var tbody = $("#layui-layer-iframe1").contents().find('#userDefinedResTbl').find('tr');
	    var len = tbody.length;
	    var arr = [];
	    if(len > 0) {
	        tbody.each(function(i, e) {
	                arr.push({
	                    resourceKey : $(this).find('input[name="resourceKey"]').val(),
	                    resourceValue : $(this).find('input[name="resourceValue"]').val(),
	                    resourceDesc : $(this).find('input[name="resourceDesc"]').val()
	                })           
	        })
	        callback(arr);
	    }else {
	    	callback('');
	    }
	}catch(e) {
		callback('');
	}    
}
