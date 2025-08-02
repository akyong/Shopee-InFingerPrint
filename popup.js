// document.getElementById('fetchButton').addEventListener('click', () => {
//     chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, {action: "getHTML"}, (response) => {
//             if (response && response.html) {
//                 document.getElementById('htmlOutput').value = response.html;
//             } else {
//                 document.getElementById('htmlOutput').value = "Gagal mengambil HTML.";
//             }
//         });
//     });
// });

// document.getElementById('fetchButton').addEventListener('click', () => {
//     console.log("Tombol diklik, mengambil link...");
//     chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//         if (!tabs[0]) {
//             document.getElementById('htmlOutput').value = "Error: Tidak ada tab aktif";
//             console.error("Tidak ada tab aktif ditemukan");
//             return;
//         }
//         chrome.tabs.sendMessage(tabs[0].id, {action: "getLinks"}, (response) => {
//             if (chrome.runtime.lastError) {
//                 console.error("Error:", chrome.runtime.lastError.message);
//                 document.getElementById('htmlOutput').value = "Error: " + chrome.runtime.lastError.message;
//                 return;
//             }
//             if (response && response.links && response.links.length > 0) {
//                 // Gabungkan semua link dengan baris baru
//                 document.getElementById('htmlOutput').value = response.links.join('\n');
//             } else {
//                 document.getElementById('htmlOutput').value = "Tidak ada link ditemukan.";
//             }
//         });
//     });
// });

// document.getElementById('fetchButton').addEventListener('click', () => {
//     console.log("Tombol diklik, mengambil link...");
//     // Ambil input itemid yang akan dikecualikan
//     const excludeIdsInput = document.getElementById('excludeIds').value;
//     // Validasi input: hanya ambil angka, pisahkan dengan titik koma
//     const excludeIds = excludeIdsInput
//         ? excludeIdsInput.split(';').map(id => id.trim()).filter(id => id.match(/^\d+$/))
//         : [];
//     console.log("Item IDs yang dikecualikan (setelah validasi):", excludeIds);
//
//     chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//         if (!tabs[0]) {
//             document.getElementById('htmlOutput').value = "Error: Tidak ada tab aktif";
//             console.error("Tidak ada tab aktif ditemukan");
//             return;
//         }
//         chrome.tabs.sendMessage(tabs[0].id, {action: "getLinks", excludeIds: excludeIds}, (response) => {
//             if (chrome.runtime.lastError) {
//                 console.error("Error:", chrome.runtime.lastError.message);
//                 document.getElementById('htmlOutput').value = "Error: " + chrome.runtime.lastError.message;
//                 return;
//             }
//             if (response && response.links && response.links.length > 0) {
//                 // Tampilkan link dengan nomor urut
//                 document.getElementById('htmlOutput').value = response.links
//                     .map((link, index) => `${link}`)
//                     .join('\n');
//             } else {
//                 document.getElementById('htmlOutput').value = "Tidak ada link ditemukan.";
//             }
//         });
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    // Muat excludeIds dari chrome.storage.local saat popup dimuat
    chrome.storage.local.get(['excludeIds'], (result) => {
        if (result.excludeIds) {
            document.getElementById('excludeIds').value = result.excludeIds;
            console.log("Memuat excludeIds dari storage:", result.excludeIds);
        }
    });

    document.getElementById('fetchButton').addEventListener('click', () => {
        console.log("Tombol diklik, mengambil link...");
        // Ambil input itemid yang akan dikecualikan
        const excludeIdsInput = document.getElementById('excludeIds').value;
        // Validasi input: hanya ambil angka, pisahkan dengan titik koma
        const excludeIds = excludeIdsInput
            ? excludeIdsInput.split(';').map(id => id.trim()).filter(id => id.match(/^\d+$/))
            : [];
        console.log("Item IDs yang dikecualikan (setelah validasi):", excludeIds);

        // Simpan excludeIds ke chrome.storage.local
        chrome.storage.local.set({ excludeIds: excludeIdsInput }, () => {
            console.log("excludeIds disimpan ke storage:", excludeIdsInput);
        });

        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (!tabs[0]) {
                document.getElementById('htmlOutput').value = "Error: Tidak ada tab aktif";
                console.error("Tidak ada tab aktif ditemukan");
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, {action: "getLinks", excludeIds: excludeIds}, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error:", chrome.runtime.lastError.message);
                    document.getElementById('htmlOutput').value = "Error: " + chrome.runtime.lastError.message;
                    return;
                }
                if (response && response.links && response.links.length > 0) {
                    // Tampilkan link dengan nomor urut
                    document.getElementById('htmlOutput').value = response.links
                        .map((link, index) => `${link}`)
                        .join('\n');
                } else {
                    document.getElementById('htmlOutput').value = "Tidak ada link ditemukan.";
                }
            });
        });
    });
});