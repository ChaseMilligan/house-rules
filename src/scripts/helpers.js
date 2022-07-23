export function getRoomCode() {
  var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = 0; i < 6; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result.toString();
}

export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function percentage(partialValue, totalValue) {
  console.log(partialValue, totalValue);
  return Math.floor((100 * partialValue) / totalValue);
}
