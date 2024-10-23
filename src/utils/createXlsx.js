const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const createXlsx = (data, sheetName) => {
    return new Promise((resolve, reject) => {
        try {

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            const tmpDir = path.join(__dirname, '..', 'tmp');

            if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir, { recursive: true });
            }

            const filePath = path.join(tmpDir, `${sheetName}_${Date.now()}.xlsx`);
            XLSX.writeFile(workbook, filePath);
            resolve(filePath);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = createXlsx;

