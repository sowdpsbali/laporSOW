// =====================================================
// ADMIN DASHBOARD - LAPOR SOW
// =====================================================


// =====================================================
// URL GOOGLE APPS SCRIPT WEB APP
// =====================================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbxV7gW_4aym9D9Mg-TZ43-zB4IkuYSyq809naBXNsiyzDLEr9rjnO79AHGc6F9ZNpIwAw/exec";


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
// DATA SEMUA ORDER
// =====================================================

let semuaOrders = [];


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


    if (!order) {

        alert(
            "Data order tidak ditemukan"
        );

        return;

    }


    alert(

        "DETAIL ORDER\n\n" +

        "Kode Order: " +
        (order.kode || "-") +

        "\n\nNama: " +
        (order.nama || "-") +

        "\n\nNIP: " +
        (order.nip || "-") +

        "\n\nCabang: " +
        (order.kode_cabang || "-") +

        "\n\nJenis Kendala: " +
        (order.jenis_kendala || "-") +

        "\n\nDeskripsi: " +
        (order.deskripsi || "-") +

        "\n\nWhatsApp: " +
        (order.whatsapp || "-") +

        "\n\nTanggal: " +
        (order.tanggal || "-") +

        "\n\nJam: " +
        (order.jam || "-") +

        "\n\nStatus: " +
        (order.status || "-") +

        "\n\nTeknisi/SOW: " +
        (order.teknisi || "-") +

        "\n\nCatatan Progres: " +
        (order.catatan_progres || "-")

    );

}


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
