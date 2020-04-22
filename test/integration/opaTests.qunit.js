/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sk/siltron/bp/BPWorkflow/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});