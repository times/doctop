/*! doctop - v1.1.1 - 2015-02-22
* https://github.com/times/doctop
* Copyright (c) 2015 Ændrew Rininsland; Licensed MIT */
(function() {
    'use strict';

    /**
     * getSlug
     * @param   {string} input input string
     * @param   {object|string} opts config object or separator string/char
     * @api     public
     * @return  {string}  sluggified string
     */
    var getSlug = function getSlug(input, opts) {

        var maintainCase = (typeof opts === 'object' && opts.maintainCase) || false;
        var titleCase = (typeof opts === 'object' && opts.titleCase) ? opts.titleCase : false;
        var customReplacements = (typeof opts === 'object' && typeof opts.custom === 'object' && opts.custom) ? opts.custom : {};
        var separator = (typeof opts === 'object' && opts.separator) || '-';
        var truncate = (typeof opts === 'object' && +opts.truncate > 1 && opts.truncate) || false;
        var uricFlag = (typeof opts === 'object' && opts.uric) || false;
        var uricNoSlashFlag = (typeof opts === 'object' && opts.uricNoSlash) || false;
        var markFlag = (typeof opts === 'object' && opts.mark) || false;
        var symbol = (typeof opts === 'object' && opts.lang && symbolMap[opts.lang]) ?
            symbolMap[opts.lang] :
            (typeof opts === 'object' && (opts.lang === false || opts.lang === true) ? {} : symbolMap.en);
        var langChar = (typeof opts === 'object' && opts.lang && langCharMap[opts.lang]) ?
            langCharMap[opts.lang] :
            (typeof opts === 'object' && (opts.lang === false || opts.lang === true) ? {} : langCharMap.en);
        var uricChars = [';', '?', ':', '@', '&', '=', '+', '$', ',', '/'];
        var uricNoSlashChars = [';', '?', ':', '@', '&', '=', '+', '$', ','];
        var markChars = ['.', '!', '~', '*', '\'', '(', ')'];
        var result = '';
        var lucky;
        var allowedChars = separator;
        var i;
        var ch;
        var l;
        var lastCharWasSymbol;

        if (titleCase && typeof titleCase.length === "number" && Array.prototype.toString.call(titleCase)) {

            // custom config is an Array, rewrite to object format
            titleCase.forEach(function(v) {
                customReplacements[v + ""] = v + "";
            });
        }

        if (typeof input !== 'string') {
            return '';
        }

        if (typeof opts === 'string') {
            separator = opts;
        } else if (typeof opts === 'object') {

            if (uricFlag) {
                allowedChars += uricChars.join('');
            }

            if (uricNoSlashFlag) {
                allowedChars += uricNoSlashChars.join('');
            }

            if (markFlag) {
                allowedChars += markChars.join('');
            }
        }

        // custom replacements
        Object.keys(customReplacements).forEach(function(v) {

            var r;

            if (v.length > 1) {
                r = new RegExp('\\b' + escapeChars(v) + '\\b', 'gi');
            } else {
                r = new RegExp(escapeChars(v), 'gi');
            }

            input = input.replace(r, customReplacements[v]);
        });

        if (titleCase) {

            input = input.replace(/(\w)(\S*)/g, function(_, i, r) {
                var j = i.toUpperCase() + (r !== null ? r : "");
                return (Object.keys(customReplacements).indexOf(j.toLowerCase()) < 0) ? j : j.toLowerCase();
            });
        }

        // escape all necessary chars
        allowedChars = escapeChars(allowedChars);

        // trim whitespaces
        input = input.replace(/(^\s+|\s+$)/g, '');

        lastCharWasSymbol = false;
        for (i = 0, l = input.length; i < l; i++) {

            ch = input[i];

            if (langChar[ch]) {

                // process language specific diactrics chars conversion
                ch = lastCharWasSymbol && langChar[ch].match(/[A-Za-z0-9]/) ? ' ' + langChar[ch] : langChar[ch];

                lastCharWasSymbol = false;
            } else if (ch in charMap) {
                // process diactrics chars
                ch = lastCharWasSymbol && charMap[ch].match(/[A-Za-z0-9]/) ? ' ' + charMap[ch] : charMap[ch];

                lastCharWasSymbol = false;
            } else if (

                // process symbol chars
                symbol[ch] && !(uricFlag && uricChars.join('')
                    .indexOf(ch) !== -1) && !(uricNoSlashFlag && uricNoSlashChars.join('')
                    .indexOf(ch) !== -1) && !(markFlag && markChars.join('')
                    .indexOf(ch) !== -1)) {

                ch = lastCharWasSymbol || result.substr(-1).match(/[A-Za-z0-9]/) ? separator + symbol[ch] : symbol[ch];
                ch += input[i + 1] !== void 0 && input[i + 1].match(/[A-Za-z0-9]/) ? separator : '';

                lastCharWasSymbol = true;
            } else {

                // process latin chars
                if (lastCharWasSymbol && (/[A-Za-z0-9]/.test(ch) || result.substr(-1).match(/A-Za-z0-9]/))) {

                    ch = ' ' + ch;
                }
                lastCharWasSymbol = false;
            }

            // add allowed chars
            result += ch.replace(new RegExp('[^\\w\\s' + allowedChars + '_-]', 'g'), separator);
        }

        // eliminate duplicate separators
        // add separator
        // trim separators from start and end
        result = result.replace(/\s+/g, separator)
            .replace(new RegExp('\\' + separator + '+', 'g'), separator)
            .replace(new RegExp('(^\\' + separator + '+|\\' + separator + '+$)', 'g'), '');

        if (truncate && result.length > truncate) {

            lucky = result.charAt(truncate) === separator;
            result = result.slice(0, truncate);

            if (!lucky) {
                result = result.slice(0, result.lastIndexOf(separator));
            }
        }

        if (!maintainCase && !titleCase && !titleCase.length) {
            result = result.toLowerCase();
        }

        return result;
    };

    /**
     * createSlug curried(opts)(input)
     * @param   {object|string} opts config object or input string
     * @return  {Function} function getSlugWithConfig()
     **/
    var createSlug = function createSlug(opts) {

        /**
         * getSlugWithConfig
         * @param   {string} input string
         * @return  {string} slug string
         */
        return function getSlugWithConfig(input) {
            return getSlug(input, opts);
        };
    };

    var escapeChars = function escapeChars(input) {
        return input.replace(/[-\\^$*+?.()|[\]{}\/]/g, '\\$&');
    };

    /**
     * charMap
     * @type {Object}
     */
    var charMap = {

        // latin
        'À': 'A',
        'Á': 'A',
        'Â': 'A',
        'Ã': 'A',
        'Ä': 'Ae',
        'Å': 'A',
        'Æ': 'AE',
        'Ç': 'C',
        'È': 'E',
        'É': 'E',
        'Ê': 'E',
        'Ë': 'E',
        'Ì': 'I',
        'Í': 'I',
        'Î': 'I',
        'Ï': 'I',
        'Ð': 'D',
        'Ñ': 'N',
        'Ò': 'O',
        'Ó': 'O',
        'Ô': 'O',
        'Õ': 'O',
        'Ö': 'Oe',
        'Ő': 'O',
        'Ø': 'O',
        'Ù': 'U',
        'Ú': 'U',
        'Û': 'U',
        'Ü': 'Ue',
        'Ű': 'U',
        'Ý': 'Y',
        'Þ': 'TH',
        'ß': 'ss',
        'à': 'a',
        'á': 'a',
        'â': 'a',
        'ã': 'a',
        'ä': 'ae',
        'å': 'a',
        'æ': 'ae',
        'ç': 'c',
        'è': 'e',
        'é': 'e',
        'ê': 'e',
        'ë': 'e',
        'ì': 'i',
        'í': 'i',
        'î': 'i',
        'ï': 'i',
        'ð': 'd',
        'ñ': 'n',
        'ò': 'o',
        'ó': 'o',
        'ô': 'o',
        'õ': 'o',
        'ö': 'oe',
        'ő': 'o',
        'ø': 'o',
        'ù': 'u',
        'ú': 'u',
        'û': 'u',
        'ü': 'ue',
        'ű': 'u',
        'ý': 'y',
        'þ': 'th',
        'ÿ': 'y',
        'ẞ': 'SS',

        // greek
        'α': 'a',
        'β': 'v',
        'γ': 'g',
        'δ': 'd',
        'ε': 'e',
        'ζ': 'z',
        'η': 'i',
        'θ': 'th',
        'ι': 'i',
        'κ': 'k',
        'λ': 'l',
        'μ': 'm',
        'ν': 'n',
        'ξ': 'ks',
        'ο': 'o',
        'π': 'p',
        'ρ': 'r',
        'σ': 's',
        'τ': 't',
        'υ': 'y',
        'φ': 'f',
        'χ': 'x',
        'ψ': 'ps',
        'ω': 'o',
        'ά': 'a',
        'έ': 'e',
        'ί': 'i',
        'ό': 'o',
        'ύ': 'y',
        'ή': 'i',
        'ώ': 'o',
        'ς': 's',
        'ϊ': 'i',
        'ΰ': 'y',
        'ϋ': 'y',
        'ΐ': 'i',
        'Α': 'A',
        'Β': 'B',
        'Γ': 'G',
        'Δ': 'D',
        'Ε': 'E',
        'Ζ': 'Z',
        'Η': 'I',
        'Θ': 'TH',
        'Ι': 'I',
        'Κ': 'K',
        'Λ': 'L',
        'Μ': 'M',
        'Ν': 'N',
        'Ξ': 'KS',
        'Ο': 'O',
        'Π': 'P',
        'Ρ': 'R',
        'Σ': 'S',
        'Τ': 'T',
        'Υ': 'Y',
        'Φ': 'F',
        'Χ': 'X',
        'Ψ': 'PS',
        'Ω': 'W',
        'Ά': 'A',
        'Έ': 'E',
        'Ί': 'I',
        'Ό': 'O',
        'Ύ': 'Y',
        'Ή': 'I',
        'Ώ': 'O',
        'Ϊ': 'I',
        'Ϋ': 'Y',

        // turkish
        'ş': 's',
        'Ş': 'S',
        'ı': 'i',
        'İ': 'I',
        // 'ç': 'c', // duplicate
        // 'Ç': 'C', // duplicate
        // 'ü': 'ue', // duplicate
        // 'Ü': 'Ue', // duplicate
        // 'ö': 'oe', // duplicate
        // 'Ö': 'Oe', // duplicate
        'ğ': 'g',
        'Ğ': 'G',

        // macedonian
        'Ќ': 'Kj',
        'ќ': 'kj',
        'Љ': 'Lj',
        'љ': 'lj',
        'Њ': 'Nj',
        'њ': 'nj',
        'Тс': 'Ts',
        'тс': 'ts',

        // russian
        'а': 'a',
        'б': 'b',
        'в': 'v',
        'г': 'g',
        'д': 'd',
        'е': 'e',
        'ё': 'yo',
        'ж': 'zh',
        'з': 'z',
        'и': 'i',
        'й': 'j',
        'к': 'k',
        'л': 'l',
        'м': 'm',
        'н': 'n',
        'о': 'o',
        'п': 'p',
        'р': 'r',
        'с': 's',
        'т': 't',
        'у': 'u',
        'ф': 'f',
        'х': 'h',
        'ц': 'c',
        'ч': 'ch',
        'ш': 'sh',
        'щ': 'sh',
        'ъ': '',
        'ы': 'y',
        'ь': '',
        'э': 'e',
        'ю': 'yu',
        'я': 'ya',
        'А': 'A',
        'Б': 'B',
        'В': 'V',
        'Г': 'G',
        'Д': 'D',
        'Е': 'E',
        'Ё': 'Yo',
        'Ж': 'Zh',
        'З': 'Z',
        'И': 'I',
        'Й': 'J',
        'К': 'K',
        'Л': 'L',
        'М': 'M',
        'Н': 'N',
        'О': 'O',
        'П': 'P',
        'Р': 'R',
        'С': 'S',
        'Т': 'T',
        'У': 'U',
        'Ф': 'F',
        'Х': 'H',
        'Ц': 'C',
        'Ч': 'Ch',
        'Ш': 'Sh',
        'Щ': 'Sh',
        'Ъ': '',
        'Ы': 'Y',
        'Ь': '',
        'Э': 'E',
        'Ю': 'Yu',
        'Я': 'Ya',

        // ukranian
        'Є': 'Ye',
        'І': 'I',
        'Ї': 'Yi',
        'Ґ': 'G',
        'є': 'ye',
        'і': 'i',
        'ї': 'yi',
        'ґ': 'g',

        // czech
        'č': 'c',
        'ď': 'd',
        'ě': 'e',
        'ň': 'n',
        'ř': 'r',
        'š': 's',
        'ť': 't',
        'ů': 'u',
        'ž': 'z',
        'Č': 'C',
        'Ď': 'D',
        'Ě': 'E',
        'Ň': 'N',
        'Ř': 'R',
        'Š': 'S',
        'Ť': 'T',
        'Ů': 'U',
        'Ž': 'Z',

        // slovak
        'ľ': 'l',
        'ĺ': 'l',
        'ŕ': 'r',
        'Ľ': 'L',
        'Ĺ': 'L',
        'Ŕ': 'R',

        // polish
        'ą': 'a',
        'ć': 'c',
        'ę': 'e',
        'ł': 'l',
        'ń': 'n',
        // 'ó': 'o', // duplicate
        'ś': 's',
        'ź': 'z',
        'ż': 'z',
        'Ą': 'A',
        'Ć': 'C',
        'Ę': 'E',
        'Ł': 'L',
        'Ń': 'N',
        'Ś': 'S',
        'Ź': 'Z',
        'Ż': 'Z',

        // latvian
        'ā': 'a',
        // 'č': 'c', // duplicate
        'ē': 'e',
        'ģ': 'g',
        'ī': 'i',
        'ķ': 'k',
        'ļ': 'l',
        'ņ': 'n',
        // 'š': 's', // duplicate
        'ū': 'u',
        // 'ž': 'z', // duplicate
        'Ā': 'A',
        // 'Č': 'C', // duplicate
        'Ē': 'E',
        'Ģ': 'G',
        'Ī': 'I',
        'Ķ': 'k',
        'Ļ': 'L',
        'Ņ': 'N',
        // 'Š': 'S', // duplicate
        'Ū': 'U',
        // 'Ž': 'Z', // duplicate

        // Arabic
        'ا': 'a',
        'أ': 'a',
        'إ': 'i',
        'آ': 'aa',
        'ؤ': 'u',
        'ئ': 'e',
        'ء': 'a',
        'ب': 'b',
        'ت': 't',
        'ث': 'th',
        'ج': 'j',
        'ح': 'h',
        'خ': 'kh',
        'د': 'd',
        'ذ': 'th',
        'ر': 'r',
        'ز': 'z',
        'س': 's',
        'ش': 'sh',
        'ص': 's',
        'ض': 'dh',
        'ط': 't',
        'ظ': 'z',
        'ع': 'a',
        'غ': 'gh',
        'ف': 'f',
        'ق': 'q',
        'ك': 'k',
        'ل': 'l',
        'م': 'm',
        'ن': 'n',
        'ه': 'h',
        'و': 'w',
        'ي': 'y',
        'ى': 'a',
        'ة': 'h',
        'ﻻ': 'la',
        'ﻷ': 'laa',
        'ﻹ': 'lai',
        'ﻵ': 'laa',

        // Arabic diactrics
        'َ': 'a',
        'ً': 'an',
        'ِ': 'e',
        'ٍ': 'en',
        'ُ': 'u',
        'ٌ': 'on',
        'ْ': '',

        // Arabic numbers
        '٠': '0',
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',

        // symbols
        '“': '"',
        '”': '"',
        '‘': '\'',
        '’': '\'',
        '∂': 'd',
        'ƒ': 'f',
        '™': '(TM)',
        '©': '(C)',
        'œ': 'oe',
        'Œ': 'OE',
        '®': '(R)',
        '†': '+',
        '℠': '(SM)',
        '…': '...',
        '˚': 'o',
        'º': 'o',
        'ª': 'a',
        '•': '*',
        // currency
        '$': 'USD',
        '€': 'EUR',
        '₢': 'BRN',
        '₣': 'FRF',
        '£': 'GBP',
        '₤': 'ITL',
        '₦': 'NGN',
        '₧': 'ESP',
        '₩': 'KRW',
        '₪': 'ILS',
        '₫': 'VND',
        '₭': 'LAK',
        '₮': 'MNT',
        '₯': 'GRD',
        '₱': 'ARS',
        '₲': 'PYG',
        '₳': 'ARA',
        '₴': 'UAH',
        '₵': 'GHS',
        '¢': 'cent',
        '¥': 'CNY',
        '元': 'CNY',
        '円': 'YEN',
        '﷼': 'IRR',
        '₠': 'EWE',
        '฿': 'THB',
        '₨': 'INR',
        '₹': 'INR',
        '₰': 'PF',

        // Vietnamese
        'đ': 'd',
        'Đ': 'D',
        'ẹ': 'e',
        'Ẹ': 'E',
        'ẽ': 'e',
        'Ẽ': 'E',
        'ế': 'e',
        'Ế': 'E',
        'ề': 'e',
        'Ề': 'E',
        'ệ': 'e',
        'Ệ': 'E',
        'ễ': 'e',
        'Ễ': 'E',
        'ọ': 'o',
        'Ọ': 'o',
        'ố': 'o',
        'Ố': 'O',
        'ồ': 'o',
        'Ồ': 'O',
        'ộ': 'o',
        'Ộ': 'O',
        'ỗ': 'o',
        'Ỗ': 'O',
        'ơ': 'o',
        'Ơ': 'O',
        'ớ': 'o',
        'Ớ': 'O',
        'ờ': 'o',
        'Ờ': 'O',
        'ợ': 'o',
        'Ợ': 'O',
        'ỡ': 'o',
        'Ỡ': 'O',
        'ị': 'i',
        'Ị': 'I',
        'ĩ': 'i',
        'Ĩ': 'I',
        'ụ': 'u',
        'Ụ': 'U',
        'ũ': 'u',
        'Ũ': 'U',
        'ư': 'u',
        'Ư': 'U',
        'ứ': 'u',
        'Ứ': 'U',
        'ừ': 'u',
        'Ừ': 'U',
        'ự': 'u',
        'Ự': 'U',
        'ữ': 'u',
        'Ữ': 'U',
        'ỳ': 'y',
        'Ỳ': 'Y',
        'ỵ': 'y',
        'Ỵ': 'Y',
        'ỹ': 'y',
        'Ỹ': 'Y',
        'ạ': 'a',
        'Ạ': 'A',
        'ấ': 'a',
        'Ấ': 'A',
        'ầ': 'a',
        'Ầ': 'A',
        'ậ': 'a',
        'Ậ': 'A',
        'ẫ': 'a',
        'Ẫ': 'A',
        'ă': 'a',
        'Ă': 'A',
        'ắ': 'a',
        'Ắ': 'A',
        'ằ': 'a',
        'Ằ': 'A',
        'ặ': 'a',
        'Ặ': 'A',
        'ẵ': 'a',
        'Ẵ': 'A'
    };

    /**
     * langCharMap language specific characters translations
     * @type   {Object}
     */
    var langCharMap = {
        'en': {}, // default language
        'sk': {
            'ä': 'a',
            'Ä': 'A'
        }
    };

    /**
     * symbolMap language specific symbol translations
     * @type   {Object}
     */
    var symbolMap = {

        'ar': {
            '∆': 'delta',
            '∞': 'la-nihaya',
            '♥': 'hob',
            '&': 'wa',
            '|': 'aw',
            '<': 'aqal-men',
            '>': 'akbar-men',
            '∑': 'majmou',
            '¤': 'omla'
        },

        'cz': {
            '∆': 'delta',
            '∞': 'nekonecno',
            '♥': 'laska',
            '&': 'a',
            '|': 'nebo',
            '<': 'mene jako',
            '>': 'vice jako',
            '∑': 'soucet',
            '¤': 'mena'
        },

        'de': {
            '∆': 'delta',
            '∞': 'unendlich',
            '♥': 'Liebe',
            '&': 'und',
            '|': 'oder',
            '<': 'kleiner als',
            '>': 'groesser als',
            '∑': 'Summe von',
            '¤': 'Waehrung'
        },

        'en': {
            '∆': 'delta',
            '∞': 'infinity',
            '♥': 'love',
            '&': 'and',
            '|': 'or',
            '<': 'less than',
            '>': 'greater than',
            '∑': 'sum',
            '¤': 'currency'
        },

        'es': {
            '∆': 'delta',
            '∞': 'infinito',
            '♥': 'amor',
            '&': 'y',
            '|': 'u',
            '<': 'menos que',
            '>': 'mas que',
            '∑': 'suma de los',
            '¤': 'moneda'
        },

        'fr': {
            '∆': 'delta',
            '∞': 'infiniment',
            '♥': 'Amour',
            '&': 'et',
            '|': 'ou',
            '<': 'moins que',
            '>': 'superieure a',
            '∑': 'somme des',
            '¤': 'monnaie'
        },

        'nl': {
            '∆': 'delta',
            '∞': 'oneindig',
            '♥': 'liefde',
            '&': 'en',
            '|': 'of',
            '<': 'kleiner dan',
            '>': 'groter dan',
            '∑': 'som',
            '¤': 'valuta'
        },
        
        'it': {
            '∆': 'delta',
            '∞': 'infinito',
            '♥': 'amore',
            '&': 'e',
            '|': 'o',
            '<': 'minore di',
            '>': 'maggiore di',
            '∑': 'somma',
            '¤': 'moneta'
        },
        
        'pt': {
            '∆': 'delta',
            '∞': 'infinito',
            '♥': 'amor',
            '&': 'e',
            '|': 'ou',
            '<': 'menor que',
            '>': 'maior que',
            '∑': 'soma',
            '¤': 'moeda'
        },

        'ru': {
            '∆': 'delta',
            '∞': 'beskonechno',
            '♥': 'lubov',
            '&': 'i',
            '|': 'ili',
            '<': 'menshe',
            '>': 'bolshe',
            '∑': 'summa',
            '¤': 'valjuta'
        },

        'sk': {
            '∆': 'delta',
            '∞': 'nekonecno',
            '♥': 'laska',
            '&': 'a',
            '|': 'alebo',
            '<': 'menej ako',
            '>': 'viac ako',
            '∑': 'sucet',
            '¤': 'mena'
        },

        'tr': {
            '∆': 'delta',
            '∞': 'sonsuzluk',
            '♥': 'ask',
            '&': 've',
            '|': 'veya',
            '<': 'kucuktur',
            '>': 'buyuktur',
            '∑': 'toplam',
            '¤': 'para birimi'
        },

        'vn': {
            '∆': 'delta',
            '∞': 'vo cuc',
            '♥': 'yeu',
            '&': 'va',
            '|': 'hoac',
            '<': 'nho hon',
            '>': 'lon hon',
            '∑': 'tong',
            '¤': 'tien te'
        }
    };

    if (typeof module !== 'undefined' && module.exports) {

        // export functions for use in Node
        module.exports = getSlug;
        module.exports.createSlug = createSlug;

    } else if (typeof define !== 'undefined' && define.amd) {

        // export function for use in AMD
        define([], function() {
            return getSlug;
        });

    } else {

        // don't overwrite global if exists
        try {
            if (window.getSlug || window.createSlug) {
                throw 'speakingurl: globals exists /(getSlug|createSlug)/';
            } else {
                window.getSlug = getSlug;
                window.createSlug = createSlug;
            }
        } catch (e) {}

    }
})();

