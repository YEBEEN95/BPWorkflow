sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sk/siltron/bp/BPWorkflow/model/models",
	"sk/siltron/bp/BPWorkflow/DataHub",
	'sap/ui/model/json/JSONModel'
], function (UIComponent, Device, models, DataHub, JSONModel) {
	"use strict";

	return UIComponent.extend("sk.siltron.bp.BPWorkflow.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			/** 공통라이브러리
			 * _        : lodash              : https://lodash.com/
			 * _p       : Partialjs           : https://marpple.github.io/partial.js/
			 * v        : Voca                : https://vocajs.com/
			 * R        : Ramda               : https://ramdajs.com/
			 * moment   : moment              : http://momentjs.com/
			 * Q        : Q                   : https://github.com/kriskowal/q
			 * validate : validate            : https://validatejs.org/
			 * XRegExp  : Regular Expression  : http://xregexp.com/
			 */

			// 데이터허브생성
			this._h = new DataHub();
			this._h.manifest = this.getManifest();
			this._h.device = this.makeDeviceModel();
			this._h.i18n = this.getModel('i18n');

			// 컴포넌트모델 설정
			this.setModel(this._h.device, 'device');

			// 컴포넌트초기화
			UIComponent.prototype.init.apply(this, arguments);

			// 라우터초기화
			this.getRouter()
				.getTargetHandler()
				.setCloseDialogs(false);
			this.getRouter().initialize();
			this._h.router = this.getRouter();

			// ★ OData모델 설정 (추가시 DataHub.js 파일도 수정)
			this._h.bpReg = this.getModel('bpReg');
			this._h.bpInfo = this.getModel('bpInfo');
		},

		destroy: function () {
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		getContentDensityClass: function () {

			if (this._sContentDensityClass === undefined) {
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!this._h.device.getProperty('/').support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}

			return this._sContentDensityClass;
		},

		makeDeviceModel: function () {
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			return oDeviceModel;
		}
	});
});