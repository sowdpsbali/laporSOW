// =====================================================
// ADMIN DASHBOARD - LAPOR SOW
// =====================================================


// =====================================================
// URL GOOGLE APPS SCRIPT WEB APP
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyZAxvr-Ha8fYcA3sEb7Wrd_RVoeEDVtpp7tyzCIkRnHnTtCBkrmvgaOmTnVpZlsEZzhw/exec";


// =====================================================
// AMBIL ELEMENT HTML
// =====================================================

const searchOrder =
    document.getElementById("searchOrder");

const filterCabang =
    document.getElementById("filterCabang");

const filterTanggal =
    document.getElementById("filterTanggal");

const searchButton =
    document.getElementById("searchButton");

const resetFilter =
    document.getElementById("resetFilter");

const orderTableBody =
    document.getElementById("orderTableBody");

const totalOrder =
    document.getElementById("totalOrder");

const totalOpen =
    document.getElementById("totalOpen");

const totalProses =
    document.getElementById("totalProses");

const totalSelesai =
    document.getElementById("totalSelesai");
// =====================================================
// ELEMENT MODAL DETAIL
// =====================================================

const detailModal =
    document.getElementById("detailModal");

const closeModal =
    document.getElementById("closeModal");

const closeModalButton =
    document.getElementById("closeModalButton");

const detailKode =
    document.getElementById("detailKode");

const detailNama =
    document.getElementById("detailNama");

const detailNip =
    document.getElementById("detailNip");

const detailCabang =
    document.getElementById("detailCabang");

const detailJenisKendala =
    document.getElementById("detailJenisKendala");

const detailDeskripsi =
    document.getElementById("detailDeskripsi");

const detailWhatsapp =
    document.getElementById("detailWhatsapp");

const detailTanggal =
    document.getElementById("detailTanggal");

const detailJam =
    document.getElementById("detailJam");

const detailStatus =
    document.getElementById("detailStatus");

const detailTeknisi =
    document.getElementById("detailTeknisi");

const detailCatatan =
    document.getElementById("detailCatatan");

const detailTanggalUpdate =
    document.getElementById("detailTanggalUpdate");

const detailRiwayat =
    document.getElementById("detailRiwayat");
// =====================================================
// ELEMENT UPDATE ORDER
// =====================================================

const updateStatus =
    document.getElementById(
        "updateStatus"
    );

const updateTeknisi =
    document.getElementById(
        "updateTeknisi"
    );
    const updateCatatan =
    document.getElementById(
        "updateCatatan"
    );

const saveUpdateButton =
    document.getElementById(
        "saveUpdateButton"
    );
// =====================================================
// DATA SEMUA ORDER
// =====================================================

let semuaOrders = [];
let orderAktif = null;


// =====================================================
// SAAT HALAMAN PERTAMA KALI DIBUKA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Admin Dashboard berhasil dimuat"
        );

        loadOrders();

    }
);


// =====================================================
// FUNGSI LOAD ORDER
// =====================================================

async function loadOrders() {

    try {

        // =============================================
        // TAMPILKAN LOADING
        // =============================================

        orderTableBody.innerHTML = `

            <tr>

                <td colspan="9">

                    Memuat data order...

                </td>

            </tr>

        `;


        // =============================================
        // AMBIL NILAI FILTER
        // =============================================

        const kode =
            searchOrder.value.trim();

        const cabang =
            filterCabang.value.trim();

        const tanggal =
            filterTanggal.value;


        // =============================================
        // BUAT URL API
        // =============================================

        let url =
            API_URL;


        const params =
            new URLSearchParams();


        // FILTER KODE

        if (kode !== "") {

            params.append(
                "kode",
                kode
            );

        }


        // FILTER CABANG

        if (cabang !== "") {

            params.append(
                "cabang",
                cabang
            );

        }


        // FILTER TANGGAL

        if (tanggal !== "") {

            params.append(
                "tanggal",
                tanggal
            );

        }


        // =============================================
        // TAMBAHKAN PARAMETER KE URL
        // =============================================

        if (
            params.toString() !== ""
        ) {

            url +=
                "?" +
                params.toString();

        }


        console.log(
            "URL API:",
            url
        );


        // =============================================
        // REQUEST KE GOOGLE APPS SCRIPT
        // =============================================

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Gagal menghubungkan ke API"
            );

        }


        const result =
            await response.json();


        console.log(
            "HASIL API:",
            result
        );


        // =============================================
        // CEK RESPONSE
        // =============================================

        if (
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Gagal mengambil data"
            );

        }


        // =============================================
        // SIMPAN DATA
        // =============================================

        semuaOrders =
            result.orders || [];


        // =============================================
        // UPDATE STATISTIK
        // =============================================

        updateStatistics(
            semuaOrders
        );


        // =============================================
        // TAMPILKAN TABEL
        // =============================================

        renderOrders(
            semuaOrders
        );


    }

    catch (error) {

        console.error(
            "ERROR LOAD ORDER:",
            error
        );


        orderTableBody.innerHTML = `

            <tr>

                <td colspan="9">

                    ❌ Gagal memuat data:
                    ${error.message}

                </td>

            </tr>

        `;


        // RESET STATISTIK

        totalOrder.textContent = "0";

        totalOpen.textContent = "0";

        totalProses.textContent = "0";

        totalSelesai.textContent = "0";

    }

}


