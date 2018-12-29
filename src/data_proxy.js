import helper from './helper';
import { formulas as _formulas } from './formula';

const defaultData = {
  freezes: [0, 0],
  rowm: {}, // Map<int, Row>, len
  colm: {}, // Map<int, Row>, len
  cellmm: {}, // Map<int, Map<int, Cell>>
  styles: [],
  borders: [],
};

export default class DataProxy {
  constructor(options) {
    this.options = options;
    this.formulam = _formulas(options.formulas);
    this.d = defaultData;
  }

  load(data) {
    this.d = helper.merge(defaultData, data);
  }

  insertRow(index, n = 1) {
    const { cellmm, rowm } = this.d;
    const ndata = {};
    Object.keys(cellmm).forEach((ri) => {
      let nri = parseInt(ri, 10);
      if (nri >= index) {
        nri += n;
      }
      ndata[nri] = cellmm[ri];
    });
    this.d.cellmm = ndata;
    // console.log('row.len:', this.rowLen());
    rowm.len = this.rowLen() + n;
    // console.log('after.row.len:', this.rowLen());
  }

  deleteRow(min, max) {
    const { cellmm, rowm } = this.d;
    // console.log('min:', min, ',max:', max);
    const n = max - min + 1;
    const ndata = {};
    Object.keys(cellmm).forEach((ri) => {
      const nri = parseInt(ri, 10);
      if (nri < min) {
        ndata[nri] = cellmm[nri];
      } else if (ri > max) {
        ndata[nri - n] = cellmm[nri];
      }
    });
    // console.log('cellmm:', cellmm, ', ndata:', ndata);
    this.d.cellmm = ndata;
    rowm.len = this.rowLen() - n;
  }

  insertColumn(index, n = 1) {
    const { cellmm, colm } = this.d;
    Object.keys(cellmm).forEach((ri) => {
      const rndata = {};
      Object.keys(cellmm[ri]).forEach((ci) => {
        let nci = parseInt(ci, 10);
        if (nci >= index) {
          nci += n;
        }
        rndata[nci] = cellmm[ri][ci];
      });
      cellmm[ri] = rndata;
    });
    colm.len = this.colLen() + n;
  }

  deleteColumn(min, max) {
    const { cellmm, colm } = this.d;
    const n = max - min + 1;
    Object.keys(cellmm).forEach((ri) => {
      const rndata = {};
      Object.keys(cellmm[ri]).forEach((ci) => {
        const nci = parseInt(ci, 10);
        if (nci < min) {
          rndata[nci] = cellmm[ri][ci];
        } else if (nci > max) {
          rndata[nci - n] = cellmm[ri][ci];
        }
      });
      cellmm[ri] = rndata;
    });
    colm.len = this.colLen() - n;
  }

  colTotalWidth() {
    return this.colSumWidth(0, this.colLen());
  }

  rowTotalHeight() {
    return this.rowSumHeight(0, this.rowLen());
  }

  cellRect(ri, ci) {
    const { left, top } = this.cellPosition(ri, ci);
    return {
      left,
      top,
      width: this.getColWidth(ci),
      height: this.getRowHeight(ri),
    };
  }

  cellPosition(ri, ci) {
    const left = this.colSumWidth(0, ci);
    const top = this.rowSumHeight(0, ri);
    return {
      left, top,
    };
  }

  getCell(ri, ci) {
    const { cellmm } = this.d;
    if (cellmm[ri] !== undefined && cellmm[ri][ci] !== undefined) {
      return cellmm[ri][ci];
    }
    return null;
  }

  getCellStyle(ri, ci) {
    const cell = this.getCell(ri, ci);
    const { styles } = this.d;
    // console.log('options:', this.opitons.style);
    return helper.merge(this.options.style, cell.si !== undefined ? styles[cell.si] : {});
  }

  setCellText(ri, ci, text) {
    const { cellmm } = this.d;
    cellmm[ri] = cellmm[ri] || {};
    cellmm[ri][ci] = cellmm[ri][ci] || {};
    cellmm[ri][ci].text = text;
  }

  getFreezes() {
    return this.d.freezes;
  }

  setFreezes(ri, ci) {
    this.d.freezes[0] = ri;
    this.d.freezes[1] = ci;
  }

  freezeTotalWidth() {
    return this.colSumWidth(0, this.d.freezes[1] - 1);
  }

  freezeTotalHeight() {
    return this.rowSumHeight(0, this.d.freezes[0] - 1);
  }

  colSumWidth(min, max) {
    return helper.rangeSum(min, max, i => this.getColWidth(i));
  }

  rowSumHeight(min, max) {
    return helper.rangeSum(min, max, i => this.getRowHeight(i));
  }

  rowEach(rowLen, cb) {
    let y = 0;
    for (let i = 0; i <= rowLen; i += 1) {
      const rowHeight = this.getRowHeight(i);
      cb(i, y, rowHeight);
      y += rowHeight;
    }
  }

  colEach(colLen, cb) {
    let x = 0;
    for (let i = 0; i <= colLen; i += 1) {
      const colWidth = this.getColWidth(i);
      cb(i, x, colWidth);
      x += colWidth;
    }
  }

  rowLen() {
    return this.d.rowm.len || this.options.row.len;
  }

  colLen() {
    return this.d.colm.len || this.options.col.len;
  }

  getColWidth(index) {
    const { colm } = this.d;
    const { col } = this.options;
    return colm[`${index}`] ? colm[`${index}`].width : col.width;
  }

  setColWidth(index, v) {
    const { colm } = this.d;
    colm[`${index}`] = colm[`${index}`] || {};
    colm[`${index}`].width = v;
  }

  getRowHeight(index) {
    const { rowm } = this.d;
    const { row } = this.options;
    return rowm[`${index}`] ? rowm[`${index}`].height : row.height;
  }

  setRowHeight(index, v) {
    const { rowm } = this.d;
    rowm[`${index}`] = rowm[`${index}`] || {};
    rowm[`${index}`].height = v;
  }
}