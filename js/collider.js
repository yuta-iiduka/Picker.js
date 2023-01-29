console.log("collider.js is called.");
// ■Colliderクラスは以下の機能を提供します
//① 移動機能
//② リサイズ機能
//③ ①②のONOFFボタン
// ■依存：jquery-3.6.0.min.js

class Collider{
	// 共通カウンタ
	static cnt = 0;
	// 全Colliderオブジェクトのリスト
	static list = [];
	// アクティブなColliderオブジェクト
	static active_collider = null;
	
	//コンストラクタ
	//TODO：カプセル化
	constructor(){
		this.x = 0;
		this.y = 0;
		this.kind = "";
		this.id   = Collider.cnt;
		this.body = $("body");;
		this.jquery_obj = null;
		this.active = false;		//Colliderの有効・無効
		this.move = false;			//移動判定
		this.resize_l = false;		//X方向リサイズ判定
		this.resize_r = false;		//X方向リサイズ判定
		this.resize_y = false;		//Y方向リサイズ判定
		Collider.list.push(this);
		Collider.cnt++;
	}
	
	//説明：JQueryオブジェクトのセッター
	//引数：JQueryオブジェクト
	//戻値：自インスタンス
	set_jquery_obj(jquery_obj){
		this.jquery_obj = jquery_obj;
		return this;
	}
	
	//説明：移動イベントを与える関数
	//引数：なし
	//戻値：自インスタンス
	set_collider(){
		let self = this;
		let wid  = 0;
		let hei  = 0;
		this.body.css("position","relative").css("height","100vh").css("width","100vw");
		this.jquery_obj.css("position","fixed");
		
		// PC
		this.jquery_obj.mousedown(function(e){
			if(self.active == true){
				self.move = true;
				wid = e.pageX - self.jquery_obj.offset()["left"];
				hei = e.pageY - self.jquery_obj.offset()["top"];
			}
		});
		this.body.mousemove(function(e){
			if(self.move == true){
				e.preventDefault();
				self.x = e.pageX - wid; //self.jquery_obj.width() / 2;
				self.y = e.pageY - hei;  //self.jquery_obj.height() / 2 ;
				self.jquery_obj.offset({"top": self.y ,"left": self.x});
				window.getSelection().removeAllRanges();
			}
		});
		this.body.mouseup(function(e){
			self.move = false;
		});
		this.jquery_obj.mouseup(function(e){
			self.move = false;
		});
		
		// Android
		this.jquery_obj.bind("touchstart",function(e){
			if(self.active == true){
				self.move = true;
				wid = e.changedTouches[0].pageX - self.jquery_obj.offset()["left"];
				hei = e.changedTouches[0].pageY - self.jquery_obj.offset()["top"];
			}
		});
		this.body.bind("touchmove",function(e){
			if(self.move == true){
				self.x = e.changedTouches[0].pageX - wid; //self.jquery_obj.width() / 2;
				self.y = e.changedTouches[0].pageY - hei; //self.jquery_obj.height() / 2;
				self.jquery_obj.offset({"top": self.y ,"left": self.x})
				window.getSelection().removeAllRanges();
			}
		});
		this.body.bind("touchend",function(e){
			self.move = false;
		});
		this.jquery_obj.bind("touchend",function(e){
			self.move = false;
		});
		return this;
	}
	
