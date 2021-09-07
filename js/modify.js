const TYPE = { DECONDING: 1, ENCONDING: 2, CHAR: 3, NUMBER: 4 };
const COMPARE_DATA = { A: 'A', Z: 'Z', 'NUMBER': 26, REGEX: /\W/};

$('#secretString').keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        solveStringSecret({type: TYPE.DECONDING});
    }
});

$('#submit, #encoding').click(function(event) {
    solveStringSecret({type: $(this).data('req')});
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

var typeRequest = TYPE.CHAR;

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

function getValueCommon(arrayCompare, arrayCharter, charSecret, type) {
    var charIndex;
    const isLargeNumber = (element) => element == charSecret;

    if (COMPARE_DATA.REGEX.test(charSecret)) {
        return charSecret;
    }
    if (type === TYPE.DECONDING) {
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

    if (args.type === TYPE.ENCONDING) {
        for (let index = 0; index < args.secretString.length; index++) {
            var char = getValueCommon(arrayCompare, arrayCharter, args.secretString[index], args.type);
            if (char === undefined) {return ''};
            result += char + ' ';
        }
    } else {
        for (let index = 0; index < stringArr.length; index++) {
            if (stringArr[index]) {
                var char = getValueCommon(arrayCompare, arrayCharter, stringArr[index], args.type) + ' ';
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
        result += getValueCommon(arrayCompare, arrayCharter, args.secretString[index], args.type);
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

function solveStringSecret(params) {
    var result = '';
    var keyCompare = '';
    var key = $('#key').val().toUpperCase();
    var secretString = $('#secretString').val().trim().toUpperCase();
    var keyCompareChar = $('#keyCompareChar').val().trim().toUpperCase();
    var keyCompareNumb = $('#keyCompareNumb').val().trim().toUpperCase();
    keyCompare = keyCompareChar || (keyCompareNumb ? parseInt(keyCompareNumb) : null);

    if (!key || !keyCompare || !secretString) {
        alert('Please enter secret key blocks and string!')
        return;
    }

    var args = { key: key, type: params.type, keyCompare: keyCompare, secretString: secretString }
    if (typeRequest === TYPE.NUMBER) {
        result = compareValueNumbers(args);
    } else {
        result = compareValueCharacters(args);
    }
    
    result = result === undefined ? null : result;

    if (params.type === TYPE.DECONDING) {
        $('#stringDecoding').val(result.trim());
    } else {
        $('#stringEncoding').val(result.trim());
    }
}