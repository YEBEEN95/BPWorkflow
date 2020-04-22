sap.ui.define([
	"sk/siltron/bp/BPWorkflow/controller/common/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sk.siltron.bp.BPWorkflow.controller.Detail", {

		/* =========================================================== */
		/* 라이프사이클 메서드 */
		/* =========================================================== */

		onInit: function () {

			// 전역변수
			this._h = this.getDataHub();
			this.oWizard = this.getView().byId("CreateWizard");
			this.oReviewPage = sap.ui.xmlfragment("sk.siltron.bp.BPWorkflow.view.fragments.Review", this);
			this.oQckPage = sap.ui.xmlfragment("sk.siltron.bp.BPWorkflow.view.fragments.QuickStep", this);
			this.oNavContainer = this.getView().byId("wizardNavContainer");
			this.oNavContainer.addPage(this.oReviewPage);
			this.oNavContainer.addPage(this.oQckPage);


			// 모델생성
			var self = this;
			this._h.detailData = this.createJSONModel();
			this._h.detailData.setData(this._h.detailDataInitData);

			this._h.detailView = this.createJSONModel();
			this._h.detailView.setData(this._h.detailViewInitData);

			// 모델등록
			this.getView().setModel(this._h.detailData, 'detailData');
			this.getView().setModel(this._h.detailView, 'detailView');

			// 이벤트등록
			this.getRouter().getRoute('detail').attachPatternMatched(this.onPatternMatched, this);

			// 화면설정
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			//F4데이터 설정

			//Message Model
			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);

			//wizard
			this.oWizard = this.getView().byId("CreateWizard");
			this.oWizardContentPage = this.getView().byId('wizardContentPage');
			this.wizard = this.byId("CreateWizard");
		},

        /**
         * 리소스를 삭제한다
         */
		onExit: function () {
		},

		/* ========================================================== */
        /* 이벤트핸들러
        /* =========================================================== */
		onPatternMatched: function (oEvent) {

			if (this._h.oToDetail.BusinessPartner) {
				this.BPInfoDataToDetailData();
				//data들 함수로 빼기
				this._h.detailView.setProperty('/status/submitCreatebtn', false);
				this._h.detailView.setProperty('/status/submitModibtn', true);
				
			} else if (this._h.oToDetail.reqDate) {
				this.BPRegDataToDetailData();
			}
			else {
				this.initDetailData();
			}
			this._h.oToDetail = null;
		},

        /**
         * 이벤트처리 함수. 모든 이벤트는 여기를 통해서 처리가 된다
         * @param oEvent
         */
		onPAI: function (oEvent) {

			var sCode = this.getCustomData(oEvent, 'fcCode');

			switch (sCode) {
				case 'fcChangeAddSuppName':
				case 'fcChangeStreet':
				case 'fcChangeHouseNumber':
				case 'fcChangePostalCode':
				case 'fcChangeCountry':
				case 'fcChangeRegion':
				case 'fcChangeTaxJurCode':
				case 'fcChangePhoneCountry':
				case 'fcChangeBankCountry':
				case 'fcChangeBankKey':
				case 'fcChangeAccountNumber':
				case 'fcChangeAccountHolder':
				case 'fcChangeTermPayment':
				case 'fcChangePurchasingOrg':
				case 'fcChangePurchasingGroup':
				case 'fcChangeTermPaymentP':
					this.fcCompleteStep();
					break;
				case 'fcCompleteStep':
					this.fcCompleteStep();
					break;
				case 'fcComplete':
					this.fcComplete(oEvent);
					break;
				case 'fcSubmitDelete':
					this.fcSubmitDelete();
					break;
				case 'fcDetailSave':
					this.fcDetailSave();
					break;
				case 'fcDetailCancel':
					this.fcDetailCancel();
					break;
				case 'fcCancelSearchHelpBPGrouping':
					this.fcCancelSearchHelpBPGrouping();
					break;
				case 'fcCancelSearchHelpLanguage':
					this.fcCancelSearchHelpLanguage();
					break;
				case 'fcDetailNav':
					this.fcDetailNav(oEvent);
					break;
				case 'fcQckStepNav':
					this.fcQckStepNav(oEvent);
					break;
				case 'fcQckStepExamine':
					this.fcQckStepExamine(oEvent);
					break;
				case 'fcQckStep':
					this.fcQckStep(oEvent);
					break;
				case 'fcBackWizard_GeneralData':
					this.moveToChangePoint('GeneralData');
					break;
				case 'fcBackWizard_Address':
					this.moveToChangePoint('Address');
					break;
				case 'fcBackWizard_StdrdCommunication':
					this.moveToChangePoint('StandardCommunication');
					break;
				case 'fcBackWizard_BankAccount':
					this.moveToChangePoint('BankAccount');
					break;
				case 'fcBackWizard_PaymentTerms':
					this.moveToChangePoint('PaymentTerms');
					break;
				case 'fcBackWizard_TaxNumbers':
					this.moveToChangePoint('TaxNumbers');
					break;
				case 'fcBackWizard_PurchasingOrg':
					this.moveToChangePoint('PurchasingOrganizations');
					break;
				case 'fcBackWizard_CompanyCode':
					this.moveToChangePoint('Companycode');
					break;
				case 'fcSubmit':
					this.fcSubmit(oEvent);
					break;
				case 'fcCancelsubmit':
					this.fcCancelsubmit(oEvent);
					break;
				case 'fcRequset':
					this.fcRequset(oEvent);
					break;
				case 'fcCancelSelcApprover':
					this.fcCancelSelcApprover(oEvent);
					break;
				case 'fcSendReqComplete':
					this.fcSendReqComplete(oEvent);
					break;
				case 'fcCancelReqComplete':
					this.fcCancelReqComplete(oEvent);
					break;
				case 'fcSelectApproverType':
					this.fcSelectApproverType(oEvent);
					break;
				case 'fcSubmitApproval':
					this.fcSubmitApproval(oEvent);
					break;
				case 'fcSubmitReject':
					this.fcSubmitReject(oEvent);
					break;
			}
		},

		fcSubmitReject: function (oEvent) {
			var self = this;
			this.callPopupConfirm('msgAlert003', this.MSGTYPE.ALERT, this.MSGBOXICON.ERROR)
				.then(function (sResult) {
					if (sResult === 'OK') {
						self.getOwnerComponent().getRouter().navTo("main");
					}
				});

		},

		fcSubmitApproval: function (oEvent) {
			this.callPopupConfirm(msgSuccess020, this.MSGTYPE.SUCCESS, this.MSGBOXICON.SUCCESS)
				.then(function (sResult) {
					if (sResult === 'OK') {
						self.getOwnerComponent().getRouter().navTo("main");
					}
				});
		},

		fcSelectApproverType: function (oEvent) {
			var sKey = oEvent.getSource().mProperties.selectedKey;

			if (sKey === "kim") {
				this._h.detailView.setProperty('/selectApprovertype', 'kim');
			}
			else if (sKey === "lee") {
				this._h.detailView.setProperty('/selectApprovertype', 'lee');
			}

		},

		fcSendReqComplete: function () {
			this.showMessage(this.MSGTYPE.SUCCESS, 'msgTitle040', 'msgSuccess030');
			this.closePopupFragment('RequestComplete');
			this.getOwnerComponent().getRouter().navTo("main");
		},

		fcCancelReqComplete: function () {
			this.closePopupFragment('RequestComplete');
			this.getOwnerComponent().getRouter().navTo("main");
		},

		fcRequset: function () {
			this.closePopupFragment('SelectApprover');
			this.callPopupFragment('RequestComplete');

			this._h.detailView.setProperty('/RequestDate', new Date());
		},

		fcCancelSelcApprover: function () {
			this.closePopupFragment('SelectApprover');
			this.getOwnerComponent().getRouter().navTo("main");
		},

		fcSubmit: function (oEvent) {
			this.callPopupFragment('SelectApprover');
			this._h.detailView.setProperty('/selectApprovertype', ' ');
		},

		fcCancelsubmit: function (oEvent) {
			var self = this;

			this.callPopupConfirm('msgAlert002', this.MSGTYPE.WARNING, this.MSGBOXICON.WARNING)
				.then(function (sResult) {
					if (sResult === 'OK') {
						self.getOwnerComponent().getRouter().navTo("main");
					}
				});
		},

		fcDetailNav: function (oEvent) {
			this._h.detailView.setProperty('/review', true);
			if (this._h.detailView.getProperty('/review')) {
				this.setReview(false);
				this.navBackToStep(this.getView().byId("GeneralData"));
			}
		},

		fcQckStepNav: function (oEvent) {

			if (this._h.detailView.getProperty('/quickstep')) {
				this.setReview(false);
				this.navBackToStep(this.getView().byId("GeneralData"));
			}
		},

		fcQckStepExamine: function (oEvent) {
			var oWizard = this.getControl('CreateWizard');
			var bInvalidate = false;
			if (this.qckStepValidated()) {
				if (this._h.detailView.getProperty('/quickstep')) {
					_.forEach(oWizard.getSteps(), function (oStep) {
						if (!bInvalidate) {
							oWizard.nextStep(oStep);
						}
					});
				}
			}
			else {
				this.showMessage(this.MSGTYPE.ERROR, 'msgTitle050', 'msgError004');
			}
		},

		onF4SelectData: function (oEvent) {

		},

		onF4BPGrouping: function (oEvent) {
			this.callPopupFragment('SearchHelpBPGrouping', oEvent);
		},

		onF4Language: function (oEvent) {
			this.callPopupFragment('SearchHelpLanguage', oEvent);
		},

		fcCancelSearchHelpLanguage: function () {
			this.closePopupFragment('SearchHelpLanguage');
		},

		fcCancelSearchHelpBPGrouping: function () {
			this.closePopupFragment('SearchHelpBPGrouping');
		},

		fcDetailSave: function () {
			this.showMessage(this.MSGTYPE.SUCCESS, 'msgTitle010', 'msgSuccess010');
		},

		fcDetailCancel: function () {
			var self = this;
			this.callPopupConfirm('msgAlert004', this.MSGTYPE.ALERT, this.MSGBOXICON.QUESTION)
				.then(function (sResult) {
					if (sResult === 'OK') {
						self.getOwnerComponent().getRouter().navTo("main");
					}
				}); self.initDetailData();

		},

		fcCompleteStep: function () {
			if (this.checkData()) {
				this.setValidated(this.getWizardCurrentStep(), true);
			} else {
				this.setValidated(this.getWizardCurrentStep(), false);
			}
		},

		fcQckStep: function (oEvent) {
			this.setQckStep(true);
			this.oNavContainer.to(this.oQckPage);
		},

		fcComplete: function (oEvent) {
			this.setReview(true);
			this.oNavContainer.to(this.oReviewPage);
		},

		fcSubmitDelete: function () {
			var self = this;

			this.callPopupConfirm('msgAlert002', this.MSGTYPE.WARNING, this.MSGBOXICON.WARNING)
				.then(function (sResult) {
					if (sResult === 'OK') {
						// self._h.oToDetail.setProperty('/reqStatus', 'C');
						self.getOwnerComponent().getRouter().navTo("main");
					}
				});
		},

		getWizardCurrentStep: function () {

			if (!this.oWizard) {
				return '';
			}

			return this.getCurrentStep();
		},

		getCurrentStep: function () {

			var sStep = '';
			var iStep = this.oWizard.getProgress();

			if (this.oWizard.getProgressStep()) {
				iStep = this.oWizard.indexOfStep(this.oWizard.getProgressStep()) + 1;
			}

			switch (iStep) {
				case 1:
					sStep = 'GeneralData';
					break;
				case 2:
					sStep = 'Address';
					break;
				case 3
					:
					sStep = 'StandardCommunication';
					break;
				case 4:
					sStep = 'BankAccount';
					break;
				case 5:
					sStep = 'PaymentTerms';
					break;
				case 6:
					sStep = 'TaxNumbers';
					break;
				case 7:
					sStep = 'PurchasingOrganizations';
					break;
				case 8:
					sStep = 'Companycode';
					break;
			}

			return sStep;
		},

		moveToChangePoint: function (sId) {
			this.navBackToStep(this.getView().byId(sId));
		},

		navBackToStep: function (sStep) {

			var fnAfterNavigate = function () {
				this.oWizard.goToStep(sStep);
				this.oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this.oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.oNavContainer.to(this.oWizardContentPage);
		},

		checkData: function () {

			var bStep01 = true;
			var bStep02 = true;
			var bStep03 = true;
			var bStep04 = true;
			var bStep05 = true;
			var bStep06 = true;
			var bStep07 = true;
			var bStep08 = true;

			var sCurrentStep = this.getCurrentStep();

			switch (sCurrentStep) {
				case 'GeneralData':
					bStep01 =
						this.checkDataStep01();
					break;
				case 'Address':
					bStep02 =
						this.checkDataStep01() &&
						this.checkDataStep02();
					break;
				case 'StandardCommunication':
					bStep03 =
						this.checkDataStep01() &&
						this.checkDataStep02() &&
						this.checkDataStep03();
					break;
				case 'BankAccount':
					bStep04 =
						this.checkDataStep01() &&
						this.checkDataStep02() &&
						this.checkDataStep03() &&
						this.checkDataStep04();
					break;
				case 'PaymentTerms':
					bStep05 =
						this.checkDataStep01() &&
						this.checkDataStep02() &&
						this.checkDataStep03() &&
						this.checkDataStep04() &&
						this.checkDataStep05();
					break;
				case 'TaxNumbers':
					bStep06 =
						this.checkDataStep01() &&
						this.checkDataStep02() &&
						this.checkDataStep03() &&
						this.checkDataStep04() &&
						this.checkDataStep05() &&
						this.checkDataStep06();
					break;
				case 'PurchasingOrganizations':
					bStep07 =
						this.checkDataStep01() &&
						this.checkDataStep02() &&
						this.checkDataStep03() &&
						this.checkDataStep04() &&
						this.checkDataStep05() &&
						this.checkDataStep06() &&
						this.checkDataStep07();
					break;
				case 'Companycode':
					bStep08 =
						this.checkDataStep01() &&
						this.checkDataStep02() &&
						this.checkDataStep03() &&
						this.checkDataStep04() &&
						this.checkDataStep05() &&
						this.checkDataStep06() &&
						this.checkDataStep07() &&
						this.checkDataStep08();
					break;
			}

			return bStep01 && bStep02 && bStep03 && bStep04 && bStep05 && bStep06 && bStep07 && bStep08;
		},

		checkDataStep01: function () {
			// 단계별 데이터 정합성 체크 로직 작성 필요
			var bResult = this._h.detailView.getProperty('/GeneralData/FirstName') ? true : false;

			return bResult;
		},

		checkDataStep02: function () {
			// 단계별 데이터 정합성 체크 로직 작성 필요

			var bResult01 = this._h.detailView.getProperty('/Address/StreetName') ? true : false;
			var bResult02 = this._h.detailView.getProperty('/Address/HouseNumber') ? true : false;
			var bResult03 = this._h.detailView.getProperty('/Address/PostalCode') ? true : false;
			var bResult04 = this._h.detailView.getProperty('/Address/Country') ? true : false;
			var bResult05 = this._h.detailView.getProperty('/Address/Region') ? true : false;
			var bResult06 = this._h.detailView.getProperty('/Address/TaxJurisdiction') ? true : false;

			var bResult = bResult01 && bResult02 && bResult03 && bResult04 && bResult05 && bResult06;

			return bResult;

		},

		checkDataStep03: function () {
			// 단계별 데이터 정합성 체크 로직 작성 필요
			var bResult = this._h.detailView.getProperty('/StandardCommunication/DestLocationCountryCellPhone') ? true : false;

			return bResult;
		},

		checkDataStep04: function () {
			// 단계별 데이터 정합성 체크 로직 작성 필요
			var bResult01 = this._h.detailView.getProperty('/BankAccount/BankCountryKey') ? true : false;
			var bResult02 = this._h.detailView.getProperty('/BankAccount/BankIdentification') ? true : false;
			var bResult03 = this._h.detailView.getProperty('/BankAccount/BankNumber') ? true : false;
			var bResult04 = this._h.detailView.getProperty('/BankAccount/BankAccountHolderName') ? true : false;

			var bResult = bResult01 && bResult02 && bResult03 && bResult04;
			return bResult;
		},

		checkDataStep05: function () {
			// 단계별 데이터 정합성 체크 로직 작성 필요
			var bResult = this._h.detailView.getProperty('/PaymentTerms/PaymentTerms') ? true : false;

			return bResult;
		},

		checkDataStep06: function () {
			// 단계별 데이터 정합성 체크 로직 작성 필요
			var bResult = true;

			return bResult;
		},

		checkDataStep07: function () {
			``
			// 단계별 데이터 정합성 체크 로직 작성 필요
			var bResult01 = this._h.detailView.getProperty('/PurchasingOrganizations/PurchasingOrganization') ? true : false;
			var bResult02 = this._h.detailView.getProperty('/PurchasingOrganizations/PurchasingGroup') ? true : false;
			var bResult03 = this._h.detailView.getProperty('/PurchasingOrganizations/PaymentTermsPurchasing') ? true : false;

			var bResult = bResult01 && bResult02 && bResult03;
			return bResult;
		},

		checkDataStep08: function () {
			// 단계별 데이터 정합성 체크 로직 작성 필요
			var bResult = true;

			return bResult;
		},

		BPInfoDataToDetailData: function () {
			var oGeneralData = this._h.detailView.getProperty('/GeneralData');
			oGeneralData.BusinessPartner = this._h.oToDetail.BusinessPartner;
			oGeneralData.Supplier = this._h.oToDetail.Supplier;
			oGeneralData.FirstName = this._h.oToDetail.FirstName;
			oGeneralData.SupplierAccountGroup = this._h.oToDetail.SupplierAccountGroup;
			oGeneralData.BusinessPartnerGrouping = this._h.oToDetail.BusinessPartnerGrouping;
			oGeneralData.SearchTerm1 = this._h.oToDetail.SearchTerm1;
			this._h.detailView.setProperty('/GeneralData', oGeneralData);

			var oAddress = this._h.detailView.getProperty('/Address');
			oAddress.StreetName = this._h.oToDetail.to_BusinessPartnerAddress.results[0].StreetName;
			oAddress.HouseNumber = this._h.oToDetail.to_BusinessPartnerAddress.results[0].HouseNumber;
			oAddress.PostalCode = this._h.oToDetail.to_BusinessPartnerAddress.results[0].PostalCode;
			oAddress.CityName = this._h.oToDetail.to_BusinessPartnerAddress.results[0].CityName;
			oAddress.POBoxPostalCode = this._h.oToDetail.to_BusinessPartnerAddress.results[0].POBoxPostalCode;
			oAddress.POBox = this._h.oToDetail.to_BusinessPartnerAddress.results[0].POBox;
			oAddress.Country = this._h.oToDetail.to_BusinessPartnerAddress.results[0].Country;
			oAddress.Region = this._h.oToDetail.to_BusinessPartnerAddress.results[0].Region;
			oAddress.TaxJurisdiction = this._h.oToDetail.to_BusinessPartnerAddress.results[0].TaxJurisdiction;
			this._h.detailView.setProperty('/Address', oAddress);

			var oStandardCommunication = this._h.detailView.getProperty('/StandardCommunication');
			oStandardCommunication.CorrespondenceLanguage = this._h.oToDetail.CorrespondenceLanguage;
			oStandardCommunication.DestLocationCountryCellPhone = this._h.oToDetail.to_BusinessPartnerAddress.results[0].to_MobilePhoneNumber.DestinationLocationCountry;
			oStandardCommunication.CellPhoneNumber = this._h.oToDetail.to_BusinessPartnerAddress.results[0].to_MobilePhoneNumber.CellPhoneNumber;
			oStandardCommunication.FaxCountry = this._h.oToDetail.to_BusinessPartnerAddress.results[0].to_FaxNumber.FaxCountry;
			oStandardCommunication.DestLocationCountryTelephone = this._h.oToDetail.to_BusinessPartnerAddress.results[0].to_PhoneNumber.DestinationLocationCountry;
			oStandardCommunication.TelePhoneNumber = this._h.oToDetail.to_BusinessPartnerAddress.results[0].to_PhoneNumber.TelePhoneNumber;
			oStandardCommunication.EmailAddress = this._h.oToDetail.to_BusinessPartnerAddress.results[0].to_EmailAddress.EmailAddress;

			this._h.detailView.setProperty('/StandardCommunication', oStandardCommunication);

			var oBankAccount = this._h.detailView.getProperty('/BankAccount');
			oBankAccount.BankCountryKey = this._h.oToDetail.to_BusinessPartnerBank.results[0].BankCountryKey;
			oBankAccount.BankIdentification = this._h.oToDetail.to_BusinessPartnerBank.results[0].BankIdentification;
			oBankAccount.BankNumber = this._h.oToDetail.to_BusinessPartnerBank.results[0].BankNumber;
			oBankAccount.BankAccountHolderName = this._h.oToDetail.to_BusinessPartnerBank.results[0].BankAccountHolderName;
			oBankAccount.BankAccountName = this._h.oToDetail.to_BusinessPartnerBank.results[0].BankAccountName;
			oBankAccount.IBAN = this._h.oToDetail.to_BusinessPartnerBank.results[0].IBAN;
			oBankAccount.BankControlKey = this._h.oToDetail.to_BusinessPartnerBank.results[0].BankControlKey;
			this._h.detailView.setProperty('/BankAccount', oBankAccount);

			var oPaymentTerms = this._h.detailView.getProperty('/PaymentTerms');
			oPaymentTerms.PaymentTerms = this._h.oToDetail.to_Supplier.to_SupplierCompany.results[0].PaymentTerms;
			this._h.detailView.setProperty('/PaymentTerms', oPaymentTerms);


			var oTaxNumbers = this._h.detailView.getProperty('/TaxNumbers');
			oTaxNumbers.BPTaxType = this._h.oToDetail.to_BusinessPartnerTax.results.BPTaxType;
			oTaxNumbers.BPTaxNumber = this._h.oToDetail.to_BusinessPartnerTax.results.BPTaxNumber;
			this._h.detailView.setProperty('/TaxNumbers', oTaxNumbers);

			var oPurchasingOrganizations = this._h.detailView.getProperty('/PurchasingOrganizations');
			oPurchasingOrganizations.PurchasingOrganization = this._h.oToDetail.to_Supplier.to_SupplierPurchasingOrg.results[0].PurchasingOrganization;
			oPurchasingOrganizations.PurchasingGroup = this._h.oToDetail.to_Supplier.to_SupplierPurchasingOrg.results[0].PurchasingGroup;
			oPurchasingOrganizations.PurchaseOrderCurrency = this._h.oToDetail.to_Supplier.to_SupplierPurchasingOrg.results[0].PurchaseOrderCurrency;
			oPurchasingOrganizations.PaymentTermsPurchasing = this._h.oToDetail.to_Supplier.to_SupplierPurchasingOrg.results[0].PaymentTerms;
			oPurchasingOrganizations.PurchasingOrganizaIncotermsClassificationtion = this._h.oToDetail.to_Supplier.to_SupplierPurchasingOrg.results[0].IncotermsClassification;
			oPurchasingOrganizations.IncotermsLocation1 = this._h.oToDetail.to_Supplier.to_SupplierPurchasingOrg.results[0].IncotermsLocation1;
			oPurchasingOrganizations.IncotermsLocation2 = this._h.oToDetail.to_Supplier.to_SupplierPurchasingOrg.results[0].IncotermsLocation2;
			oPurchasingOrganizations.InvoiceIsGoodsReceiptBased = this._h.oToDetail.to_Supplier.to_SupplierPurchasingOrg.results[0].InvoiceIsGoodsReceiptBased;
			this._h.detailView.setProperty('/PurchasingOrganizations', oPurchasingOrganizations);

			var oCompanycode = this._h.detailView.getProperty('/Companycode');
			oCompanycode.ReconciliationAccount = this._h.oToDetail.to_Supplier.to_SupplierCompany.results[0].ReconciliationAccount;
			oCompanycode.PaymentTermsAccount = this._h.oToDetail.to_Supplier.to_SupplierCompany.results[0].PaymentTerms;
			this._h.detailView.setProperty('/Companycode', oCompanycode);

			//BP Type
			if (this._h.oToDetail.Supplier) {
				this._h.detailView.setProperty('/BPType', 'Supplier');
			}
			else if (this._h.oToDetail.Customer) {
				this._h.detailView.setProperty('/BPType', 'Customer');
			}

		},

		BPRegDataToDetailData: function () {
			var oGeneralData = this._h.detailView.getProperty('/GeneralData');
			oGeneralData.BusinessPartner = this._h.oToDetail.bp;
			oGeneralData.Supplier = this._h.oToDetail.bpName;
			oGeneralData.FirstName = this._h.oToDetail.bpName;
			oGeneralData.SupplierAccountGroup = this._h.oToDetail.bpAccountGroup;
			oGeneralData.BusinessPartnerGrouping = this._h.oToDetail.businessPartnerGrouping;
			oGeneralData.SearchTerm1 = this._h.oToDetail.searchTerm1;
			this._h.detailView.setProperty('/GeneralData', oGeneralData);
			this._h.detailView.setProperty('/Wizard/Step01', this.checkDataStep01());

			var oAddress = this._h.detailView.getProperty('/Address');
			oAddress.StreetName = this._h.oToDetail.streetName;
			oAddress.HouseNumber = this._h.oToDetail.houseNumber;
			oAddress.PostalCode = this._h.oToDetail.postalCode;
			oAddress.CityName = this._h.oToDetail.cityName;
			oAddress.POBoxPostalCode = this._h.oToDetail.poBoxPostalCode;
			oAddress.POBox = this._h.oToDetail.poBox;
			oAddress.Country = this._h.oToDetail.county;
			oAddress.Region = this._h.oToDetail.region;
			oAddress.TaxJurisdiction = this._h.oToDetail.taxJurisdiction;
			this._h.detailView.setProperty('/Address', oAddress);
			this._h.detailView.setProperty('/Wizard/Step02', this.checkDataStep02());

			var oStandardCommunication = this._h.detailView.getProperty('/StandardCommunication');
			oStandardCommunication.CorrespondenceLanguage = this._h.oToDetail.language;
			oStandardCommunication.DestLocationCountryCellPhone = this._h.oToDetail.destinationLocationCountryMobile;
			oStandardCommunication.CellPhoneNumber = this._h.oToDetail.phoneNumberMobile;
			oStandardCommunication.FaxCountry = this._h.oToDetail.faxCountry;
			oStandardCommunication.DestLocationCountryTelephone = this._h.oToDetail.destinationLocationCountryPhone;
			oStandardCommunication.TelePhoneNumber = this._h.oToDetail.phoneNumberPhone;
			oStandardCommunication.EmailAddress = this._h.oToDetail.emailAddress;
			this._h.detailView.setProperty('/StandardCommunication', oStandardCommunication);
			this._h.detailView.setProperty('/Wizard/Step03', this.checkDataStep03());

			var oBankAccount = this._h.detailView.getProperty('/BankAccount');
			oBankAccount.BankCountryKey = this._h.oToDetail.bankCountryKey;
			oBankAccount.BankIdentification = this._h.oToDetail.bankAccount;
			oBankAccount.BankNumber = this._h.oToDetail.bankNumber;
			oBankAccount.BankAccountHolderName = this._h.oToDetail.bankAccountHolderName;
			oBankAccount.BankAccountName = this._h.oToDetail.bankAccountName;
			oBankAccount.IBAN = this._h.oToDetail.iban;
			oBankAccount.BankControlKey = this._h.oToDetail.bankControlKey;
			this._h.detailView.setProperty('/BankAccount', oBankAccount);
			this._h.detailView.setProperty('/Wizard/Step04', this.checkDataStep04());

			var oPaymentTerms = this._h.detailView.getProperty('/PaymentTerms');
			oPaymentTerms.PaymentTerms = this._h.oToDetail.paymentTerms;
			this._h.detailView.setProperty('/PaymentTerms', oPaymentTerms);
			this._h.detailView.setProperty('/Wizard/Step05', this.checkDataStep05());

			var oTaxNumbers = this._h.detailView.getProperty('/TaxNumbers');
			oTaxNumbers.BPTaxType = this._h.oToDetail.bpTaxType;
			oTaxNumbers.BPTaxNumber = this._h.oToDetail.bpTaxNumber;
			this._h.detailView.setProperty('/TaxNumbers', oTaxNumbers);
			this._h.detailView.setProperty('/Wizard/Step06', this.checkDataStep06());

			var oPurchasingOrganizations = this._h.detailView.getProperty('/PurchasingOrganizations');
			oPurchasingOrganizations.PurchasingOrganization = this._h.oToDetail.purchasingOrganization;
			oPurchasingOrganizations.PurchasingGroup = this._h.oToDetail.purchasingGroup;
			oPurchasingOrganizations.PurchaseOrderCurrency = this._h.oToDetail.purchaseOrderCurrency;
			oPurchasingOrganizations.PaymentTermsPurchasing = this._h.oToDetail.paymentTerms;
			oPurchasingOrganizations.PurchasingOrganizaIncotermsClassificationtion = this._h.oToDetail.incotermsClassification;
			oPurchasingOrganizations.IncotermsLocation1 = this._h.oToDetail.incotermsLocation1;
			oPurchasingOrganizations.IncotermsLocation2 = this._h.oToDetail.incotermsLocation2;
			oPurchasingOrganizations.InvoiceIsGoodsReceiptBased = this._h.oToDetail.invoiceIsGoodsReceiptBased;
			this._h.detailView.setProperty('/PurchasingOrganizations', oPurchasingOrganizations);
			this._h.detailView.setProperty('/Wizard/Step07', this.checkDataStep07());

			var oCompanycode = this._h.detailView.getProperty('/Companycode');
			oCompanycode.ReconciliationAccount = this._h.oToDetail.reconciliationAccount;
			oCompanycode.PaymentTermsAccount = this._h.oToDetail.paymentTerms;
			this._h.detailView.setProperty('/Companycode', oCompanycode);
			this._h.detailView.setProperty('/Wizard/Step08', this.checkDataStep08());

			var oWizard = this.getControl('CreateWizard');
			var bInvalidate = false;
			_.forEach(oWizard.getSteps(), function (oStep) {

				if (!bInvalidate && oStep.isActive()) {
					oWizard.nextStep(oStep);
				}
			});

			switch (this._h.oToDetail.reqStatus) {
				case 'D':
					this._h.detailView.setProperty('/status/deletebtn', true);
					break;
				case 'R':
					this._h.detailView.setProperty('/status/deletebtn', true);
					break;
				case 'J':
					this._h.detailView.setProperty('/status/deletebtn', true);
					break;
				case 'A':
					this._h.detailView.setProperty('/status/reviewPage', true);
					this._h.detailView.setProperty('/status/editable', false);
					this._h.detailView.setProperty('/status/submitCreatebtn', false);
					this._h.detailView.setProperty('/status/submitModibtn', false);
					break;
				case 'C':
					this._h.detailView.setProperty('/status/editable', false);
					this._h.detailView.setProperty('/status/submitCreatebtn', false);
					this._h.detailView.setProperty('/status/submitModibtn', false);
					break;
			}
		},

		initDetailData: function () {
			// Data Initialization

			// View Data Initialization
			this._h.detailView.setProperty('/', {

				status: {
					deletebtn: false,
					editable: true,
					submitCreatebtn: true,
					submitModibtn: false,
					approvalbtn: false
				},

				RequestDate: null,
				busy: false,
				review: false,
				quickstep: false,
				Wizard: {
					Step01: false,
					Step02: false,
					Step03: false,
					Step04: false,
					Step05: false,
					Step06: false,
					Step07: false,
					Step08: false
				},
				WizardValidate:
				{
					GeneralData: false,
					Address: false,
					StandardCommunication: false,
					BankAccount: false,
					PaymentTerms: false,
					TaxNumbers: false,
					PurchasingOrganizations: false,
					Companycode: false
				},

				GeneralData: {
					BusinessPartner: '',
					Supplier: '',
					FirstName: '',
					SupplierAccountGroup: '',
					BusinessPartnerGrouping: '',
					SearchTerm1: '',
				},
				Address: {
					StreetName: '',
					HouseNumber: '',
					PostalCode: '',
					CityName: '',
					POBoxPostalCode: '',
					POBox: '',
					Country: '',
					Region: '',
					TaxJurisdiction: ''
				},
				StandardCommunication: {
					CorrespondenceLanguage: '',
					DestLocationCountryCellPhone: '',
					CellPhoneNumber: '',
					FaxCountry: '',
					DestLocationCountryTelephone: '',
					TelePhoneNumber: '',
					EmailAddress: ''
				},
				BankAccount: {
					BankCountryKey: '',
					BankIdentification: '',
					BankNumber: '',
					BankAccountHolderName: '',
					BankAccountName: '',
					IBAN: '',
					BankControlKey: ''
				},
				PaymentTerms: {
					PaymentTerms: ''
				},
				TaxNumbers: {
					BPTaxType: '',
					BPTaxNumber: ''
				},
				PurchasingOrganizations: {
					PurchasingOrganization: '',
					PurchasingGroup: '',
					PurchaseOrderCurrency: '',
					PaymentTermsPurchasing: '',
					IncotermsClassification: '',
					IncotermsLocation1: '',
					IncotermsLocation2: '',
					InvoiceIsGoodsReceiptBased: false
				},
				Companycode: {
					ReconciliationAccount: '',
					PaymentTermsAccount: ''
				},

				BPGroupingData: [
					{
						Name: "ZCEN",
						Description: "Main vendor"
					},
					{
						Name: "ZPTR",
						Description: "Transportation vendor"
					},
					{
						Name: "ZPAY",
						Description: "Invoicing Party vendor"
					}
				],

				BPLanguageData: [
					{
						Name: "EN",
						Description: "English"
					},
					{
						Name: "KR",
						Description: "Korean"
					},
					{
						Name: "DE",
						Description: "German"
					},
					{
						Name: "ZH",
						Description: "Chinese"
					},
					{
						Name: "JA",
						Description: "Japanese"
					}
				],
				selectApprovertype: '',
				BPType: '',
				requestType: ''
			});
		},

		setValidated: function (sStep, bSet) {
			this._h.detailView.setProperty('/WizardValidate/' + sStep, bSet);
		},

		setReview: function (bSet) {
			this._h.detailView.setProperty('/review', bSet);
		},

		setQckStep: function (bSet) {
			this._h.detailView.setProperty('/quickstep', bSet);
		},

		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		qckStepValidated: function () {
			var ValidatedGeneralData = this.checkDataStep01();
			var ValidatedAddress = this.checkDataStep02();
			var ValidatedStandarCommunication = this.checkDataStep03();
			var ValidatedBankAccount = this.checkDataStep04();
			var ValidatedPaymentTerms = this.checkDataStep05();
			var ValidatedPurchasingOrganizations = this.checkDataStep07();
			var result = ValidatedGeneralData && ValidatedAddress && ValidatedStandarCommunication && ValidatedBankAccount && ValidatedPaymentTerms && ValidatedPurchasingOrganizations;

			return result;
		}
	});
});