// =====================================================
// RENDER DATA KE TABEL
// =====================================================

function renderOrders(orders) {

    // =============================================
    // JIKA TIDAK ADA DATA
    // =============================================

    if (
        !orders ||
        orders.length === 0
    ) {

        orderTableBody.innerHTML = `

            <tr>

                <td colspan="9">

                    Belum ada data order

                </td>

            </tr>

        `;

        return;

    }


    // =============================================
    // KOSONGKAN TABEL
    // =============================================

    orderTableBody.innerHTML = "";


    // =============================================
    // LOOP DATA ORDER
    // =============================================

    orders.forEach(
        function (
            order,
            index
        ) {


            const tr =
                document.createElement(
                    "tr"
                );


            // =========================================
            // STATUS
            // =========================================

            const status =
                order.status ||
                "OPEN";


            // =========================================
            // ISI TABEL
            // =========================================

            tr.innerHTML = `

                <td>

                    ${index + 1}

                </td>


                <td>

                    ${escapeHtml(
                        order.kode
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        order.nama
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        order.kode_cabang
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        order.jenis_kendala
                    )}

                </td>


                <td>

                    ${escapeHtml(
                        order.tanggal
                    )}

                </td>


                <td>

                    <span class="status ${status.toLowerCase()}">

                        ${escapeHtml(
                            status
                        )}

                    </span>

                </td>


                <td>

                    ${escapeHtml(
                        order.teknisi || "-"
                    )}

                </td>


                <td>

                    <button
                        class="btn-detail"
                        onclick="lihatDetail('${escapeAttribute(order.kode)}')">

                        Detail

                    </button>

                </td>

            `;


            // =========================================
            // MASUKKAN KE TABEL
            // =========================================

            orderTableBody.appendChild(
                tr
            );


        }
    );

}


// =====================================================
// UPDATE STATISTIK
// =====================================================

function updateStatistics(orders) {

    // TOTAL ORDER

    const total =
        orders.length;


    // TOTAL OPEN

    const open =
        orders.filter(
            function (order) {

                return String(
                    order.status
                )
                    .toUpperCase()
                    === "OPEN";

            }
        ).length;


    // TOTAL PROSES

    const proses =
        orders.filter(
            function (order) {

                return String(
                    order.status
                )
                    .toUpperCase()
                    === "PROSES";

            }
        ).length;


    // TOTAL SELESAI

    const selesai =
        orders.filter(
            function (order) {

                return String(
                    order.status
                )
                    .toUpperCase()
                    === "SELESAI";

            }
        ).length;


    // TAMPILKAN

    totalOrder.textContent =
        total;

    totalOpen.textContent =
        open;

    totalProses.textContent =
        proses;

    totalSelesai.textContent =
        selesai;

}


// =====================================================
// TOMBOL CARI
// =====================================================

searchButton.addEventListener(
    "click",
    function () {

        console.log(
            "Tombol Cari ditekan"
        );

        loadOrders();

    }
);


// =====================================================
// TEKAN ENTER UNTUK MENCARI
// =====================================================

searchOrder.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            loadOrders();

        }

    }
);


// =====================================================
// FILTER CABANG
// =====================================================

filterCabang.addEventListener(
    "change",
    function () {

        loadOrders();

    }
);


// =====================================================
// FILTER TANGGAL
// =====================================================

filterTanggal.addEventListener(
    "change",
    function () {

        loadOrders();

    }
);


// =====================================================
// RESET FILTER
// =====================================================

