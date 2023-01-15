console.log("tree.js is called.");
// ■Treeクラスは以下の機能を提供します
//① 親子関係
//② ルートの取得機能
//③ グループや名前での検索
// ■依存：jquery-3.6.0.min.js
class Tree{
	// 共通カウンタ
	static cnt = 0;
	// 全Treeオブジェクトのリスト
	static list = [];
	// アクティブなTreeオブジェクト
	static active_tree = null;
	// ルート
	static route = [];
	
	//コンストラクタ
	//TODO：カプセル化
	constructor(){
		this.x = 0;
		this.y = 0;
		this.id = Tree.cnt;
		this.group = "";
		this.name = "";
		this.parent = null;
		this.child = [];
		this.original = null;
		Tree.list.push(this);
		Tree.cnt++;
	}
	
	//説明：親Treeのセッター
	//引数：Treeオブジェクト
	//戻値：自インスタンス
	set_parent(t){
		if(t != this){
			this.parent = t;
			if(t.child.includes(this)){
				t.set_child(this);
			}
		}else{
			console.log("Tree id:" + t.id + " Treeオブジェクトは自身を親にすることはできません。");
		}
		return this;
	}
	
	//説明：子Treeのセッター
	//引数：Treeオブジェクト
	//戻値：自インスタンス
	set_child(t){
		if(this.child.includes(t)){
			console.log("Tree id:" + t.id + " 同じTreeオブジェクトは子にすることはできません。");
		}else{
			this.child.push(t);
		}
		if (t.parent = null){
			t.set_parent(this);
		}
		return this;
	}

	//説明：Treeオブジェクトリストのゲッター（Tree名検索）
	//引数：文字列
	//戻値：Treeオブジェクト	
	get_tree_list_by_name(name){
		let target = [];
		for(let i=0; i<Tree.list.length; i++){
			if(Tree.list[i].name == name){
				target.push(Tree.list[i]);
			}
		}
		return target;
	}
	
	//説明：Treeオブジェクトリストのゲッター（Treeグループ検索）
	//引数：文字列
	//戻値：Treeオブジェクト
	get_tree_list_by_group(group){
		let target = [];
		for(let i=0; i<Tree.list.length; i++){
			if(Tree.list[i].group == group){
				target.push(Tree.list[i]);
			}
		}
		return target;
	}
	
	//説明：Treeオブジェクトのゲッター（TreeID検索）
	//引数：文字列
	//戻値：Treeオブジェクト	
	get_tree_by_id(id){
		let target = null;
		for(let i=0; i<Tree.list.length; i++){
			if(Tree.list[i].id == id){
				target = Tree.list[i];
			}
		}
		return target;
	}
	
	//説明：始祖Treeオブジェクトのゲッター
	//引数：なし
	//戻値：Treeオブジェクト	
	get_original(){
		let target = null;
		if(this.parent == null){
			target = this;
		}else{
			target = this.parent.get_original();
		}
		return target;
	}
	
	//説明：起点から始祖までのTreeオブジェクトリストのセッター
	//引数：なし
	//戻値：なし	
	set_route(){
		Tree.route.push(this);
		if(this.parent != null){
			this.parent.set_route();
		}
	}

	//説明：起点から始祖までのTreeオブジェクトリストのゲッター
	//引数：なし
	//戻値：Treeオブジェクトリスト	
	get_route(){
		Tree.route = [];
		this.set_route();
		return Tree.route;
	}

}


// ■TreeObjectクラスは以下の機能を提供します
//①リサイズ・移動可能な親子関係をもつJQueryオブジェクト
class TreeObject extends Tree{
	// 共通カウンタ
	static cnt = 0;
	// 全Treeオブジェクトのリスト
	static list = [];
	
	constructor(id){
		super();
		this.border_default_color = "border border-primary"
		this.border_clicked_color = "border border-warning"
		this.jquery_obj = $("#"+id).addClass(this.border_default_color);
		this.collider = new Collider()
						.set_jquery_obj(this.jquery_obj)
						.set_collider()
						.set_frame()
						.set_button();
		this.set_draw_event();
		TreeObject.list.push(this);
	}
	
	set_jquery_obj(jquery_obj){
		this.collider.jquery_obj = jquery_obj;
		return this;
	}
	
