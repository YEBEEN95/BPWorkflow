sap.ui.define([
	"sk/siltron/bp/BPWorkflow/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sk.siltron.bp.BPWorkflow.NotFound", {
		onLinkPressed: function() {
			this.getRouter().navTo("");
		}
	});
});