resetFilter.addEventListener(
    "click",
    function () {


        // KOSONGKAN KODE

        searchOrder.value =
            "";


        // RESET CABANG

        filterCabang.value =
            "";


        // RESET TANGGAL

        filterTanggal.value =
            "";


        console.log(
            "Filter direset"
        );


        // LOAD SEMUA DATA

        loadOrders();


    }
);


// =====================================================
// FUNGSI LIHAT DETAIL
// =====================================================

// =====================================================
// FUNGSI LIHAT DETAIL
// =====================================================

function lihatDetail(kode) {

    const order =
        semuaOrders.find(
            function (item) {

                return String(
                    item.kode
                ) === String(
                    kode
                );

            }
        );


    // =============================================
    // JIKA DATA TIDAK DITEMUKAN
    // =============================================

    if (!order) {

        alert(
            "Data order tidak ditemukan"
        );

        return;

    }
    // SIMPAN ORDER YANG SEDANG DIBUKA

        orderAktif = order;
    // =============================================
    // ISI DATA KE MODAL
    // =============================================
    detailKode.textContent =
    order.kode || "-";


    detailNama.textContent =
        order.nama || "-";


    detailNip.textContent =
        order.nip || "-";


    detailCabang.textContent =
        order.kode_cabang || "-";


    detailJenisKendala.textContent =
        order.jenis_kendala || "-";


    detailDeskripsi.textContent =
        order.deskripsi || "-";


    detailWhatsapp.textContent =
        order.whatsapp || "-";


    detailTanggal.textContent =
        order.tanggal || "-";


    detailJam.textContent =
        order.jam || "-";


    detailStatus.textContent =
        order.status || "OPEN";


    detailTeknisi.textContent =
        order.teknisi || "-";
        // =============================================
// ISI STATUS UPDATE
// =============================================

updateStatus.value =
    order.status || "OPEN";


// =============================================
// ISI TEKNISI UPDATE
// =============================================

const teknisiSekarang =
    order.teknisi || "";


// CEK APAKAH TEKNISI SUDAH ADA
// DI DALAM PILIHAN

let teknisiAda =
    false;


Array.from(
    updateTeknisi.options
).forEach(
    function (option) {

        if (
            option.value === teknisiSekarang
        ) {

            teknisiAda =
                true;

        }

    }
);


// JIKA BELUM ADA,
// TAMBAHKAN OTOMATIS

if (
    teknisiSekarang !== "" &&
    teknisiSekarang !== "-" &&
    !teknisiAda
) {

    const option =
        document.createElement(
            "option"
        );

    option.value =
        teknisiSekarang;

    option.textContent =
        teknisiSekarang;

    updateTeknisi.appendChild(
        option
    );

}


// PILIH TEKNISI SEKARANG

updateTeknisi.value =
    teknisiSekarang;


    detailCatatan.textContent =
        order.catatan_progres || "-";


    detailTanggalUpdate.textContent =
        order.tanggal_update || "-";


    // =============================================
// RIWAYAT STATUS
// =============================================

detailRiwayat.textContent =
    formatRiwayatStatus(
        order.riwayat_status
    );


    // =============================================
    // TAMPILKAN MODAL
    // =============================================

    detailModal.classList.add(
        "show"
    );

}
// =====================================================
// FORMAT RIWAYAT STATUS
// =====================================================

function formatRiwayatStatus(riwayat) {

    // JIKA TIDAK ADA RIWAYAT

    if (
        riwayat === null ||
        riwayat === undefined ||
        riwayat === ""
    ) {

        return "Belum ada riwayat status";

    }


    // JIKA DATA BERUPA ARRAY

    if (
        Array.isArray(riwayat)
    ) {

        if (
            riwayat.length === 0
        ) {

            return "Belum ada riwayat status";

        }


        return riwayat.join("\n");

    }


    // JIKA DATA BERUPA OBJECT

    if (
        typeof riwayat === "object"
    ) {

        try {

            return JSON.stringify(
                riwayat,
                null,
                2
            );

        }

        catch (error) {

            return String(
                riwayat
            );

        }

    }


    // JIKA DATA BERUPA TEXT

    return String(
        riwayat
    );

}
// =====================================================
// TUTUP MODAL
// =====================================================

function tutupModal() {

    detailModal.classList.remove(
        "show"
    );

}


// =====================================================
// TOMBOL X
// =====================================================

closeModal.addEventListener(
    "click",
    function () {

        tutupModal();

    }
);


// =====================================================
// TOMBOL TUTUP
// =====================================================

closeModalButton.addEventListener(
    "click",
    function () {

        tutupModal();

    }
);


