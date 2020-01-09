

var socket = io.connect('http://localhost:4000');
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var chat = document.getElementById('msger-chat');
var sifreTuru = document.getElementById('turu').value;
var typer = document.getElementById('typer');
var users = document.getElementById('users');
var kullanici = prompt('Kullanici adinizi giriniz');

const letters = "QWERTYUIOPASDFGHJKLZXCVBNMĞÜŞİÖÇabcçdefgğhıijklmnoöpqrsştuüvwxyz -=+1234567890!@#$%^&*()_/|><.,;:''[]{}";
handle.value = kullanici
//emit event 
socket.emit('yeniGiris', kullanici);
btn.addEventListener('click', function () {
    var keyVal = document.getElementById('key').value;
    sifreTuru = document.getElementById('turu').value;
    var sifreli_message;
    if (sifreTuru == "Vigenere") {
        sifreli_message = sifrele(message.value, keyVal);
    } else if (sifreTuru == "Sezar") {
        sifreli_message = sifrele(message.value, parseInt(keyVal));
    } else {
        sifreli_message = sifrele(message.value, 0);
    }

    socket.emit('chat', {
        message: sifreli_message,
        handle: handle.value,
        key: (keyVal == "") ? 0 : keyVal,
        type: sifreTuru
    });
});

//Listen port
socket.on('users', function (data) {
    users.innerHTML = ""
    data.forEach(element => {
        users.innerHTML = users.innerHTML + "<li id='aktif'>" + element + "</li>";
    });
})
socket.on('chat', function (data) {
    console.log(data);
    if (handle.value != data.handle) {
        chat.innerHTML += `
        <div class="msg left-msg" id="left-msg">
        
        <div class='msg-img' style='background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)'></div>

        <div class="msg-bubble">
            <div class="msg-info">
                <div class="msg-info-name">` + data.handle + `</div>
            </div>

            <div class="msg-text">
               ` + coz(data.message, data.type, data.key) + `
            </div>
        </div></div>`;
    } else if (handle.value == data.handle) {
        chat.innerHTML += `
        <div class="msg right-msg" id="right-msg">

        <div class="msg-img" style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)">
        </div>

        <div class="msg-bubble">
            <div class="msg-info">
                <div class="msg-info-name">` + data.handle + `</div>
            </div>

            <div class="msg-text">
            ` + coz(data.message, data.type, data.key) + `
            </div>
        </div>
        </div>
        `;
    } else {
        console.log("somethings wrongs");
    }

    message.value = "";
    typer.innerHTML = "";

});

function keyOption() {
    var sifrelemeTuru = document.getElementById("turu");
    var key = document.getElementById("key");
    if (sifrelemeTuru.value == "Sezar") {
        key.style.display = "block";
    } else if (sifrelemeTuru.value == "Vigenere") {
        key.style.display = "block";
    } else {
        key.style.display = "none";
    }
}

