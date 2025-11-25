const unescapeHtml = (str) => {
  if (!str) return '';
  return str
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/&/g, '&');
};

const input = "<p>Listrik 3000 watt</p><p>Pendingin ruangan AC: 8 unit</p><p>Stop Kontak: 6 buah</p><p>CCTV: 1 buah</p><p>Alat pemadam api ringan (APAR): 1 buah</p>";
console.log("Input:", input);
console.log("Unescaped:", unescapeHtml(input));

const input2 = "<p>Listrik 3000 watt</p><p>Pendingin ruangan AC: 8 unit</p><p>Stop Kontak: 6 buah</p><p>CCTV: 1 buah</p><p>Alat pemadam api ringan (APAR): 1 buah</p>";
console.log("Input 2:", input2);
console.log("Unescaped 2:", unescapeHtml(input2));