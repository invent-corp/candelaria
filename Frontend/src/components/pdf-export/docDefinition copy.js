// import { Column } from "@ag-grid-community/core";

export default function getDocDefinition(
	printParams,
	agGridApi,
	agGridColumnApi
	
	) {
	var {
		PDF_HEADER_COLOR,
		PDF_INNER_BORDER_COLOR,
		PDF_OUTER_BORDER_COLOR,
		PDF_ODD_BKG_COLOR,
		PDF_EVEN_BKG_COLOR,
		PDF_HEADER_HEIGHT,
		PDF_ROW_HEIGHT,
		PDF_PAGE_ORITENTATION,
		PDF_WITH_CELL_FORMATTING,
		PDF_WITH_COLUMNS_AS_LINKS,
		PDF_SELECTED_ROWS_ONLY,
		PDF_WITH_HEADER_IMAGE,
		PDF_WITH_FOOTER_PAGE_COUNT,
		PDF_LOGO,
		PDF_PAGE_NAME,
		PDF_FILTER_DATE,
		PDF_WITH_COLUMNS
	} = printParams;


	return (function() {

		var columnsToExport = getColumnsToExport();

		if(PDF_WITH_COLUMNS == false){
			PDF_WITH_COLUMNS = "auto"
		} else {
			PDF_WITH_COLUMNS = getExportedColumnsWidths(columnsToExport)
		}

		if (PDF_FILTER_DATE == "Invalid date à Invalid date" || PDF_FILTER_DATE == undefined) {
			PDF_FILTER_DATE = ""
		} else {
			PDF_FILTER_DATE = "Período: " + PDF_FILTER_DATE
		}

		if(PDF_PAGE_ORITENTATION == true){
			PDF_PAGE_ORITENTATION = "landscape"
		} else {
			PDF_PAGE_ORITENTATION = "portrait"
		}

		const columnGroupsToExport = getColumnGroupsToExport();	

		var widths = PDF_WITH_COLUMNS;

		const rowsToExport = getRowsToExport(columnsToExport);

		const body = columnGroupsToExport
		? [columnGroupsToExport, columnsToExport, ...rowsToExport]
		: [columnsToExport, ...rowsToExport];

		const headerRows = columnGroupsToExport ? 2 : 1;

		const header = PDF_WITH_HEADER_IMAGE
		? 	{
				image: "ag-grid-logo",
				width: 100,
				alignment: "left",
				margin: [30, 30, 0, 0],
			}
		: null;

		const background = PDF_PAGE_NAME
		? 	{
			columns: [
				{ 
					text: PDF_PAGE_NAME,
					color: "#969696",
					fontSize: 14,
					bold: true,
					alignment: "left",
					margin: [140, 40, 0, 0], 
				},
				{
					text: PDF_FILTER_DATE, 
					color: "#969696",
					fontSize: 10,
					bold: true,
					alignment: "right",
					margin: [0, 45, 30, 0],
				}
			],
		}
		: null;
		

		const footer = PDF_WITH_FOOTER_PAGE_COUNT
		? function(currentPage, pageCount) {
			return [
				{
					text: new Date().toLocaleString('pt-BR'),
					alignment: "left", 
					fontSize: 10,
					color: "#969696",
					margin: [30, 0, 0, 0],
				},
				{
					text: "Invent - Smart Intralogistics Solutions ",
					alignment: "center",
					fontSize: 10,
					color: "#969696",
					italics: true,
					margin: [20],
				},
				{
					text: currentPage.toString() + " de " + pageCount + " página(s) ",
					alignment: "right",
					fontSize: 10,
					color: "#969696",
					margin: [10, 0, 30, 0],
				}
				]
			}
		: null;

		const pageMargins = [
		10,
		PDF_WITH_HEADER_IMAGE ? 80 : 10,
		10,
		PDF_WITH_FOOTER_PAGE_COUNT ? 40 : 10
		];

		const heights = rowIndex =>
		rowIndex < headerRows ? PDF_HEADER_HEIGHT : PDF_ROW_HEIGHT;

		const fillColor = (rowIndex, node) => {
		if (rowIndex < node.table.headerRows) {
			return PDF_HEADER_COLOR;
		}
		return rowIndex % 2 === 0 ? PDF_ODD_BKG_COLOR : PDF_EVEN_BKG_COLOR;
		};

		const hLineWidth = (i, node) =>
		i === 0 || i === node.table.body.length ? 1 : 0.1;

		const vLineWidth = (i, node) =>
		i === 0 || i === node.table.widths.length ? 1 : 0.1;

		const hLineColor = (i, node) =>
		i === 0 || i === node.table.body.length
			? PDF_OUTER_BORDER_COLOR
			: PDF_INNER_BORDER_COLOR;

		const vLineColor = (i, node) =>
		i === 0 || i === node.table.widths.length
			? PDF_OUTER_BORDER_COLOR
			: PDF_INNER_BORDER_COLOR;

		const docDefintiion = {
		pageOrientation: PDF_PAGE_ORITENTATION,
		header,
		background,
		footer,
		content: [
			{
			style: "myTable",
			table: {
				headerRows,
				widths,
				body,
				heights
			},
			layout: {
				fillColor,
				hLineWidth,
				vLineWidth,
				hLineColor,
				vLineColor,
			}
			}
		],
		pageBreakBefore: function(currentNode, followingNodesOnPage) {
			var pageInnerHeight = currentNode.startPosition.pageInnerHeight + 70
			var top = (currentNode.startPosition.top) ? currentNode.startPosition.top : 0
			var footerHeight = 10
			var nodeHeight = 0
			if (followingNodesOnPage && followingNodesOnPage.length) {
				nodeHeight = followingNodesOnPage[0].startPosition.top - top
			}
  
			if (currentNode.headlineLevel === 'footer') return false
  
			return (top + nodeHeight + footerHeight > pageInnerHeight)
				|| (currentNode.headlineLevel === 'longField' && (top + nodeHeight + footerHeight > pageInnerHeight))
				|| currentNode.startPosition.verticalRatio >= 0.95
		},
		images: {
			"ag-grid-logo": PDF_LOGO
		},
		styles: {
			myTable: {
			margin: [20, 0, 0, 0],
			fontSize: 10,
			},
			tableHeader: {
			bold: true,
			alignment: "center",
			margin: [0, PDF_HEADER_HEIGHT / 4, 0, 3]
			},
			tableCell: {
			fontSize: 10,
			alignment: "center",
			margin: [0, 2, 0, 0]
			}
		},
		pageMargins
		};

		return docDefintiion;
	})();

	function getColumnGroupsToExport() {
		let displayedColumnGroups = agGridColumnApi.getAllDisplayedColumnGroups();

		let isColumnGrouping = displayedColumnGroups.some(col =>
		col.hasOwnProperty("children")
		);

		if (!isColumnGrouping) {
		return null;
		}

		let columnGroupsToExport = [];

		displayedColumnGroups.forEach(colGroup => {
		let isColSpanning = colGroup.children.length > 1;
		let numberOfEmptyHeaderCellsToAdd = 0;

		if (isColSpanning) {
			let headerCell = createHeaderCell(colGroup);
			columnGroupsToExport.push(headerCell);
			// subtract 1 as the column group counts as a header
			numberOfEmptyHeaderCellsToAdd--;
		}

		// add an empty header cell now for every column being spanned
		colGroup.displayedChildren.forEach(childCol => {
			let pdfExportOptions = getPdfExportOptions(childCol.getColId());
			if (!pdfExportOptions || !pdfExportOptions.skipColumn) {
			numberOfEmptyHeaderCellsToAdd++;
			}
		});

		for (let i = 0; i < numberOfEmptyHeaderCellsToAdd; i++) {
			columnGroupsToExport.push({});
		}
		});

		return columnGroupsToExport;
	}

	function getColumnsToExport() {
		let columnsToExport = [];

		agGridColumnApi.getAllDisplayedColumns().forEach(col => {
		let pdfExportOptions = getPdfExportOptions(col.getColId());
		if (pdfExportOptions && pdfExportOptions.skipColumn) {
			return;
		}
		let headerCell = createHeaderCell(col);
		columnsToExport.push(headerCell);
		});

		return columnsToExport;
	}

	function getRowsToExport(columnsToExport) {
		let rowsToExport = [];

		agGridApi.forEachNodeAfterFilterAndSort(node => {
		if (PDF_SELECTED_ROWS_ONLY && !node.isSelected()) {
			return;
		}
		let rowToExport = columnsToExport.map(({ colId }) => {
			let cellValue = agGridApi.getValue(colId, node);
			let tableCell = createTableCell(cellValue, colId);
			return tableCell;
		});
		rowsToExport.push(rowToExport);
		});

		return rowsToExport;
	}

	function getExportedColumnsWidths(columnsToExport) {
		return columnsToExport.map(() => 100 / columnsToExport.length + "%");
	}

	function createHeaderCell(col) {
		let headerCell = {};

		let isColGroup = col.hasOwnProperty("children");

		if (isColGroup) {
		headerCell.text = col.originalColumnGroup.colGroupDef.headerName;
		headerCell.colSpan = col.children.length;
		headerCell.colId = col.groupId;
		} else {
		let headerName = col.colDef.headerName;

		if (col.sort) {
			headerName += ` (${col.sort})`;
		}
		if (col.filterActive) {
			headerName += ` [FILTERING]`;
		}

		headerCell.text = headerName;
		headerCell.colId = col.getColId();
		}

		headerCell["style"] = "tableHeader";

		return headerCell;
	}

	function createTableCell(cellValue, colId) {
		const tableCell = {
		text: cellValue !== undefined ? cellValue : "",
		// noWrap: PDF_PAGE_ORITENTATION === "landscape",
		style: "tableCell"
		};

		const pdfExportOptions = getPdfExportOptions(colId);

		if (pdfExportOptions) {
		const { styles, createURL } = pdfExportOptions;

		if (PDF_WITH_CELL_FORMATTING && styles) {
			Object.entries(styles).forEach(
			([key, value]) => (tableCell[key] = value)
			);
		}

		if (PDF_WITH_COLUMNS_AS_LINKS && createURL) {
			tableCell["link"] = createURL(cellValue);
			tableCell["color"] = "blue";
			tableCell["decoration"] = "underline";
		}
		}

		return tableCell;
	}

	function getPdfExportOptions(colId) {
		let col = agGridColumnApi.getColumn(colId);
		return col.colDef.pdfExportOptions;
	}
}
