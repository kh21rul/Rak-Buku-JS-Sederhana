const bukus = [];
const RENDER_EVENT = "render-buku";

document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBuku();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBuku() {
    const judulBuku = document.getElementById("title").value;
    const penulis = document.getElementById("author").value;
    const tahunBuku = document.getElementById("inputBookYear").value;

    const generatedID = generateId();
    const bukuObject = generateBukuObject(generatedID, judulBuku, penulis, tahunBuku, false);
    bukus.push(bukuObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Buku baru berhasil tersimpan");
}

function generateId() {
    return +new Date();
}


function generateBukuObject(id, judul, penulis, tahun, isCompleted) {
    return {
        id,
        judul,
        penulis,
        tahun,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {

    const uncompletedBacaBuku = document.getElementById("bukus");
    uncompletedBacaBuku.innerHTML = "";

    const completedBukuList = document.getElementById("completed-books");
    completedBukuList.innerHTML = "";

    for (bukuItem of bukus) {
        const lisbukElement = makeBuku(bukuItem);

        if (bukuItem.isCompleted == false)
            uncompletedBacaBuku.append(lisbukElement);
        else
            completedBukuList.append(lisbukElement);
    }
});

function makeBuku(bukuObject) {

    const textTitle = document.createElement("h2");
    textTitle.innerText = bukuObject.judul;

    const textPenulis = document.createElement("p");
    textPenulis.innerText = bukuObject.penulis;

    const textTahun = document.createElement("p");
    textTahun.innerText = bukuObject.tahun;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textPenulis, textTahun);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);
    container.setAttribute("id", `buku-${bukuObject.id}`);

    if (bukuObject.isCompleted) {

        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(bukuObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(bukuObject.id);
        });

        container.append(undoButton, trashButton);
    } else {


        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            addTaskToCompleted(bukuObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(bukuObject.id);
        });

        container.append(checkButton, trashButton);
    }
    return container;
}

function addTaskToCompleted(bukuId) {

    const bukuTarget = findBuku(bukuId);
    if (bukuTarget == null) return;

    bukuTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBuku(bukuId) {
    for (bukuItem of bukus) {
        if (bukuItem.id === bukuId) {
            return bukuItem
        }
    }
    return null
}

function removeTaskFromCompleted(bukuId) {
    const bukuTarget = findBukuIndex(bukuId);
    if (bukuTarget === -1) return;
    bukus.splice(bukuTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Buku berhasil dihapus");
}


function undoTaskFromCompleted(bukuId) {


    const bukuTarget = findBuku(bukuId);
    if (bukuTarget == null) return;


    bukuTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBukuIndex(bukuId) {
    for (index in bukus) {
        if (bukus[index].id === bukuId) {
            return index
        }
    }
    return -1
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bukus);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = "saved-buku";
const STORAGE_KEY = "RAKBUK_APPS";

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (listbuk of data) {
            bukus.push(listbuk);
        }
    }


    document.dispatchEvent(new Event(RENDER_EVENT));
}