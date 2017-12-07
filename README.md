Dólar al instante
==========

Google Chrome browser extension that shows the current dolar value in Argentina through a browser icon and displays additional prices.

Built with Node.js, Angular and Bootstrap.

Available at [Chrome Web Store](https://chrome.google.com/webstore/detail/dólar-blue-al-instante/bcadgochooecaafmhckfgpjmieepgblp).

Utilizes [https://github.com/matiu/dolar-blue](https://github.com/matiu/dolar-blue) to retrieve updated values from third party sources (modified for browserify usage).

## Screenshot
![Image of DolarBlue extension](http://static.codaxis.com/chrome-dolar-blue.png)

## Changelog

- 1.3.0:
	-	Changed historic from local to remote source
	- Added filter for currency in historic
- 1.2.1:
	- Fixed problem with data sources
- 1.2.0:
	- Added pagination to the graph data
- 1.1.0:
	- Added historic functionality
	- Switched to Semver
- 1.0.11:
	- Add values difference as percentage
- 1.0.10:
	- Added rate-the-extension link
- 1.0.9:
	- Fixed popup columns
- 1.0.8:
	- Display official dolar value instead of blue's
- 1.0.7:
	- Remove LaNacion from sources
- 1.0.6:
	- Allow manual rates refresh
- 1.0.5:
	- Disable useless checks during weekends and before 8AM/6PM during weekdays
- 1.0.4:
	- Use lodash find() to fix bug in previous Chrome versions
- 1.0.3:
	- Added calculator mode in popup
	- Rates row as directive
	- Refactored gulpfile
- 1.0.2:
	- Reorder buy/sell columns in popup
	- Refactor rates check to external class
	- Configure source urls in manifest.json
- 1.0.1:
	- Fix value display on browser icon

## TODO
- ~~Add graphs with rates evolution~~
- ~~Navigate the graph to see further back in time~~
- Animate icon on value change
