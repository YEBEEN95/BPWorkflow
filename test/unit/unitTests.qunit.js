/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sk/siltron/bp/BPWorkflow/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});