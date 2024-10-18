const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Crear archivo XLSX
const createXlsx = (data, sheetName) => {
    return new Promise((resolve, reject) => {
        try {
            // Crear nuevo libro de trabajo
            const workbook = XLSX.utils.book_new();

            // Crear hoja de trabajo con los datos
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Añadir la hoja al libro
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // Definir la ruta del directorio tmp
            const tmpDir = path.join(__dirname, '..', 'tmp');

            // Verificar si el directorio tmp existe, si no, crearlo
            if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir, { recursive: true });
            }

            // Definir el nombre y ruta del archivo temporal
            const filePath = path.join(tmpDir, `${sheetName}_${Date.now()}.xlsx`);

            // Guardar el archivo XLSX
            XLSX.writeFile(workbook, filePath);

            // Devolver la ruta del archivo
            resolve(filePath);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = createXlsx;

