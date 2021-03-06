module dc
{
    /**
     * 非可拖动界面基类
     * @author hannibal
     * @time 2017-7-19
     */	
	export class UIBaseView extends LayaView implements UIPanelInterface, IComponentObject, IObject, IPauseObject
	{
        protected m_IsOpen:boolean = false;
        protected m_ScreenID:number = 0;
        protected m_Component:ComponentCenter = null;
        
        constructor()
        {
            super();
            this.m_Component = new ComponentCenter();
        }
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～公共方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**打开*/
        public Setup(args:any):void
        {
            this.m_IsOpen = true;
            this.OnLangChange();
            this.OnCreate(args.slice(0));
            this.OnEnable();
            this.LoadResource();
            this.m_Component.Setup();
            EventController.DispatchEvent(UIEvent.OPEN, this.m_ScreenID);
            EventController.AddEventListener(UIEvent.Lang, this, this.OnLangChange);
        }
        /**关闭*/
        public Destroy():void
        {
            this.UnregisteGUIEvent();
            this.m_Component.Destroy();
            this.OnDisable();
            this.OnDestroy();
            this.destroy(true);
            this.m_IsOpen = false;
            EventController.DispatchEvent(UIEvent.CLOSE, this.m_ScreenID);
            EventController.RemoveEventListener(UIEvent.Lang, this, this.OnLangChange);
        }
        /**置顶*/
        public SetTopMost():void
         {
            if (this.parent) 
            {
                let p = this.parent;
                this.parent.removeChild(this);
                p.addChild(this);
            }
        }
        /**置底*/
        public SetBottomMost():void
        {
            if (this.parent) 
            {
                let p = this.parent;
                this.parent.removeChild(this);
                p.addChildAt(this, 3);
            }
        }
        /**是否可见*/
        public SetVisible(bVisible: boolean):void
        {
            let old:boolean = this.visible;
            this.visible = bVisible;
            if(old != bVisible)
            {
                if(bVisible)
                    this.OnEnable();
                else
                    this.OnDisable();
                this.m_Component.OnChangeActive(this.visible);
            }
        }  
        /**设置界面唯一id，只在UIManager设置，其他地方不要再次设置*/
        public SetScreenID(id:number):void
        {
            this.m_ScreenID = id;
        }      
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～可重写的方法，注意逻辑层不要再次调用～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**初始化，和onDestroy是一对*/
        protected OnCreate(args:any):void
        {
        }
        /**销毁*/
        protected OnDestroy():void
        {
        }
        /**每帧循环：如果覆盖，必须调用super.Update()*/
        public Update():boolean
        {
            if(this.visible)
            {
                this.m_Component.Update();
            }
            return true;
        }
        protected OnEnable():void
        {
        }
        protected OnDisable():void
        {
        }
        /**资源加载结束*/
        protected OnLoadComplete():void
        {
        }

        /**多语言;初始化，或语音设定改变时触发*/
        protected OnLangChange():void
        {
        }

        /**需要提前加载的资源
         * 例:
         *  return [
                ["res/image/1.png", Laya.Loader.IMAGE],
                ["res/image/2.png", Laya.Loader.IMAGE],
                ["res/image/3.png", Laya.Loader.IMAGE],
            ];
        */
        protected PreLoaderRes():Array<any>
        {
            return null;
        }

        /**
         * UI按钮等注册事件列表，内部会在界面销毁时，自动反注册
         * 例：
                return [ 
                    [this.m_LoginBtn, laya.events.Event.CLICK, this.OnPressLogin],
                ];
         */
        protected RegisterGUIEventMap():Array<any>
        {
            return null;
        }
        /**自定义事件注册，用于EventController派发的事件*/
        protected RegisterEvent():void
        {

        }
        protected UnRegisterEvent():void
        {
            
        }
        /**
         * 是否优化界面显示,原则：
         * 1.对于容器内有大量静态内容或者不经常变化的内容（比如按钮），可以对整个容器设置cacheAs属性，能大量减少Sprite的数量，显著提高性能。
         * 2.如果有动态内容，最好和静态内容分开，以便只缓存静态内
         * 3.容器内有经常变化的内容，比如容器内有一个动画或者倒计时，如果再对这个容器设置cacheAs=”bitmap”，会损失性能。
         * 4.对象非常简单，比如一个字或者一个图片，设置cacheAs=”bitmap”不但不提高性能，反而会损失性能。
         */
        protected StaticCacheUI(): any[] 
        {
            return null;
        }
        /**是否显示加载界面*/
        protected IsShowLoading():boolean
        {
            return false;
        }

        //～～～～～～～～～～～～～～～～～～～～～～～组件～～～～～～～～～～～～～～～～～～～～～～～//
        public AddComponent(classDef:any):ComponentBase
        {
            return this.m_Component.AddComponent(classDef, this);
        }
		public RemoveComponent(classDef:any):void
        {
            this.m_Component.RemoveComponent(classDef);
        }
		public RemoveAllComponent():void
        {
            this.m_Component.RemoveAllComponent();
        }
        public GetComponent(classDef:any):ComponentBase
        {
            return this.m_Component.GetComponent(classDef);
        }        
        //～～～～～～～～～～～～～～～～～～～～～～～暂停～～～～～～～～～～～～～～～～～～～～～～～//
        /**暂停开始时会调用该方法*/
		public OnPauseEnter():void
        {

        }

		/**暂停结束时会调用该方法*/
		public OnPauseExit():void
        {
            
        }           
        /*～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～内部方法～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～*/
        /**处理需要提前加载的资源*/
        private LoadResource():void
        {
            let assets = [];
            let res_map = this.PreLoaderRes();
            if (res_map && res_map.length > 0) 
            {
                for (let i = 0; i < res_map.length; ++i) 
                {
                    let res = res_map[i];
                    if (!ResourceManager.Instance.GetRes(res[0])) 
                    {
                        assets.push({ url: res[0], type: res[1] });
                    }
                }
            }
            if (assets.length > 0)
            {
                let load_view = eLoadViewType.None;
                if(this.IsShowLoading())load_view = eLoadViewType.Window;
                ResourceManager.Instance.LoadArrayRes(assets, LayaHandler.create(this, this.OnAssetLoaded),load_view);
            }
            else
            {
                this.OnAssetLoaded();
            }
        }
        private OnAssetLoaded():void
        {
            if(!this.m_IsOpen)return;

            //静态缓存
            let staticCacheUI = this.StaticCacheUI();
            if (staticCacheUI) 
            {
                for (let i = 0; i < staticCacheUI.length; ++i) 
                {
                    let ui = staticCacheUI[i];
                    ui.cacheAs = "bitmap";
                }
            }
            this.RegisteGUIEvent();
            this.OnLoadComplete();
        }

        /**注册界面事件*/
        private RegisteGUIEvent():void
        {
            let event_list:Array<any> = this.RegisterGUIEventMap();
            if(!event_list)return;

            for(let item of event_list)
            {
                let gui_control = <Laya.EventDispatcher>item[0];
                gui_control.on(item[1], this, item[2], item.slice(3));
            }
        }
        private UnregisteGUIEvent():void
        {
            let event_list:Array<any> = this.RegisterGUIEventMap();
            if(!event_list)return;

            for(let item of event_list)
            {
                let gui_control = <Laya.EventDispatcher>item[0];
                gui_control.off(item[1], this, item[2]);
            }
        }
	}
}