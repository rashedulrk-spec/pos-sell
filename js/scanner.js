// ===============================
// BARCODE SCANNER (STEP–E)
// ===============================

let codeReader;
let scanning = false;

function startScanner() {
  const video = document.getElementById("scanner");
  const result = document.getElementById("scan-result");

  if (scanning) return;

  codeReader = new ZXing.BrowserMultiFormatReader();
  scanning = true;

  codeReader
    .decodeFromVideoDevice(null, video, (res, err) => {
      if (res) {
        const barcode = res.text;
        document.getElementById("sale-barcode").value = barcode;
        result.innerText = "Scanned: " + barcode;

        stopScanner(); // auto stop after scan
      }
    })
    .catch(err => {
      result.innerText = err;
    });
}

function stopScanner() {
  if (codeReader) {
    codeReader.reset();
    scanning = false;
  }
}
