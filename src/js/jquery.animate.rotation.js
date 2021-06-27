const matrixRegex = /(?:matrix\(|\s*,\s*)([-+]?[0-9]*\.?[0-9]+(?:[e][-+]?[0-9]+)?)/gi;

const getMatches = function(string, regex) {
    regex || (regex = matrixRegex);
    let matches = [];
    let match;
    while (match = regex.exec(string)) {
        matches.push(match[1]);
    }
    return matches;
};

$.cssHooks['rotation'] = {
    get: function(elem) {
        let $elem = $(elem);
        let matrix = getMatches($elem.css('transform'));
        if (matrix.length != 6) {
            return 0;
        }
        return Math.atan2(parseFloat(matrix[1]), parseFloat(matrix[0])) * (180/Math.PI);
    }, 
    set: function(elem, val){
        let $elem = $(elem);
        let deg = parseFloat(val);
        if (!isNaN(deg)) {
            $elem.css({ transform: 'rotate(' + deg + 'deg)' });
        }
    }
};
$.cssNumber.rotation = true;
$.fx.step.rotation = function(fx) {
    $.cssHooks.rotation.set(fx.elem, fx.now + fx.unit);
};