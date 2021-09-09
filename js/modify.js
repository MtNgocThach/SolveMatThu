const TYPE = { DECONDING: 1, ENCONDING: 2, CHAR: 3, NUMBER: 4 };
const COMPARE_DATA = { A: 'A', Z: 'Z', 'NUMBER': 26, REGEX: /\W/ };
const COORDINATE = {
    MAX_X : 5, MAX_Y: 5,
    DISTINGUISH: {
        WORD: [','],
        TEXT: ['-', '/',]
    }
};

var typeRequest = TYPE.CHAR;
var typeAction = TYPE.DECONDING;

$('#submit, #encoding, #submitCoordinate, #encodingCoordinate').click(function(event) {
    typeAction = $(this).data('req');

    if ($(this).data('typesolve') === 1) {
        solveReplace();
    } else if ($(this).data('typesolve') === 2) {
        // typeAction = $(this).data('req');
        solveCoordinate();
    }
});

$('.js-choose-type').click(function(event) {
    typeRequest = $(this).data('req');
});

$('#char_numb-tab, #char_char-tab').click(function(event) {
    if ($(this).data('req') === 3) {
        $('#keyCompareNumb').val(null);
    } else {
        $('#keyCompareChar').val(null);
    }
});

function convertStringRequire(string) {
    return string.trim().toUpperCase();
}

function generaArrayChar(startInt, endInt) {
    var arrayCharter = [];

    for (let i = startInt; i <= endInt; ++i) {
        arrayCharter.push(String.fromCharCode(i));
    }

    return arrayCharter;
}

function generaArrayNumb(startInt, endInt) {
    var arrayNumber = [];

    for (let i = startInt; i <= endInt; i++) {
        arrayNumber.push(i);
    }

    return arrayNumber;
}

function getValueCommon(arrayCompare, arrayCharter, charSecret) {
    var charIndex;
    const isLargeNumber = (element) => element == charSecret;

    if (COMPARE_DATA.REGEX.test(charSecret)) {
        return charSecret;
    }
    if (typeAction === TYPE.DECONDING) {
        charIndex = arrayCompare.findIndex(isLargeNumber);
        return arrayCharter[charIndex];
    } else {
        charIndex = arrayCharter.findIndex(isLargeNumber);
        return arrayCompare[charIndex];
    }
}

function compareValueNumbers(args) {
    var result = '';
    var arrayCharter = buildArrayCharter(args.key);
    var arrayCompare = buildArrayNumber(args.keyCompare);
    var stringArr = args.secretString.split(COMPARE_DATA.REGEX);

    if (typeAction === TYPE.ENCONDING) {
        for (let index = 0; index < args.secretString.length; index++) {
            var char = getValueCommon(arrayCompare, arrayCharter, args.secretString[index]);
            if (char === undefined) {return ''};
            result += char + ' ';
        }
    } else {
        for (let index = 0; index < stringArr.length; index++) {
            if (stringArr[index]) {
                var char = getValueCommon(arrayCompare, arrayCharter, stringArr[index]) + ' ';
                if (char === undefined) {return ''};
                result += char + ' ';
            }
        }
    }

    return result;
}

function compareValueCharacters(args) {
    var result = '';
    var arrayCompare = buildArrayCharter(args.key);
    var arrayCharter = buildArrayCharter(args.keyCompare);

    for (let index = 0; index < args.secretString.length; index++) {
        result += getValueCommon(arrayCompare, arrayCharter, args.secretString[index]);
    }

    return result;
}

function buildArrayNumber(key) {
    var keyEnd = COMPARE_DATA.NUMBER;

    if (key !== 1) {
        result = generaArrayNumb(key, keyEnd);
        result = result.concat(generaArrayNumb(1, key - 1));
    } else {
        result = generaArrayNumb(1, keyEnd);
    }

    return result;
}

function buildArrayCharter(key) {
    var result = [];
    var keyEnd = COMPARE_DATA.Z;

    if (COMPARE_DATA.A.charCodeAt(0) !== key.charCodeAt(0)) {
        result = generaArrayChar(key.charCodeAt(0), keyEnd.charCodeAt(0));
        result = result.concat(generaArrayChar(COMPARE_DATA.A.charCodeAt(0), key.charCodeAt(0) - 1));
    } else {
        result = generaArrayChar(COMPARE_DATA.A.charCodeAt(0), keyEnd.charCodeAt(0));
    }

    return result;
}