	//説明：リサイズイベントを与える関数
	//引数：なし
	//戻値：自インスタンス
	set_frame(){
		let self = this;
		//self.jquery_obj.offset(),width(),height() は毎回取得する
		//TODO:ここはかなり冗長な書き方なので改善が必要
		
		// PC
		this.jquery_obj.mousemove(function(e){
			if(self.active == true){
				if(e.pageY >= self.jquery_obj.offset()["top"] - 1 && e.pageY <= self.jquery_obj.offset()["top"] + 5){
					self.jquery_obj.css("cursor","move");
				}else if(e.pageY >= self.jquery_obj.offset()["top"] + self.jquery_obj.height() - 5 && e.pageY <= self.jquery_obj.offset()["top"] + self.jquery_obj.height()+1){
					self.jquery_obj.css("cursor","ns-resize");
				}else if(e.pageX >= self.jquery_obj.offset()["left"] - 1 && e.pageX <= self.jquery_obj.offset()["left"] + 5){
					self.jquery_obj.css("cursor","ew-resize");
				}else if(e.pageX >= self.jquery_obj.offset()["left"] + self.jquery_obj.width() - 5 && e.pageX <= self.jquery_obj.offset()["left"] + self.jquery_obj.width()+1){
					self.jquery_obj.css("cursor","ew-resize");
				}else{
					self.jquery_obj.css("cursor","default");
				}
			}
		});
		this.body.mousemove(function(e){
			//リサイズモードだった場合
			if(self.resize_y == true){
				self.jquery_obj.height(e.pageY - self.jquery_obj.offset()["top"]);
				window.getSelection().removeAllRanges();
			}
			if(self.resize_l == true){
				self.jquery_obj.width(self.jquery_obj.width() + self.jquery_obj.offset()["left"] - e.pageX )
								.offset({
									"top" :self.jquery_obj.offset()["top"],
									"left":e.pageX
								})
				window.getSelection().removeAllRanges();
			}
			if(self.resize_r == true){
				self.jquery_obj.width(e.pageX - self.jquery_obj.offset()["left"]);
				window.getSelection().removeAllRanges();
			}
		});
		this.body.mousedown(function(e){
			if(self.active == true){
				if(e.pageY >= self.jquery_obj.offset()["top"] - 1 && e.pageY <= self.jquery_obj.offset()["top"] + 5){
					//self.resize_y = true;
				}else if(e.pageY >= self.jquery_obj.offset()["top"] + self.jquery_obj.height() - 5 && e.pageY <= self.jquery_obj.offset()["top"] + self.jquery_obj.height() + 1){
					if(e.pageX >= self.jquery_obj.offset()["left"] && e.pageX <= self.jquery_obj.offset()["left"] + self.jquery_obj.width()){
						self.resize_y = true;
						self.move = false;
					}
				}
				if(e.pageX >= self.jquery_obj.offset()["left"] - 1 && e.pageX <= self.jquery_obj.offset()["left"] + 5){
					if(e.pageY >= self.jquery_obj.offset()["top"] && e.pageY <= self.jquery_obj.offset()["top"] + self.jquery_obj.height()){
						self.resize_l = true;
						self.move = false;
					}
				}else if(e.pageX >= self.jquery_obj.offset()["left"] + self.jquery_obj.width() - 5 && e.pageX <= self.jquery_obj.offset()["left"] + self.jquery_obj.width() + 1){
					if(e.pageY >= self.jquery_obj.offset()["top"] && e.pageY <= self.jquery_obj.offset()["top"] + self.jquery_obj.height()){
						self.resize_r = true;
						self.move = false;
					}
				}
			}
		});
		this.body.mouseup(function(e){
			self.resize_r = false;
			self.resize_l = false;
			self.resize_y = false;
		});
		
		// Android
		this.jquery_obj.bind("touchstart",function(e){
			let epageX = e.changedTouches[0].pageX;
			let epageY = e.changedTouches[0].pageY;
			if(self.active == true){
				if(epageY >= self.jquery_obj.offset()["top"] - 1 && epageY <= self.jquery_obj.offset()["top"] + 5){
					//self.resize_y = true;
				}else if(epageY >= self.jquery_obj.offset()["top"] + self.jquery_obj.height() - 5 && epageY <= self.jquery_obj.offset()["top"] + self.jquery_obj.height() + 1){
					self.resize_y = true;
					self.move = false;
				}
				if(epageX >= self.jquery_obj.offset()["left"] - 1 && epageX <= self.jquery_obj.offset()["left"] + 5){
					self.resize_l = true;
					self.move = false;
				}else if(epageX >= self.jquery_obj.offset()["left"] + self.jquery_obj.width() - 5 && epageX <= self.jquery_obj.offset()["left"] + self.jquery_obj.width() + 1){
					self.resize_r = true;
					self.move = false;
				}
			}
		});
		this.body.bind("touchmove",function(e){
			let epageX = e.changedTouches[0].pageX;
			let epageY = e.changedTouches[0].pageY;
			//リサイズモードだった場合
			if(self.resize_y == true){
				self.jquery_obj.height(epageY - self.jquery_obj.offset()["top"]);
				window.getSelection().removeAllRanges();
			}
			if(self.resize_l == true){
				self.jquery_obj.width(self.jquery_obj.width() + self.jquery_obj.offset()["left"] - epageX )
								.offset({
									"top" :self.jquery_obj.offset()["top"],
									"left":epageX
								})
				window.getSelection().removeAllRanges();
			}
			if(self.resize_r == true){
				self.jquery_obj.width(epageX - self.jquery_obj.offset()["left"]);
				window.getSelection().removeAllRanges();
			}
		});
		this.body.bind("touchend",function(e){
			self.resize_r = false;
			self.resize_l = false;
			self.resize_y = false;
		});
		return this;
	}
	
	//説明：Colliderオブジェクトリストのゲッター（Colliderグループ検索）
	//引数：文字列
	//戻値：Colliderオブジェクト
	get_collider_list_by_kind(kind){
		let target = [];
		for(let i=0; i<Collider.list.length; i++){
			if(Collider.list[i].kind == kind){
				target.push(Collider.list[i]);
			}
		}
		return target;
	}
	
	//説明：Colliderオブジェクトのゲッター（ColliderID検索）
	//引数：文字列
	//戻値：Colliderオブジェクト	
	get_collider_by_id(id){
		let target = null;
		for(let i=0; i<Collider.list.length; i++){
			if(Collider.list[i].id == id){
				target = Collider.list[i];
			}
		}
		return target;
	}
	
	//説明：Collider機能のONOFF
	//引数：なし
	//戻値：なし
	change_mode(){
		if(this.active == true){
			this.active = false;
			this.jquery_obj.removeClass("border border-primary");
		}else{
			this.active = true;
			this.jquery_obj.addClass("border border-primary");
		}
	}
	
	//説明：Collider機能のONOFFボタン
	//引数：なし
	//戻値：なし
	set_button(){
		let self = this;
		//this.jquery_obj.attr("contenteditable","true");
		this.jquery_obj.prepend('<div class="d-flex flex-row-reverse bd-highlight"><span><i id="settings' + this.id + '" class="bi bi-gear-fill"></i><i id="settings_ok' + this.id + '" class="bi bi-check-circle-fill"></i></span></div>');
		let btn = $("#settings" + this.id);
		let btn_ok = $("#settings_ok" + this.id)
		btn.css("cursor","pointer")
			.css("position","relative");
		btn_ok.css("cursor","pointer")
			.css("position","relative");
		btn.click(function(){
			self.change_mode();
			btn.css("display","none");
			btn_ok.css("di	splay","inline-block");
		});
		btn_ok.click(function(){
			self.change_mode();
			btn.css("display","inline-block");
			btn_ok.css("display","none");
		});
		btn_ok.css("display","none");
		return this;
	}
}
