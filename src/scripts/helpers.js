export function getRoomCode() {
  var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = 0; i < 6; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
