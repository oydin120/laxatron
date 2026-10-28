let mevalr1 = ["💵", "🍒", "7️⃣"]
let mevalr2 = ["💵", "🍒", "7️⃣"]
let mevalr3 = ["💵", "🍒", "7️⃣"]



// O'yin qoidalari
let BOSHLANGICH_SUMMA = 100   // boshlang'ich summa = 100$
let SPIN_HARAJATI = 20        // har spin bosilganda -20$
let JEKPOT_SOVGOLI = 40       // har jekpot tushganda +40$
let JUFT_SOVGOLI = 30         // 2 ta bir xil item tushganda +30$

let SPIN_DAVOMIYLIQI = 3000                    // spin jami 3 soniya davom etadi
let TOXTANISH_VAQTI = [1000, 2000, SPIN_DAVOMIYLIQI] // har bir card ketma-ket (bittabitta) to'xtaydi
let AYLANISH_TEZLIGI = 90                      // spin paytida card shu tezlikda almashadi (ms)

let balans = BOSHLANGICH_SUMMA
let spinDavomEtmoqda = false   // spin tugagunga qadar qayta bosish taqiqlanadi

let win1 = document.querySelector('.win1')
let win2 = document.querySelector('.win2')
let win3 = document.querySelector('.win3')

let balanceEl = document.querySelector('.balance-value')
let spinBtn = document.querySelector('.SPIN')

function tasodifRaqam() {
    return Math.round(Math.random() * 2)
}

function balansniKorsat() {
    balanceEl.textContent = '$' + balans
    // pul yetarli bo'lmasa spin tugmasi o'chiriladi
    spinBtn.disabled = balans < SPIN_HARAJATI
}

function reelsniAylantir() {
    let random1 = tasodifRaqam()
    let random2 = tasodifRaqam()
    let random3 = tasodifRaqam()

    console.log(mevalr1[random1], mevalr2[random2], mevalr3[random3])

    win1.textContent = mevalr1[random1]
    win2.textContent = mevalr2[random2]
    win3.textContent = mevalr3[random3]

    // natijani spin() ga qaytaramiz
    return { random1, random2, random3 }
}

// Spin paytida cardni tez-tez almashantirib turadi (aylanish effekti)
function cardniAylantir(el, mevalar, quti) {
    quti.classList.add('spinning')
    return setInterval(function () {
        el.textContent = mevalar[tasodifRaqam()]
    }, AYLANISH_TEZLIGI)
}

// Natija oldindan tayyorlanadi, cardlar 1 soniyadan ketma-ket to'xtaydi
function cardlarniToxtat(r) {
    let cardlar = [
        { el: win1, mevalar: mevalr1, natija: r.random1, quti: win1.closest('.box') },
        { el: win2, mevalar: mevalr2, natija: r.random2, quti: win2.closest('.box') },
        { el: win3, mevalar: mevalr3, natija: r.random3, quti: win3.closest('.box') }
    ]

    let aylantirishlar = cardlar.map(function (card) {
        return cardniAylantir(card.el, card.mevalar, card.quti)
    })

    cardlar.forEach(function (card, i) {
        setTimeout(function () {
            // shu card o'z vaqtida to'xtaydi
            clearInterval(aylantirishlar[i])
            card.quti.classList.remove('spinning')
            card.el.textContent = card.mevalar[card.natija]

            card.quti.classList.add('stopPop')
            setTimeout(function () { card.quti.classList.remove('stopPop') }, 350)

            // oxirgi card ham to'xtaganda -> 3 soniya tugadi, hisob yakunlanadi
            if (i === cardlar.length - 1) {
                natijaniHisobla(r)
            }
        }, TOXTANISH_VAQTI[i])
    })
}

// Barcha cardlar to'xtagandan keyin yutuq qo'shiladi
function natijaniHisobla(r) {
    // uchalasi ham bir xil -> jekpot
    let jekpot = r.random1 === r.random2 && r.random2 === r.random3

    // kamida 2 ta bir xil -> juft
    let juft = r.random1 === r.random2 || r.random1 === r.random3 || r.random2 === r.random3

    if (jekpot) {
        // jekpot tushganda 40$ qoshiladi (alertsiz)
        balans += JEKPOT_SOVGOLI
    } else if (juft) {
        // 2 ta bir xil item tushganda 30$ qoshiladi (alertsiz)
        balans += JUFT_SOVGOLI
    }

    if (balans < 0) balans = 0

    balansniKorsat()

    spinDavomEtmoqda = false
}

function spin() {
    // spin hali davom etayotganda qayta bosish mumkin emas
    if (spinDavomEtmoqda) return

    // pul summasi yetarli bo'lmasa faqat shu alert chiqadi
    if (balans < SPIN_HARAJATI) {
        alert('summa miqdori yetarli emas!')
        return
    }

    // har spin bosilganda 20$ ayiriladi
    balans -= SPIN_HARAJATI
    balansniKorsat()

    spinDavomEtmoqda = true
    spinBtn.disabled = true

    // natija bosilganda oldindan hal qilinadi, 3 soniya ichida ko'rsatiladi
    let r = reelsniAylantir()

    cardlarniToxtat(r)
}

balansniKorsat()
reelsniAylantir()

spinBtn.addEventListener('click', spin)
