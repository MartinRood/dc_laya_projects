var dc;
(function (dc) {
    /**
     * 事件
     * @author hannibal
     * @time 2017-7-6
     */
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.m_DicFuns = {};
            this.m_EvtArgs = new dc.EventArgs();
        }
        EventDispatcher.prototype.AddEventListener = function (type, context, fun) {
            if (this.m_DicFuns[type] == null) {
                this.m_DicFuns[type] = [];
                this.m_DicFuns[type].push(LayaHandler.create(context, fun, null, false));
            }
            else {
                var arr = this.m_DicFuns[type];
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var item = arr_1[_i];
                    if (item.caller == context && item.method == fun)
                        return;
                }
                arr.push(LayaHandler.create(context, fun, null, false));
            }
        };
        EventDispatcher.prototype.RemoveEventListener = function (type, context, fun) {
            var arr = this.m_DicFuns[type];
            if (arr == null)
                return;
            for (var i = 0; i < arr.length; ++i) {
                var item = arr[i];
                if (item.caller == context && item.method == fun) {
                    item.recover();
                    arr.splice(i, 1);
                    break;
                }
            }
        };
        EventDispatcher.prototype.DispatchEvent = function (type, args) {
            args.Type = type;
            var arr = this.m_DicFuns[type];
            if (arr == null)
                return;
            for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
                var item = arr_2[_i];
                item.runWith(args);
            }
        };
        EventDispatcher.prototype.Dispatch = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.m_EvtArgs.Init(args);
            this.DispatchEvent(type, this.m_EvtArgs);
        };
        EventDispatcher.prototype.Clear = function () {
            dc.DicUtils.ClearDic(this.m_DicFuns);
        };
        return EventDispatcher;
    }());
    dc.EventDispatcher = EventDispatcher;
})(dc || (dc = {}));
//# sourceMappingURL=EventDispatcher.js.map