function coordinateDecodeMapValue(listWord, objectKeyX, objectKeyY) {
    var textResult = '';

    for (let index = 0; index < listWord.length; index++) {
        var word = listWord[index].trim();
        var x = objectKeyX.findIndex(itemx => itemx === word[0]) + 1;
        var y = objectKeyY.findIndex(itemY => itemY === word[1]) + 1;
        var name = 'coordinate_' + x + '-' + y;

        textResult += convertStringRequire($("input[name=" + name + "]").val());
    }
    console.log(textResult);

    return textResult;
}

function coordinateEncodeMapValue(listWord, objectKeyX, objectKeyY) { // THIEEN
    var textResult = '';

    for (var index = 0; index < listWord.length; index++) {
        var name = 'coordinate_';

        for (var indexX = 1; indexX <= COORDINATE.MAX_X; indexX++) {
            secretKey = '';

            for (var indexY = 1; indexY <= COORDINATE.MAX_Y; indexY++) {
                var nameMapping = name + indexX + '-' + indexY; // coordinate_1-1

                if (convertStringRequire($("input[name=" + nameMapping +"]").val()) === convertStringRequire(listWord[index])) {
                    secretKey = objectKeyX[indexX - 1] + objectKeyY[indexY - 1];
                    break;
                }
            }
            if (secretKey) {
                textResult += textResult ? ',' + secretKey : secretKey;
                break;
            }
        }
    }

    return textResult;
}

function distinguishProcess(secretStringCoordinate) {
    var textResult = '';
    var secretArray = [], objectKeyX = [], objectKeyY = [];

    for (let indexX = 1; indexX <= COORDINATE.MAX_X; indexX++) {
        objectKeyX.push(convertStringRequire($("input[name=coordinate_" + indexX + "-0]").val()));
    }
    for (let indexY = 1; indexY <= COORDINATE.MAX_Y; indexY++) {
        objectKeyY.push(convertStringRequire($("input[name=coordinate_0-" + indexY + "]").val()));
    }

    if (typeAction === TYPE.DECONDING) {
        var distinguishText = COORDINATE.DISTINGUISH.TEXT.find(item => secretStringCoordinate.indexOf(item) > -1);

        if (distinguishText === undefined) {
            return textResult;
        }

        secretArray = secretStringCoordinate.split(distinguishText);
        for (let index = 0; index < secretArray.length; index++) {
            var distinguishWord = COORDINATE.DISTINGUISH.WORD.find(item => secretArray[0].indexOf(item) > -1);
            textResult += ' ' + coordinateDecodeMapValue(secretArray[index].split(distinguishWord), objectKeyX, objectKeyY);
        }
    } else {
        secretArray = secretStringCoordinate.split(' ');
        for (let index = 0; index < secretArray.length; index++) {
            if (textResult) {
                textResult += ' - ' + coordinateEncodeMapValue(secretArray[index], objectKeyX, objectKeyY);
            } else {
                textResult += coordinateEncodeMapValue(secretArray[index], objectKeyX, objectKeyY);
            }
        }
    }

    return textResult;
}

function solveReplace() {
    var result = '';
    var keyCompare = '';
    var key = $('#key').val().toUpperCase();
    var secretString = convertStringRequire($('#secretString').val());
    var keyCompareChar = convertStringRequire($('#keyCompareChar').val());
    var keyCompareNumb = convertStringRequire($('#keyCompareNumb').val());
    keyCompare = keyCompareChar || (keyCompareNumb ? parseInt(keyCompareNumb) : null);

    if (!key || !keyCompare || !secretString) {
        alert('Please enter secret key blocks and string!')
        return;
    }

    var args = { key: key, keyCompare: keyCompare, secretString: secretString }
    if (typeRequest === TYPE.NUMBER) {
        result = compareValueNumbers(args);
    } else {
        result = compareValueCharacters(args);
    }
    
    result = result === undefined ? null : result;

    if (typeAction === TYPE.DECONDING) {
        $('#stringDecoding').val(result.trim());
    } else {
        $('#stringEncoding').val(result.trim());
    }
}

function solveCoordinate() {
    var textResult = '';
    var secretStringCoordinate = convertStringRequire($('#secretStringCoordinate').val());

    if (!secretStringCoordinate) {
        alert('Vui lòng điền văn bản cần mã hoá/ giãi mã')
        return;
    }

    textResult = distinguishProcess(secretStringCoordinate).trim();

    if (!textResult) {
        alert('Vui lòng kiểm tra lại ô toạ độ')
    }
    if (typeAction === TYPE.DECONDING) {
        $('#stringDecodingCoordinate').val(textResult);
    } else {
        $('#stringEncodingCoordinate').val(textResult);
    }

}
