<template>
	<div class="open">	
		<el-table
	    ref="multipleTable"
	    :data="openData"
	    border
	    height="260"
	    tooltip-effect="dark"
	    style="width: 100%"
	    @selection-change="handleSelectionChange">
	    <el-table-column
	      type="selection"
	      width="55">
	    </el-table-column>
	    <el-table-column
	      label="key"
	      prop="resourceKey"
	      >
	    </el-table-column>
	    <el-table-column
	      prop="resourceValue"
	      label="value"
	      >
	    </el-table-column>
	    <el-table-column
	      prop="resourceDesc"
	      label="description"
	      show-overflow-tooltip>
	    </el-table-column>
	  	</el-table>
	  	<div style="margin-top: 20px">
	  		<el-tooltip class="item" effect="dark" content="将选择的数据保存到localStorage中" placement="bottom">
		  		<el-button v-show="isShowSave" @click="saveSelection()">保存</el-button>	
		  	</el-tooltip>
		  	<el-tooltip class="item" effect="dark" content="将选择的数据从localStorage中删除" placement="bottom">
		  		<el-button v-show="isShowDel" @click="delSelection()">删除</el-button>	
		  	</el-tooltip>
			<el-tooltip class="item" effect="dark" content="将选择的数据写入到当前页面" placement="bottom">
		  		<el-button @click="writePage()">写入页面</el-button>	
		  	</el-tooltip>
	  	</div>	  	
  </div>
</template>

<script>
	import storage from '../storage'
	export default {
		data(){
			return {
				multipleSelection: [],
				env : process.env.NODE_ENV				
			}
		},
		props : ['openData', 'isShowDel', 'isShowSave'],
		filters: {

		},
		computed: {

		},
		created(){
			this.$notify.info({
	          title: 'notice',
	          message: '目前可用于openBridge4.0版本！'
	        });
		},
		methods: {
	      	handleSelectionChange(val) {
	        	this.multipleSelection = val;
	      	},
	      	saveSelection() {
	      		var selection = this.$refs.multipleTable.selection;
	      		if(selection.length > 0) {
	      			//先从storage中拿出数据，当前选择的不存在就添加，保留之前的所有数据
	      			//如果当前选择的已经存在，就修改之前对应的记录
	      			storage.get('EV').then(rs => {					
						if(rs == null) {
							//如果storage是空的，直接set
							storage.set({
								EV: selection
							});
						}else {
							//如果storage中有数据，则需要在原数据基础上添加
							var concatArr = selection.concat(rs);
							storage.set({
								EV: this.array_ov(concatArr)
							});									
						}
						this.$message({
				            type: 'success',
				            message: `保存成功`
				        });	
					});					
	      		}else {
	      			this.$message({
			            type: 'warning',
			            message: `至少选择一条数据`
			        });	      			
	      		}
	      	},
	      	delSelection() {
	      		var selection = this.$refs.multipleTable.selection;
	      		if(selection.length > 0) {
	      			//先从storage中拿出数据，删除的数据在原始数据中不存在，就什么也不做
	      			//如果删除的数据在原始数据中存在，就删除该条数据，保留其余的数据
	      			storage.get('EV').then(rs => {					
						if(rs == null) {
							//do nothing
						}else {
							//如果storage中有数据，则需要在原数据基础上添加
							storage.set({
								EV: this.array_diff(rs, selection)
							});						
						}
						this.$message({
				            type: 'success',
				            message: `删除成功`
				        });	
				        const app = this.$root.$children[0];
						app.getLocalStorage();
					});
					
	      		}else {
	      			this.$message({
			            type: 'warning',
			            message: `至少选择一条数据`
			        });	      			
	      		}
	      	},
	      	writePage() {
				var selection = this.$refs.multipleTable.selection;	
				var that = this;
				console.log(selection)			
				if(this.env == 'production') {
					chrome.tabs.query(
				    {active: true, currentWindow: true},
				    function (tabs) {
				        var port = chrome.tabs.connect(//建立通道
				            tabs[0].id,
				            {name: "writePage"}//通道名称
				        );				        
				     	port.postMessage({event: "writePage", data : selection});//向通道中发送消息
				     	port.onMessage.addListener(function (msg) {//这里同时利用通道建立监听消息，可以监听对方返回的消息
				            if(msg.event== "writeOK"){
			                	that.$message({
						            type: 'success',
						            message: `页面修改成功`
						        });
				            };
				        });
				    });
				}
	      	},
	      	//数据去重，删除后面重复的
	      	array_ov(arr) {
				for(var i=0;i<arr.length;i++) {
				 	for(var j=i+1;j<arr.length;j++) {
				 		if(arr[i].resourceKey == arr[j].resourceKey){
				  			arr.splice(j,1);j--;
						} 
				 	}				  		 
				}
				return arr.sort(function(a,b){return a-b});
			},
			//数组中删除另一个数组中的元素
			array_diff(a, b) {  
			    for(var i=0;i<b.length;i++)  
			    {  
			      for(var j=0;j<a.length;j++)  
			      {  
			        if(a[j].resourceKey==b[i].resourceKey){  
			          a.splice(j,1);  
			          j=j-1;  
			        }  
			      }  
			    }   
			  return a;  
			}  
		}
	}
</script>

<style lang="less">


</style>
