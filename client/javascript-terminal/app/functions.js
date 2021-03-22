function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomNumberExcluding(min, max, exclude) {
    while (true) {
        var rnd = Math.floor(Math.random() * (max - min) + min);
        if (exclude.length == 0 || exclude.indexOf(rnd) === -1) {
            return rnd;
        }
    }

  return Math.floor(Math.random() * (max - min) + min);
}