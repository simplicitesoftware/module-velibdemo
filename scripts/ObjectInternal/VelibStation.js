VelibStation.refresh = function(params) {
	importPackage(Packages.org.json);

	var sta = this.getGrant().getObject("refresh_" + this.getName(), this.getName());
	sta.setAllFieldsUpdatable(true);
	sta.resetFilters();

	var url = "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&" + params;
	var data = Tool.readUrl(url);

	this.getGrant().addAccessCreate(this.getName());

	var res = new JSONObject(data);
	var nhits = res.getInt("nhits");
	console.log("Refreshing " + nhits + " records");
	var records = res.getJSONArray("records");
	for (var i = 0; i < nhits; i++) {
		var fields = records.get(i).getJSONObject("fields");
		var geometry = records.get(i).getJSONObject("geometry");

		var code = fields.get("stationcode");

		var rowId = this.getGrant().simpleQuery("select row_id from velib_station where code = '" + code + "'");
		if (Tool.isEmpty(rowId)) {
			sta.setRowId(ObjectField.DEFAULT_ROW_ID);
			sta.resetValues(true);
		} else {
			if (sta.select(rowId))
				console.log("Updating station for row ID = " + rowId);
			else
				console.error("Unable to select station for row ID = " + rowId)
		}

		sta.setFieldValue("velibStaCode", code);
		sta.setFieldValue("velibStaName", fields.get("name"));
		var status = fields.optString("state", "OPERATIVE").replace(" ", "").toUpperCase();
		sta.setFieldValue("velibStaStatus", status);
		sta.setFieldValue("velibStaBikes", fields.getInt("numbikesavailable"));
		sta.setFieldValue("velibStaFreeDocks", fields.getInt("capacity") - fields.getInt("numbikesavailable"));
		var p = geometry.getJSONArray("coordinates");
		sta.setFieldValue("velibStaCoordinates", p.get(1) + ";" + p.get(0));
		var errs = sta.validate();
		if (errs == null || errs.size() == 0) {
			var err = sta.save();
			if (err != null) console.error(err);
		} else {
			for (var k = 0; k < errs.size(); k++)
				console.error(errs.get(k));
		}
	}

	this.getGrant().delAccessCreate(this.getName());

	return Message.formatSimpleInfo("VELIB_REFRESHED:" + nhits);
};

VelibStation.refreshAll = function() {
	var rowIds = this.getSelectedIds();
	if (rowIds != null && rowIds.size() > 0) {
		for (var i = 0; i < rowIds.size(); i++) {
			var rowId = rowIds.get(i);
			var code = this.getGrant().simpleQuery("select code from velib_station where row_id = " + rowId);
			VelibStation.refresh.call(this, "q=" + HTTPTool.encode("stationcode=" + code));
		}
	} else {
		var nameFilter = this.getGrant().getParameter("VELIB_STATION_NAME_FILTER");
		VelibStation.refresh.call(this, "rows=1000&q=" + HTTPTool.encode("name=" + nameFilter));
	}
};

VelibStation.refreshOne = function() {
	VelibStation.refresh.call(this, "q=" + HTTPTool.encode("station_code=" + this.getFieldValue("velibStaCode")));
};

VelibStation.refreshMonitored = function() {
	var sta = this.getGrant().getTmpObject(this.getName());
	sta.resetFilters();
	sta.getField("velibStaMonitoring").setFilter(Tool.TRUE);
	var idx = sta.getFieldIndex("velibStaCode");
	var rows = sta.search();
	for (var i = 0; i < rows.size(); i++) {
		var row = rows.get(i);
		VelibStation.refresh.call(this, "q=" + HTTPTool.encode("stationcode=" + row[idx]));
	}
};