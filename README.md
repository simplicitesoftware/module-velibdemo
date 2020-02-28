<!--
 ___ _            _ _    _ _    __
/ __(_)_ __  _ __| (_)__(_) |_ /_/
\__ \ | '  \| '_ \ | / _| |  _/ -_)
|___/_|_|_|_| .__/_|_\__|_|\__\___|
            |_| 
-->
![](https://docs.simplicite.io//logos/logo250.png)
* * *

`VelibDemo` module definition
=============================

### Introduction

**Velib** demo.

This module allows retreiving data from Paris free-floating bikes services (Velib) statins and to evaluate them.

### Import

To import this module:

- Create a module named `VelibDemo`
- Set the settings as:

```json
{
	"type": "git",
	"origin": {
		"uri": "https://github.com/simplicitesoftware/module-velibdemo.git"
	}
}
```

- Click on the _Import module_ button

### Configure

There is one system parameters to configure:

- The `VELIB_STATION_NAME_FILTER` in which you must set the name filtering you want to apply on stations


`VelibComment` business object definition
-----------------------------------------



### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      | 
| ------------------------------------------------------------ | ---------------------------------------- | -------- | --------- | -------- | -------------------------------------------------------------------------------- |
| `velibCmtDateTime`                                           | datetime                                 | yes*     |           |          | Date/time                                                                        |
| `velibCmtName`                                               | char(100)                                |          | yes       |          | Name                                                                             |
| `velibCmtStaId` link to **`VelibStation`**                   | id                                       |          | yes       |          | Station                                                                          |
| _Ref. `velibCmtStaId.velibStaCode`_                          | _char(11)_                               |          |           |          | _Station code_                                                                   |
| _Ref. `velibCmtStaId.velibStaName`_                          | _char(100)_                              |          |           |          | _Station name_                                                                   |
| `velibCmtEval`                                               | int(1)                                   |          | yes       |          | Evaluation                                                                       |
| `velibCmtComments`                                           | html(4000)                               |          | yes       |          | Comments                                                                         |
| `velibCmtVisible`                                            | boolean                                  |          | yes       |          | Visible?                                                                         |

`VelibStation` business object definition
-----------------------------------------



### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      | 
| ------------------------------------------------------------ | ---------------------------------------- | -------- | --------- | -------- | -------------------------------------------------------------------------------- |
| `velibStaCode`                                               | char(11)                                 | yes*     |           |          | Station code                                                                     |
| `velibStaName`                                               | char(100)                                |          |           |          | Station name                                                                     |
| `velibStaCoordinates`                                        | geocoords                                |          |           |          | Station coordinates                                                              |
| `velibStaStatus`                                             | enum(50) using `VELIB_STA_STATUS` list   |          |           |          | Station status                                                                   |
| `velibStaBikes`                                              | int(3)                                   |          |           |          | Number of available bikes                                                        |
| `velibStaFreeDocks`                                          | int(3)                                   |          |           |          | Number of free docks                                                             |
| `velibStaMonitoring`                                         | boolean                                  |          | yes       |          | Monitoring?                                                                      |
| `velibStaRating`                                             | int(11)                                  |          | yes       |          | Rating                                                                           |
| `velibStaComments`                                           | html(4000)                               |          | yes       |          | Comments                                                                         |

### Lists

* `VELIB_STA_STATUS`
    - `OPERATIVE` Operative
    - `WORKINPROGRESS` Work in progress
    - `CLOSE` Closed

### Custom actions

* `VELIB_REFRESH_ALL`: Refresh all stations
* `VELIB_REFRESH_MONITORED`: Refresh monitored stations
* `VELIB_REFRESH_ONE`: Refresh one station