(function ($) {

  // Static method.
  $.doctop = function (options) {
    // Override default options with passed-in options.
    this.options = $.extend({}, $.doctop.options, options);

    this._parseAndCleanDOM = function(res) {
      var root;
      if (this.options.staticExport) {
        root = $(res)
                .not('meta')
                .not('style')
                .not('title');
      } else {
        root = $(res)
        .filter('#contents')
        .children()
        .not('style'); // Don't need no stylesheets hurr!
      }

      // Replace spans with proper <strong> and <em> elements.
      if (this.options.preserveFormatting || this.options.fancyOutput) {
        var textStyles = this.options.staticExport ? $(res).filter('style')[0].innerHTML : $(res).filter('#contents').children('style')[0].innerHTML;
        var boldClass = /(\.[a-z0-9]+?)\{[^{}]*?font-weight:bold[^{}]*?\}/gi.exec(textStyles);
        var italicClass = /(\.[a-z0-9]+?)\{[^{}]*?font-style:italic[^{}]*?\}/gi.exec(textStyles);
        if (boldClass && boldClass.length > 0) {
          root.find('span' + boldClass[1]).each(function(i, v){
            $(v).replaceWith('<strong>'  + v.innerHTML + '</strong>');
          });
        }

        if (italicClass && italicClass.length >  0) {
          root.find('span' + italicClass[1]).each(function(i, v){
            $(v).replaceWith('<em>' + v.innerHTML + '</em>');
          });
        }
      }

      // Strip out all the stupid class-less <span> tags
      $.grep(root.find('span'), function(v){
        if ($(v).text().length > 0) {
          $(v).replaceWith(v.innerHTML);
          return true;
        }
      });

      // Remove &nbsp; and Unicode 160
      root.each(function(i, v){
        v.innerHTML = v.innerHTML.replace(/(?:\x0A|&nbsp;)/gi, ' ');
      });

      return root;
    };

    this._parseDOMIntoTree = function(root) {
      var options = this.options;

      var _returnNode = function(tree, node) {
        if (options.fancyOutput) {
          return {
            index: Object.keys(tree).length,
            content: node.textContent.trim(),
            children: {}
          };
        } else {
          return {};
        }
      };

      var _returnParagraph = function(node, currentTree) {
        if (options.fancyOutput) {
          return {
            content: $(node).text(),
            content_html: node.innerHTML,
            index: Object.keys(currentTree).length
          };
        } else if (options.preserveFormatting) {
          return node.innerHTML;
        } else {
          return $(node).text();
        }
      };

      var _enumerateKey = function(key, tree) {
        var i = 0;
        while (typeof tree[key] !== 'undefined') {
          key = key + '_' + i;
          i++;
        }

        return key;
      };

      // Begin the main DOM walker!

      var tree = {};
      var currentTree = tree;
      var currentLevel = 1;
      var i = 0;
      var node = root[0];
      var tagName, key, lastTree;
      while (node && node.nodeType === 1) {
        tagName = node.tagName.toLowerCase();

        // Handle headers
        switch(tagName) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            key = options.simpleKeys ? tagName + '_' + i : getSlug(node.textContent.trim(), {separator: '_'});
            if (tagName === 'h1') { // is top level
              key = _enumerateKey(key, tree);
              tree[key] = _returnNode(tree, node);
              currentTree = options.fancyOutput ? tree[key].children : tree[key];
              lastTree = currentTree;
            } else {
              if (currentLevel >= Number(tagName.substr(1))) { // go up a level; same level
                key = _enumerateKey(key, lastTree);
                lastTree[key] = _returnNode(lastTree, node);
                currentTree = options.fancyOutput ? lastTree[key].children : lastTree[key];
              } else if (currentLevel < Number(tagName.substr(1))){ // go down a level
                key = _enumerateKey(key, currentTree);
                currentTree[key] = _returnNode(currentTree, node);
                currentTree = options.fancyOutput ? currentTree[key].children : currentTree[key];
              }
            }

            currentLevel = Number(tagName.substr(1)); // assign currentLevel to the level of the current tag.
          break;

          // Handle paragraphs
          default:
            if (node.innerHTML !== '<span></span>') {
              i = Object.keys(currentTree).length > 0 ? Object.keys(currentTree).length : 0;
              key = tagName + '_' + i;
              currentTree[key] = _returnParagraph(node, currentTree);
            }
          break;
        } //end switch

        // Move to the next element
        node = node.nextElementSibling;
      } // end while

      return tree;
    }; // end this._parseDOMIntoTree

    this._doCallbacks = function(tree) {
      // Add Tabletop to output if requested
      if (typeof this.options.tabletop_url !== 'undefined' && typeof Tabletop !== 'undefined') {
        var tabletopData = new $.Deferred();
        Tabletop.init({
          key: this.options.tabletop_url,
          simpleSheet: this.options.tabletop_simplesheet,
          proxy: this.options.tabletop_proxy,
          callback: function(data, tt) {
            tabletopData.resolve({data: data, tabletop: tt});
          }
        });

        $.when(tabletopData).done($.proxy(function(ttdata){
          this.options.callback.call(tree, {copy: tree, data: ttdata});
        }, this));

      // Otherwise return tree
      } else {
        this.options.callback.call(tree, {copy: tree});
      }
    };

    // Main Constructor AJAX call
    $.ajax({
      context: this,
      url: this.options.url,
      type: 'GET',
      cache: this.options.cache,
      crossDomain: true,
      success: function(res) {
        var root = this._parseAndCleanDOM(res);
        var tree = this._parseDOMIntoTree(root);
        this._doCallbacks(tree);
      }
    });


  }; // end $.doctop

  // Static method default options.
  $.doctop.options = {
    callback: function(res) {console.log('You forgot to specify a callback...'); console.dir(res);},
    url: '',
    tabletop_url: undefined,
    tabletop_proxy: undefined,
    tabletop_simplesheet: false,
    preserveFormatting: true,
    simpleKeys: false,
    cache: true,
    staticExport: false,
    fancyOutput: false
  };

}(jQuery));
