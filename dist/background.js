chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.cmd == 'getData') {
		chrome.tabs.query({active: true}, function(tabs) {
			console.log(tabs)
			try {
				chrome.tabs.sendMessage(tabs[0].id, {cmd : 'getDataFromContent'}, function(response) {
					console.log('从content_script拿到数据：');
					console.log(response);
					sendResponse(response);					
				})
				return true;
			}catch(e) {
				sendResponse('什么都没拿到');
				console.warn('what funny...');
				return true;
			}
			
		})
		
		
	}else  {
		return true;
	}
});