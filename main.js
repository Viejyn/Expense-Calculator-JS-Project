// Html'den Gelen Elemanlar
const nameInput = document.getElementById("name-input");
const priceInput = document.getElementById("price-input");
const addBtn = document.querySelector('#add-btn');
const listArea = document.getElementById('list');
const statusCheckbox = document.getElementById('status-check');
const sumInfo = document.getElementById('sum-info');
const deleteBtn = document.getElementById("delete");
const userInput = document.getElementById('user-input');
const select = document.querySelector('select');

//! İzlediğimiz Olaylar

addBtn.addEventListener("click", addExpense);
listArea.addEventListener("click",handleUpdate);
userInput.addEventListener("input", saveUser);
document.addEventListener("DOMContentLoaded", getUser);
select.addEventListener("change", handleFilter);

// toplamın değerini burada tutucaz
let sum = 0;

function updateSum(price){
    // js'deki toplam değerini günceller
    sum += Number(price);

    // htmldeki toplam bilgi alanını güncelleme
    sumInfo.innerText = sum;    
}

// eventListener ile çalıştırılan fonksiyonlara olay hakkında
// bilgileri içeren bir parametre gider.
function addExpense (event) {
    // sayfayı yenilemesini engelleme
    event.preventDefault();


    //! 1- inputların biri bile boşsa: alert ver ve fonksiyonu durdur.  
    if(!nameInput.value || !priceInput.value) {
        alert("Lütfen formu doldurunuz...");
        return;
    }

    //! 2- inputlar doluysa bir kart oluştur ve html gönder.
    // a- div oluşturma
    const expenseDiv = document.createElement('div');

    // b- div e class ekleme
    expenseDiv.classList.add('expense');

    // Ödendi checkbox'ına tıklandıysa ödendi class'ı ekle
    if(statusCheckbox.checked === true) {
        expenseDiv.classList.add('payed');
    }
    
    // c- içerisinde HTML'i belirleme
    expenseDiv.innerHTML = `
            <h2 class="name">${nameInput.value}</h2>
            <h2 class="price">${priceInput.value}</h2>
            <div class="btns">
                 <img id="edit" src="/images/pay.png" alt="">
                 <img id="delete" src="/images/delete.png" alt="">
            </div> 
    `;

    // d- oluşan elemanı HTML'e gönderme
    listArea.appendChild(expenseDiv);

    // toplam alanını güncelleme
    updateSum(priceInput.value);

    // formu temizleme
    nameInput.value = '';
    priceInput.value = '';
    statusCheckbox.checked = false;
}

// Listedeki bir elemana tıklayınca çalışır
function handleUpdate(event) {
    // tıklanılan elemana erişme
    const ele = event.target;
    
    // silme resminin kapsayıcısına erişmek
    const parent = ele.parentElement.parentElement

    // yalnızca silme resmine tıklanınca çalışacak kod
    if(ele.id === 'delete') {

        // elementi silme
        parent.remove();

        // toplam bilgisini güncelleme
        const price = parent.querySelector(".price").textContent;

        updateSum(Number(price) * -1);
    }

    // elemanın id'si edit ise onun payed class'ını tersine çevir
    if(ele.id === 'edit') {
        parent.classList.toggle('payed');
    }
}

// Kullanıcıyı Local'e kaydetme

function saveUser(event) {
    localStorage.setItem('username', event.target.value);
}

// Kullanıcı Local'de varsa, onu alma
function getUser() {
    // Local'den ismi al | isim yoksa null yerine "" olsun
    const username = localStorage.getItem('username') || ''; // if else

   // kullanıcı ismini input'a aktar
   userInput.value = username;
}

// Filtreleme ve Toplam Güncelleme Kısmı

function handleFilter(event) {
    const selected = event.target.value;
    const items = listArea.childNodes;
    let filteredSum = 0; // Filtreye göre toplam tutar

    // bütün elemanları dönme
    items.forEach((item) => {
        // Elemanın geçerli bir "expense" olup olmadığını kontrol et
        if (!item.classList || !item.classList.contains('expense')) return;

        // Elemanın fiyatını al
        const price = Number(item.querySelector('.price').textContent);

        // selected ın alabileceği değerleri izleme
        switch(selected) {
           case 'all':
              //hepsi seçilirse            
              item.style.display = "flex"; 
              filteredSum += price; // Toplamı ekle         
              break;

            case 'payed':
              //yalnızca ödenenler
              if(item.classList.contains('payed')) {
                item.style.display = "flex";
                filteredSum += price; // Toplamı ekle
              } else {
                item.style.display = 'none';
              }
            break;
            
            case 'not-payed':
              // yalnızca ödenmeyenler
              if(!item.classList.contains('payed')) {
                item.style.display = "flex";
                filteredSum += price; // Toplamı ekle
              } else {
                item.style.display = 'none';
              }
            break;    
        }
    });
    // Toplam bilgiyi güncelleme
    sumInfo.innerText = filteredSum;
}