// =====================================================
// KLIK AREA LUAR MODAL
// =====================================================

detailModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === detailModal
        ) {

            tutupModal();

        }

    }
);


// =====================================================
// TOMBOL ESC
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            tutupModal();

        }

    }
);


// =====================================================
// AMANKAN TEXT HTML
// =====================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// AMANKAN ATTRIBUTE HTML
// =====================================================

function escapeAttribute(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /'/g,
            "\\'"
        )

        .replace(
            /"/g,
            "&quot;"
        );

}
// =====================================================
// AMBIL TANGGAL UPDATE SAAT INI
// =====================================================

function getTanggalUpdate() {

    const sekarang =
        new Date();


    const tanggal =
        String(
            sekarang.getDate()
        ).padStart(
            2,
            "0"
        );


    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const tahun =
        sekarang.getFullYear();


    const jam =
        String(
            sekarang.getHours()
        ).padStart(
            2,
            "0"
        );


    const menit =
        String(
            sekarang.getMinutes()
        ).padStart(
            2,
            "0"
        );


    const detik =
        String(
            sekarang.getSeconds()
        ).padStart(
            2,
            "0"
        );


    return (
        tanggal +
        "/" +
        bulan +
        "/" +
        tahun +
        " " +
        jam +
        ":" +
        menit +
        ":" +
        detik
    );

}
// =====================================================
// SIMPAN UPDATE
// TAHAP 4.6 + 4.7
// =====================================================

saveUpdateButton.addEventListener(
    "click",
    function () {

        // =============================================
        // CEK APAKAH ADA ORDER AKTIF
        // =============================================

        if (!orderAktif) {

            alert(
                "Silakan buka Detail Order terlebih dahulu"
            );

            return;

        }


        // =============================================
        // AMBIL STATUS LAMA
        // =============================================

        const statusLama =
            orderAktif.status || "OPEN";


        // =============================================
        // AMBIL STATUS BARU
        // =============================================

        const statusBaru =
            updateStatus.value;


        // =============================================
        // AMBIL TEKNISI
        // =============================================

        const teknisiBaru =
            updateTeknisi.value;


        // =============================================
        // AMBIL CATATAN PROGRES
        // =============================================

        const catatanBaru =
            updateCatatan.value.trim();


        // =============================================
        // AMBIL TANGGAL UPDATE
        // =============================================

        const tanggalUpdate =
            getTanggalUpdate();


        // =============================================
        // BUAT RIWAYAT STATUS BARU
        // =============================================

        const riwayatBaru =
            statusLama +
            " → " +
            statusBaru +
            " - " +
            tanggalUpdate;


        // =============================================
        // AMBIL RIWAYAT LAMA
        // =============================================

        let riwayatLama =
            orderAktif.riwayat_status || "";


        // =============================================
        // GABUNGKAN RIWAYAT
        // =============================================

        if (
            riwayatLama !== ""
        ) {

            riwayatLama +=
                "\n" +
                riwayatBaru;

        }

        else {

            riwayatLama =
                riwayatBaru;

        }


        // =============================================
        // SIMPAN KE DATA ORDER AKTIF
        // =============================================

        orderAktif.status =
            statusBaru;

        orderAktif.teknisi =
            teknisiBaru;

        orderAktif.catatan_progres =
            catatanBaru;

        orderAktif.tanggal_update =
            tanggalUpdate;

        orderAktif.riwayat_status =
            riwayatLama;


        // =============================================
        // UPDATE TAMPILAN DETAIL
        // =============================================

        detailStatus.textContent =
            statusBaru;

        detailTeknisi.textContent =
            teknisiBaru || "-";

        detailCatatan.textContent =
            catatanBaru || "-";

        detailTanggalUpdate.textContent =
            tanggalUpdate;

        detailRiwayat.textContent =
            riwayatLama;


        // =============================================
        // TAMPILKAN HASIL
        // =============================================

        alert(
            "Update berhasil disimpan!\n\n" +
            "Tanggal Update: " +
            tanggalUpdate +
            "\n\nRiwayat Baru:\n" +
            riwayatBaru
        );


        // =============================================
        // CONSOLE LOG UNTUK UJI
        // =============================================

        console.log(
            "UPDATE ORDER BERHASIL"
        );

        console.log(
            "STATUS LAMA:",
            statusLama
        );

        console.log(
            "STATUS BARU:",
            statusBaru
        );

        console.log(
            "RIWAYAT:",
            riwayatLama
        );

    }
);
