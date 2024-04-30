let x = 1;
let y = 1;
let mx = 2;
let my = 2;
let ZiPlay = 0;

let check = [{
  userMove:{
    x: x,
    y: y,
  },
  botMove:{
    x: mx,
    y: my,
  }
}]
let dataindex = [...(ZiPlay?.data || []), ...check];

if (dataindex.length > 4) {
  dataindex = dataindex.slice(-4); // Lấy 4 phần tử cuối cùng
}

console.log(dataindex)