	//説明：①子TreeObjectオブジェクトのセッター
	//　　　②クリック時のイベント（子->親の可視化）を付与する
	//引数：Treeオブジェクトもしくはそのサブクラスオブジェクト
	//戻値：自インスタンス
	set_child(t){
		super.set_child(t);
		let self = this;
		let cls = this.border_clicked_color
		let def = this.border_default_color
		if (t.jquery_obj != undefined ){
			t.jquery_obj.mousedown(function(e){
				self.jquery_obj.removeClass(def);
				self.jquery_obj.addClass(cls);
				if(t.jquery_obj != undefined){
					t.jquery_obj.removeClass(def);
					t.jquery_obj.addClass(cls);
				}
			});
			t.jquery_obj.mouseup(function(e){
				self.jquery_obj.removeClass(cls);
				self.jquery_obj.addClass(def);
				if(t.jquery_obj != undefined){
					t.jquery_obj.removeClass(cls);
					t.jquery_obj.addClass(def);
				}
			});
		}
	}
	
	//説明：TreeObjectオブジェクトのクリック時イベント（親->子の可視化）を付与する
	set_draw_event(){
		let self = this;
		let cls = this.border_clicked_color
		let def = this.border_default_color
		this.jquery_obj.mousedown(function(e){
			self.jquery_obj.removeClass(def);
			self.jquery_obj.addClass(cls);
			for(let i=0; i<self.child.length; i++){
				if(self.child[i].jquery_obj != undefined){
					self.child[i].jquery_obj.removeClass(def);
					self.child[i].jquery_obj.addClass(cls);
				}
			}
		});
		
		this.jquery_obj.mouseup(function(e){
			self.jquery_obj.removeClass(cls);
			self.jquery_obj.addClass(def);
			for(let i=0; i<self.child.length; i++){
				if(self.child[i].jquery_obj != undefined){
					self.child[i].jquery_obj.removeClass(cls);
					self.child[i].jquery_obj.addClass(def);
				}
			}
		});
	}
}

// ■Gridクラスは以下の機能を提供します
//①JQueryオブジェクトの画面配置管理
//②JQueryオブジェクトのリサイズ監視


class Grid{
	constructor(w,h){
		this.w = w;
		this.h = h;
		this.jquery_obj_list = [];
		this.grid_
		this.x_list = this.set_gridX();
		this.y_list = this.set_gridY();
		this.body = $("body");
		this.set_grid_event();
		this.active = false;
	}
	
	set_jquery_obj(jquery_obj){
		let self = this;
		this.jquery_obj_list.push(jquery_obj);
		jquery_obj.click(function(){
			self.active = true;
		});
		return this;
	}
	
	set_gridX(){
		let grid_list = [];
		for(let i=0; i<window.innerWidth; i+=this.w){
			grid_list.push(i);
		}
		return grid_list;
	}
	
	set_gridY(){
		let grid_list = [];
		for(let i=0; i<window.innerHeight; i+=this.h){
			grid_list.push(i);
		}
		return grid_list;
	}
	
	set_grid_event(){
		let self = this;
		this.body.mouseup(function(e){
			if (self.active == true){
				for(let i=0; i<self.jquery_obj_list.length; i++){
					let obj = self.jquery_obj_list[i];
					let grid_x = obj.offset()["left"] - (obj.offset()["left"] % self.w);
					let grid_y = obj.offset()["top"]  - (obj.offset()["top"] % self.h);
					let grid_w = obj.width()  - (obj.width()  % self.w);
					let grid_h = obj.height() - (obj.height() % self.h);
					
					//グリッド横幅
					if (grid_w > self.w){
						obj.width(grid_w);
					}else{
						obj.width(self.w * 2);
					}
					
					//グリッド縦幅
					if (grid_h > self.h){
						obj.height(grid_h);
					}else{
						obj.height(self.h * 2);
					}
					//グリッド座標
					obj.offset({"top":grid_y,"left":grid_x});
				}
			}
		});
	}
	
	draw(){
		this.body.css("background-size",this.w + "px " + this.h + "px")
				.css("background-position","0% 0%")
				.css("background-image","repeating-linear-gradient(90deg,#000,#000 1px,transparent 1px,transparent "+this.w+"px),repeating-linear-gradient(0deg,#000,#000 1px,transparent 1px,transparent "+this.h+"px)")
		return this;
	}
}

