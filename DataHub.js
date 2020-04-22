sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel"
], function (Object, JSONModel) {
  "use strict";

  return Object.extend('sk.siltron.bp.BPWorkflow.model.common.DataHub', {

    /**
     * 공통변수
     * manifest : manifest 설정정보
     * device : device 모델
     * i18n : i18n 리소스 번들
     */
    manifest: null,
    device: null,
    i18n: null,
    router: null,
    nameSpace: "sk.siltron.bp.BPWorkflow",

    /**
    * 초기 설정 값
    */
    mainViewInitData: {
      select: true,
      status: {
        submitCreatebtn: true,
        submitModibtn: true
      },
      tabgrowing: true,
      buttonStatus: '',
      hasError: false,
      hasUIChanges: false,
      stickyOptions: ['HeaderToolbar', 'ColumnHeaders'],
      condition: {
        iconKey: 'T',
        fromDate: null,
        toDate: null
      },
      statusCount: {
        total: 0,
        draft: 0,
        request: 0,
        reject: 0,
        approval: 0,
        cancel: 0
      },
      vendorSelectOption: {
        selectBPtype: ''
      }
    },

    detailViewInitData: {

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
    },

    /**
     * OData모델객체
     */
    bpReg: null,
    bpInfo: null,

    /**
     * Main뷰 모델
     */
    mainData: null,
    mainView: null,
    detailData: null,
    detailView: null,

    mainDataInitData: {
      VendorList: {
      }
    },

    detailDataInitData: {
    },
    /**
     * Data Trasport
     */
    oToDetail: null

  });
});