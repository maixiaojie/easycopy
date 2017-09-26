<template>
	<div id="app">
		<p class="text-center app-title">Easy Copy</p>
		<el-row :gutter="20">
			<el-col :span="24">			
				<el-tooltip class="item" effect="dark" content="从当前页面中获取环境变量" placement="bottom">
					<el-button type="primary" @click="getCurrent()" style="">抓取环境变量</el-button>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" content="从localStorage中获取已保存的环境变量" placement="bottom">
					<el-button type="primary" @click="getLocalStorage()" style="">获取localStorage</el-button>
				</el-tooltip>
				<el-tooltip class="item" effect="dark" content="手动添加环境变量" placement="bottom">
					<el-button v-show="isShowAdd" type="primary" @click="dialogFormVisible = true">添加</el-button>
				</el-tooltip>
			</el-col>
		</el-row>

		<el-row type="flex" justify="space-between" :gutter="20" style="margin-top: 20px">
			<el-col :span="24">
				<open :open-data="fa" :isShowSave="isShowSave" :isShowDel="isShowDel"></open>
			</el-col>
		</el-row>
		<div class="text description"><b style="color: #20a0ff;outline: none">description</b>: 该插件可以获取openBridge中APP环境配置信息，可保存到Storage，在另一个APP中写入到对应位置。</div>
		<div class="text-right text" style="margin-top: 5px">
			基于vuejs/源码在<a href="https://github.com/maixiaojie/easycopy" target="_blank" style="color: #20a0ff;outline: none">这里</a>
		</div>

		<el-dialog title="添加环境变量" :visible.sync="dialogFormVisible">
		  <el-form :model="form">
		    <el-form-item label="key" :label-width="formLabelWidth">
		      <el-input v-model="form.resourceKey" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="value" :label-width="formLabelWidth">
		      <el-input v-model="form.resourceValue" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="description" :label-width="formLabelWidth">
		      <el-input v-model="form.resourceDesc" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible =false">取 消</el-button>
		    <el-button type="primary" @click="addOneData">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import Open from './components/open'
	import storage from './storage'

	export default {
		name: 'app',
		components: {
			Open
		},
		data() {
			return {								
				form : {
					resourceKey : '',
					resourceValue : '',
					resourceDesc : ''
				},
				fa : [],
				isShowSave : false,
				isShowDel : false,
				isShowAdd : true,
				env : process.env.NODE_ENV,
				formLabelWidth: '120px',
				dialogFormVisible: false				
			}
		},
		created(){
			this.init()
		},
		methods: {
			init(){									
			},
			//添加环境变量，保存按钮点击事件
			addOneData() {
				this.fa.push(this.form);
				this.form = {resourceKey :'', resourceValue : '', resourceDesc : ''};
				this.dialogFormVisible = false;
			},
			getLocalStorage() {
				this.isShowDel = true;
				this.isShowSave = false;
				this.isShowAdd = false;
				storage.get('EV').then(rs => {					
					this.fa = rs;
				});
			},
			getCurrent() {
				this.isShowDel = false;
				this.isShowSave = true;
				this.isShowAdd = true;
				var that = this;
				if(this.env == 'development') {
					this.fa = this.loadData();
				}
				if(this.env == 'production') {
					chrome.tabs.query(
				    {active: true, currentWindow: true},
				    function (tabs) {
				        var port = chrome.tabs.connect(//建立通道
				            tabs[0].id,
				            {name: "firstPort"}//通道名称
				        );				        
				     	port.postMessage({event: "getData"});//向通道中发送消息				       
				        port.onMessage.addListener(function (msg) {//这里同时利用通道建立监听消息，可以监听对方返回的消息
				            if(msg.event== "returnData"){
				                try {
									var json = msg.data;
									if(typeof json == 'object') {
										that.fa = json;
									}													
								}catch(e) {
									that.fa = [];
								}	
				            };
				        });
				    });
				}
				
			},					
			loadData(){
				return [{"resourceKey":"bpm_url","resourceValue":"http://bpm.train.qhgrain.cn","resourceDesc":"描述"},{"resourceKey":"redisManagerPort","resourceValue":"6379","resourceDesc":"description"},{"resourceKey":"checkLoginIp","resourceValue":"http://iam.train.qhgrain.cn","resourceDesc":"hah "}];
			}
		}
	}
</script>
