sap.ui.define([
	'sap/m/MessageToast',
	"sk/siltron/bp/BPWorkflow/controller/common/BaseController",
	"sap/ui/core/message/Message",
	"sap/ui/core/Fragment",
], function (MessageToast, BaseController, Message, Fragment) {
	"use strict";

	return BaseController.extend("sk.siltron.bp.BPWorkflow.controller.Main", {

		/* =========================================================== */
		/* 라이프사이클 메서드 */
		/* =========================================================== */
		onInit: function () {

			// 전역변수
			this._h = this.getDataHub();

			// 모델생성
			var self = this;
			this._h.mainData = this.createJSONModel();
			this._h.mainData.setData(this._h.mainDataInitData);

			this._h.mainView = this.createJSONModel();
			this._h.mainView.setData(this._h.mainViewInitData);

			// 모델등록
			this.getView().setModel(this._h.mainData, 'mainData');
			this.getView().setModel(this._h.mainView, 'mainView');
			this.getView().setModel(this._h.detailView, 'detailView');

			// 이벤트등록
			this.getRouter().getRoute('main').attachPatternMatched(this.onPatternMatched, this);

			// 화면설정
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			//F4데이터 설정

			// Register Message Model
			this.oMessageManager = sap.ui.getCore().getMessageManager();
			this.oMessageModel = this.oMessageManager.getMessageModel();
			this.oMessageModelBinding = this.oMessageModel.bindList('/', undefined, []);
			this.getView().setModel(this.oMessageModel, "message");
			this.oMessageModelBinding.attachChange(this.onMessageBindingChange, this);
			this.oMessageManager.registerObject(this.getView(), true);
		},

        /**
         * 리소스를 삭제한다
         */
		onExit: function () {

		},

		onMessageBindingChange: function (oEvent) {
			var aContexts = oEvent.getSource().getContexts();

			this.setError(false);

			if (!aContexts.length) {
				return;
			} else {
				var aErrorMessages = _.filter(aContexts, function (oContext) {
					return oContext.getObject().type === 'Error';
				});

				if (aErrorMessages.length) {
					this.setUIChanges(null, true);
					this.setError(true);
					if (!this.sMessageType) {
						this.showMessageToast('msgError003');
					}
				} else {
					this.setUIChanges(null, false);
				}
			}
		},

		setError: function (bError) {
			this._h.mainView.setProperty('/hasError', bError);
		},

		checkError: function () {
			return this._h.mainView.getProperty('/hasError');
		},

		checkUIChanges: function () {
			return this._h.mainView.getProperty('/hasUIChanges');
		},

		setUIChanges: function (oModel, bHasUIChanges) {
			if (this.checkError()) {
				bHasUIChanges = true;
			} else if (bHasUIChanges === undefined) {
				if (oModel) {
					bHasUIChanges = oModel.hasPendingChanges();
				}
			}

			this._h.mainView.setProperty('/hasUIChanges', bHasUIChanges);
		},

		/* ========================================================== */
        /* 이벤트핸들러
        /* =========================================================== */
		onPatternMatched: function (oEvent) {

			this.initCondition();
			this.initStatusCount();
		},

        /**
         * 이벤트처리 함수. 모든 이벤트는 여기를 통해서 처리가 된다
         * @param oEvent
         */
		onPAI: function (oEvent) {
			var sCode = this.getCustomData(oEvent, 'fcCode');

			switch (sCode) {
				case 'fcIconFilter':
					this.fcIconFilter(oEvent);
					break;
				case 'fcSearchBPRegistration':
					this.fcSearchBPRegistration(oEvent);
					break;
				case 'fcMessage':
					this.fcMessage(oEvent);
					break;
				case 'fcSelectBP':
					this.fcSelectBP(oEvent);
					break;

				case 'fcSelectBPTypeCreate':
					this.fcSelectBPTypeCreate(oEvent);
					break;
				case 'fcSelectBPTypeSearch':
					this.fcSelectBPTypeSearch(oEvent);
					break;
				case 'fcCreatewithTemplate':
					this.fcCreatewithTemplate(oEvent);
					break;
				case 'fcCreateVendor':
					this.fcCreateVendor(oEvent);
					break;
				case 'fcCancelCreate':
					this.fcCancelCreate();
					break;
				case 'fcCancelSearch':
					this.fcCancelSearch();
					break;
				case 'fcCreateVdCs':
					this.fcCreateVdCs();
					break;
				case 'fcSearchVendor':
					this.fcSearchVendor(oEvent);
					break;
				case 'fcSearchApproval':
					this.fcSearchApproval(oEvent);
					break;
				case 'fcAccept':
					this.fcAccept(oEvent);
					break;
				case 'fcReject':
					this.fcReject(oEvent);
					break;
				case 'fcApprovalDelete':
					this.fcApprovalDelete(oEvent);
					break;
				case 'fcVdSearch':
					this.fcVdSearch(oEvent);
					break;
				case 'fcBPSearch':
					this.fcBPSearch(oEvent);
					break;
				case 'fcNavSearchVendor':
					this.fcNavSearchVendor(oEvent);
					break;
				case 'fcCreateVendorTemplate':
					this.fcCreateVendorTemplate(oEvent);
					break;
				case 'fcBPSearchfield':
					this.fcBPSearchfield(oEvent);
					break;
				case 'fcRequestModification':
					this.fcRequestModification(oEvent);
					break;
				case 'fcSelectBPType':
					this.fcSelectBPType(oEvent);
					break;
				case 'fcReviewToSubmit':
					this.fcReviewToSubmit(oEvent);
					break;
			}
		},

		fcReviewToSubmit: function (oEvent) {

			this.getControl('pageMain').bindElement({
				path: oEvent.getParameters().listItem.getBindingContext('bpReg').getPath(),
				model: 'bpReg'
			});
			this._h.oToDetail = this.getControl('pageMain').getBindingContext('bpReg').getObject();
			this.getOwnerComponent().getRouter().navTo("detail");

		},

		fcCreatewithTemplate: function (oEvent) {
			this._h.mainView.setProperty('/buttonStatus', 'createTemplate');
			this.callPopupFragment('SelectVendorCustomerSearch', oEvent);
			this._h.mainView.setProperty('/vendorSelectOption/selectBPtype', ' ');
		},

		fcSelectBPType: function (oEvent) {
			var sKey = oEvent.getSource().mProperties.selectedKey;

			if (sKey === "vendor") {
				this._h.mainView.setProperty('/vendorSelectOption/selectBPtype', 'vendor');
			}
			else if (sKey === "customer") {
				this._h.mainView.setProperty('/vendorSelectOption/selectBPtype', 'customer');
			}
		},

		fcRequestModification: function (oEvent) {
			this._h.oToDetail = this.getControl('navSearchVendor__details').getBindingContext('bpInfo').getObject();

			this.getControl('BPSelect').close();
			this._h.mainView.setProperty('/status/submitCreatebtn', false);
			this.getOwnerComponent().getRouter().navTo("detail");
		},

		fcBPSearchfield: function (oEvent) {
			// add filter for search
			var aCondition = [];
			var aFilters = [];
			var sSearchCondition = oEvent.getSource().getValue();

			if (sSearchCondition) {
				aCondition.push({ field: 'BusinessPartner', op: this.OP.CONTAINS, from: sSearchCondition });
				aCondition.push({ field: 'Supplier', op: this.OP.CONTAINS, from: sSearchCondition });
				aCondition.push({ field: 'Customer', op: this.OP.CONTAINS, from: sSearchCondition });
				aCondition.push({ field: 'BusinessPartnerName', op: this.OP.CONTAINS, from: sSearchCondition });
				aCondition.push({ field: 'to_BusinessPartnerAddress/results/0/Country', op: this.OP.CONTAINS, from: sSearchCondition });
				aCondition.push({ field: 'to_BusinessPartnerAddress/results/0/CityName', op: this.OP.CONTAINS, from: sSearchCondition });
				aCondition.push({ field: 'to_BusinessPartnerAddress/results/0/to_MobilePhoneNumberPhoneNumber', op: this.OP.CONTAINS, from: sSearchCondition });
				aFilters.push(this.makeMultiFilter(aCondition, false));
			}
			// update list binding
			var oTable = this.getControl("tabBPInfo");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilters);
		},

		fcCreateVendorTemplate: function (oEvent) {
			this._h.oToDetail = this.getControl('navSearchVendor__details').getBindingContext('bpInfo').getObject();
			this.getControl('BPSelect').close();
			this._h.mainView.setProperty('/status/submitModibtn', false);
			this.getOwnerComponent().getRouter().navTo("detail");
		},

		fcNavSearchVendor: function (oEvent) {
			var sViewPrefix = this.getView().getId() + '--';

			this.getControl(sViewPrefix + 'navSearchVendor').to(sViewPrefix + 'navSearchVendor__search', 'slide');
		},

		fcSelectBP: function (oEvent) {
			var sViewPrefix = this.getView().getId() + '--';

			this.getControl(sViewPrefix + 'navSearchVendor').to(sViewPrefix + 'navSearchVendor__details', 'slide');
			this.getControl(sViewPrefix + 'navSearchVendor__details').setBindingContext(oEvent.getParameters().listItem.getBindingContext('bpInfo'));
			this.getControl(sViewPrefix + 'navSearchVendor__details').bindElement({
				path: oEvent.getParameters().listItem.getBindingContext('bpInfo').getPath(),
				model: 'bpInfo'
			});
		},

		fcIconFilter: function (oEvent) {

			var aFilters = [];
			var oTable = this.getControl('tabBPRegistration');
			var sKey = this._h.mainView.getProperty('/condition/iconKey');
			var oCondition = this._h.mainView.getProperty('/condition');

			if (sKey !== 'T') {
				aFilters.push(this.makeMultiFilter([{ field: 'reqStatus', op: this.OP.EQ, from: sKey }]));
			}

			if (oCondition.fromDate) {
				aFilters.push(this.makeMultiFilter([{
					field: 'reqDate',
					op: this.OP.BT,
					from: moment(oCondition.fromDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
					to: moment(oCondition.toDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
				}]));
			}

			oTable.getBinding('items').filter(aFilters);
		},

		fcSearchBPRegistration: function (oEvent) {

			var oTable = this.getControl('tabBPRegistration');
			var oCondition = this._h.mainView.getProperty('/condition');

			this.oMessageManager.removeAllMessages();

			if (!oCondition.fromDate) {
				var oMessage = new Message({
					message: this.getI18nText('msgError002'),
					type: 'Error',
					target: '/condition/fromDate',
					processor: this._h.mainView
				});
				this.oMessageManager.addMessages(oMessage);
				return;
			}

			var aFilters = [];
			aFilters.push(this.makeMultiFilter([{
				field: 'reqDate',
				op: this.OP.BT,
				from: moment(oCondition.fromDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
				to: moment(oCondition.toDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
			}]));

			var oBinding = oTable.getBinding('items').filter(aFilters);

			this._h.mainView.setProperty('/condition/iconKey', 'T');

			this.setStatusCount(oBinding);
		},

		fcMessage: function (oEvent) {
			if (!this.fragments['Messages']) {
				var sFragmentName = this._h.nameSpace + ".view.fragments." + 'Messages';
				this.fragments['Messages'] = sap.ui.xmlfragment(sFragmentName, this);
				this.getView().addDependent(this.fragments['Messages']);
			}
			this.fragments['Messages'].openBy(oEvent.getSource());
		},

		/**
         * Custom Function
         */
		fcSearchVendor: function (oEvent) {
			var self = this;
			var oView = this.getView();
			var sViewPrefix = this.getView().getId() + '--';

			this.closePopupFragment('SelectVendorCustomerSearch');

			// Create Popup
			if (!self.getControl('BPSelect')) {
				Fragment.load({
					id: oView.getId(),
					name: self._h.nameSpace + '.view.popup.SearchVendor',
					controller: self
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
					self.getControl(sViewPrefix + 'navSearchVendor').to(sViewPrefix + 'navSearchVendor__search', 'slide');
				});
			} else {
				self.getControl('BPSelect').open();
				self.getControl(sViewPrefix + 'navSearchVendor').to(sViewPrefix + 'navSearchVendor__search', 'slide');
			}
			if (!this._h.bpInfo.getProperty('/results/0/Customer')){
				this._h.mainView.setProperty('/select', false);
			}
				else if (!this._h.bpInfo.getProperty('/results/0/Supplier')){
					this._h.mainView.setProperty('/select', false);
				}
		},

		fcSelectBPTypeCreate: function (oEvent) {
			this._h.mainView.setProperty('/buttonStatus', 'create');
			this.callPopupFragment('SelectVendorCustomer', oEvent);
			this._h.mainView.setProperty('/vendorSelectOption/selectBPtype', ' ');
		},

		fcSelectBPTypeSearch: function (oEvent) {
			this._h.mainView.setProperty('/buttonStatus', 'find');
			this.callPopupFragment('SelectVendorCustomerSearch', oEvent);
			this._h.mainView.setProperty('/vendorSelectOption/selectBPtype', ' ');
		},

		fcCreateVendor: function (oEvent) {
			this.closePopupFragment('SelectVendorCustomer');
			this._h.mainView.setProperty('/status/submitModibtn', false);
			this.getOwnerComponent().getRouter().navTo("detail");
		},

		fcCancelCreate: function () {
			this.closePopupFragment('SelectVendorCustomer');
		},

		fcCancelSearch: function () {
			this.closePopupFragment('SelectVendorCustomerSearch');
		},

		deleteFiles: function () {
			// Delete works logic
			var iDeletedCount = _.filter(this._h.mainData.getProperty('/ApprovalData'), { selected: true }).length;

			this.showMessageToast('msgSuccess040', '20rem', [iDeletedCount]);
		},

		getReqStatusState: function (sReqStatus) {

			switch (sReqStatus) {
				case 'D':	// Draft
					return 'None';
				case 'R':	// Request
					return 'Indication04';
				case 'J':	// Reject
					return 'Indication02';
				case 'A':	// Approval
					return 'Indication05';
				case 'C':	// Cancel
					return 'Indication03';
			}
		},

		getReqStatusText: function (sReqStatus) {

			switch (sReqStatus) {
				case 'D':	// Draft
					return this.getI18nText('stDraft');
				case 'R':	// Request
					return this.getI18nText('stRequest');
				case 'J':	// Reject
					return this.getI18nText('stReject');
				case 'A':	// Approval
					return this.getI18nText('stApproval');
				case 'C':	// Cancel
					return this.getI18nText('stCancel');
			}
		},

		initStatusCount: function (oEvent) {

			this.fcSearchBPRegistration();
		},

		initCondition: function (oEvent) {
			this._h.mainView.setProperty('/condition/fromDate', moment(new Date()).subtract(1, 'months').toDate());
			this._h.mainView.setProperty('/condition/toDate', new Date());
		},

		setStatusCount: function (oBinding) {
			var oStatusCount = this._h.mainView.getProperty('/statusCount');
			oStatusCount.total = 0;
			oStatusCount.draft = 0;
			oStatusCount.request = 0;
			oStatusCount.reject = 0;
			oStatusCount.approval = 0;
			oStatusCount.cancel = 0;

			_.forEach(oBinding.getContexts(0, Infinity), function (oContext) {
				var oItem = oContext.getObject();
				oStatusCount.total++;
				switch (oItem.reqStatus) {
					case 'D':
						oStatusCount.draft++;
						break;
					case 'R':
						oStatusCount.request++;
						break;
					case 'J':
						oStatusCount.reject++;
						break;
					case 'A':
						oStatusCount.approval++;
						break;
					case 'C':
						oStatusCount.cancel++;
						break;
				}
			});

			this._h.mainView.setProperty('/statusCount', oStatusCount);
		},
	});
});