function coz(value, type, key) {
    if (type == "Sezar") {
        return sezarCoz(key, value);
    }
    else if (type == "Columnar") {
        return columnarCoz(value)
    }
    else if (type == "Polybuis") {
        return polybiusCoz(value)
    }
    else if (type == "Cit") {
        return citCoz(value)
    }
    else if (type == "Vigenere") {
        return vigenereDecrypt(value, key)
    }
    else if (type == "tekmatris") {
        return hillSifreleme(value)
    }
}
function sifrele(metin, key) {

    if (sifreTuru == "Sezar") {
        return sezarSifrele(key, metin);
    }
    else if (sifreTuru == "Columnar") {
        return columnarSifrele(metin)
    }
    else if (sifreTuru == "Polybuis") {
        return polybiusSifreleme(metin)
    }
    else if (sifreTuru == "Cit") {
        return citSifreleme(metin)
    }
    else if (sifreTuru == "Vigenere") {
        return vigenereEncrypt(metin, key)
    }
    else if (sifreTuru == "tekmatris") {
        return hillSifreleme(metin)
    }

}
//SezarSifreleme
function sezarSifrele(key, word) {
    var sifre = "";
    for (var i = 0; i < word.length; i++) {
        var locat = letters.indexOf(word[i]);
        ptr = (locat + key) % letters.length;
        sifre += letters[ptr];
    }
    return sifre;
}
function sezarCoz(key, code) {
    var ansswer = "";
    for (var i = 0; i < code.length; i++) {
        var locat = letters.indexOf(code[i]);
        ptr = (locat - key);
        if (ptr < 0)
            ptr = letters.length + ptr;
        ansswer += letters[ptr];
    }
    return ansswer;
}
//Cift SIFRELEME
function citSifreleme(metin) {
    let sifre = "";
    for (let i = 0; i < metin.length; i++) {
        if (i % 2 == 0) {
            sifre += metin[i];
        }
    }
    for (let i = 0; i < metin.length; i++) {
        if (i % 2 == 1) {
            sifre += metin[i];
        }
    }
    return sifre;
}
function citCoz(sifre) {
    var metin = ""
    var yari = Math.ceil(sifre.length / 2)
    for (var i = 0; i < yari; i++) {
        if (i == (yari - 1)) {
            metin += sifre[i];
        }
        else {
            metin += sifre[i];
            metin += sifre[yari + i];
        }
    }
    return metin;
}
// polybous
polybius = [
    ['A', 'B', 'C', 'D', 'E'],
    ['F', 'G', 'Ğ', 'H', 'I'],
    ['J', 'K', 'L', 'M', 'N'],
    ['O', 'P', 'R', 'S', 'Ş'],
    ['T', 'U', 'V', 'Y', 'Z'],
]
polybiustr = [
    ['A', 'B', 'Ç', 'D', 'E'],
    ['F', 'G', 'Ğ', 'H', 'İ'],
    ['J', 'K', 'L', 'M', 'N'],
    ['Ö', 'P', 'R', 'S', 'Ş'],
    ['T', 'Ü', 'V', 'Y', 'Z'],
]
//polybiusSıfreleme("GÜvEnLı")
function polybiusSifreleme(metin) {
    var cevap = ""
    metin = metin.toUpperCase();
    for (let a = 0; a < metin.length; a++) {
        for (let j = 0; j < 5; j++) {
            if (polybius[j].indexOf(metin[a]) != -1) {
                cevap += (j + 1) + "" + (polybius[j].indexOf(metin[a]) + 1)
            }
            else if (polybiustr[j].indexOf(metin[a]) != -1) {
                cevap += (j + 1) + "" + (polybiustr[j].indexOf(metin[a]) + 1)
            }
        }
    }
    return cevap;
}
function polybiusCoz(sifre) {
    var cevapp = ""
    var x = 0, y = 0;
    for (let i = 0; i < sifre.length; i = i + 2) {
        x = sifre[i] - 1;
        y = sifre[i + 1] - 1;
        cevapp = cevapp + polybius[x][y];
    }
    return cevapp;
}
//Vigenere Sifreleme
tabulaRecta = {
    a: 'abcdefghijklmnopqrstuvwxyz',
    b: 'bcdefghijklmnopqrstuvwxyza',
    c: 'cdefghijklmnopqrstuvwxyzab',
    d: 'defghijklmnopqrstuvwxyzabc',
    e: 'efghijklmnopqrstuvwxyzabcd',
    f: 'fghijklmnopqrstuvwxyzabcde',
    g: 'ghijklmnopqrstuvwxyzabcdef',
    h: 'hijklmnopqrstuvwxyzabcdefg',
    i: 'ijklmnopqrstuvwxyzabcdefgh',
    j: 'jklmnopqrstuvwxyzabcdefghi',
    k: 'klmnopqrstuvwxyzabcdefghij',
    l: 'lmnopqrstuvwxyzabcdefghijk',
    m: 'mnopqrstuvwxyzabcdefghijkl',
    n: 'nopqrstuvwxyzabcdefghijklm',
    o: 'opqrstuvwxyzabcdefghijklmn',
    p: 'pqrstuvwxyzabcdefghijklmno',
    q: 'qrstuvwxyzabcdefghijklmnop',
    r: 'rstuvwxyzabcdefghijklmnopq',
    s: 'stuvwxyzabcdefghijklmnopqr',
    t: 'tuvwxyzabcdefghijklmnopqrs',
    u: 'uvwxyzabcdefghijklmnopqrst',
    v: 'vwxyzabcdefghijklmnopqrstu',
    w: 'wxyzabcdefghijklmnopqrstuv',
    x: 'xyzabcdefghijklmnopqrstuvw',
    y: 'yzabcdefghijklmnopqrstuvwx',
    z: 'zabcdefghijklmnopqrstuvwxy'
};
//console.log(vigenereEncrypt("daimaguvenlihaberlesin","birzamanlarsogukbirkis"))
function vigenereEncrypt(plainText, keyword) {
    plainText = plainText.toLowerCase();
    keyword = keyword.match(/[a-z]/gi).join('').toLowerCase();
    let encryptedText = '';
    let specialCharacterCount = 0;

    for (let i = 0; i < plainText.length; i++) {
        const keyLetter = (i - specialCharacterCount) % keyword.length;
        const keywordIndex = this.tabulaRecta.a.indexOf(keyword[keyLetter]);

        if (this.tabulaRecta[plainText[i]]) {
            encryptedText += this.tabulaRecta[plainText[i]][keywordIndex];
        } else {
            encryptedText += plainText[i];
            specialCharacterCount++;
        }
    }

    return encryptedText;
}

function vigenereDecrypt(encryptedText, keyword) {
    encryptedText = encryptedText.toLowerCase();
    keyword = keyword.match(/[a-z]/gi).join('').toLowerCase();
    let decryptedText = '';
    let specialCharacterCount = 0;

    for (let i = 0; i < encryptedText.length; i++) {
        const keyLetter = (i - specialCharacterCount) % keyword.length;
        const keyRow = this.tabulaRecta[keyword[keyLetter]];

        if (keyRow.indexOf(encryptedText[i]) !== -1) {
            decryptedText += this.tabulaRecta.a[keyRow.indexOf(encryptedText[i])];
        } else {
            decryptedText += encryptedText[i];
            specialCharacterCount++;
        }
    }

    return decryptedText;
}

//Columnar algortimasi

function columnarSifrele(metin) {
    metin = metin.toUpperCase()
    let cevap = ""
    n = Math.ceil(Math.sqrt(metin.length))
    let matris = new Array(n);
    for (var i = 0; i < matris.length; i++) {
        matris[i] = new Array(n);
    }
    console.log(n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if ((i * (n) + j) < metin.length)
                matris[i][j] = metin[i * (n) + j]
            else
                matris[i][j] = letters[Math.floor(Math.random() * 29)];
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            cevap += matris[j][i]

        }
    }
    return cevap;
}
//columnarCoz("mallmkedisemrunitahnankzaysaoBbaihrĞ")
function columnarCoz(sifre) {
    sifre = sifre.toUpperCase()
    let cevap = ""
    n = Math.ceil(Math.sqrt(sifre.length))
    let matris = new Array(n);
    for (var i = 0; i < matris.length; i++) {
        matris[i] = new Array(n);
    }
    console.log(n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matris[j][i] = sifre[i * (n) + j]
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            cevap += matris[i][j]

        }
    }
    return cevap;
}

const alfabe = "abcçdefğghıijklmnoöprsştuüvyz"
function hillSifreleme(metin) {
    cevap = ""

    anahtar = [
        [3, 2, 4],
        [1, 3, 5],
        [0, 2, 1]
    ]

    n = anahtar[0].length
    let matris = new Array(n);
    for (var i = 0; i < matris.length; i++) {
        matris[i] = new Array(n);
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if ((i * (n) + j) < metin.length)
                matris[i][j] = alfabe.indexOf(metin[i * (n) + j]) + 1
            else
                matris[i][j] = Math.floor((Math.random() + 0.1) * 20);

        }
    }

    let sonuc = new Array(anahtar[0].length);
    for (var i = 0; i < anahtar[0].length; i++) {
        sonuc[i] = new Array(matris[0].length);
    }
    toplam = 0
    for (let a = 0; a < n; a++) {

        for (let i = 0; i < n; i++) {
            toplam = 0
            for (let j = 0; j < n; j++) {
                toplam += matris[a][j] * anahtar[j][i];
            }
            sonuc[a][i] = toplam;
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            cevap += alfabe[(sonuc[i][j] % 29) - 1]
        }
    }
    return cevap;

}