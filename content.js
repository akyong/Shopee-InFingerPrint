// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "getHTML") {
//         const html = document.documentElement.outerHTML;
//         sendResponse({html: html});
//     }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "getLinks") {
//         // Ambil semua elemen <a> dengan kelas "contents"
//         const linkElements = document.querySelectorAll('a.contents');
//         // Ekstrak atribut href dari setiap elemen
//         const links = Array.from(linkElements).map(element => element.getAttribute('href'));
//         console.log("Link ditemukan:", links);
//         sendResponse({links: links});
//         return true; // Menjaga saluran pesan terbuka
//     }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "getLinks") {
//         // Ambil semua elemen <a> dengan kelas "contents"
//         const linkElements = document.querySelectorAll('a.contents');
//         const links = Array.from(linkElements).map(element => {
//             const href = element.getAttribute('href');
//             // Ekstrak shopid dan itemid menggunakan regex
//             const regex = /i\.(\d+)\.(\d+)/;
//             const match = href.match(regex);
//             if (match) {
//                 const shopid = match[1];
//                 const itemid = match[2];
//                 return `https://shopee.co.id/product/${shopid}/${itemid}`;
//             }
//             return null; // Kembalikan null jika tidak cocok
//         }).filter(link => link !== null); // Filter link yang tidak valid
//         console.log("Link ditemukan:", links);
//         sendResponse({links: links});
//         return true; // Menjaga saluran pesan terbuka
//     }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "getLinks") {
//         // Ambil daftar itemid yang akan dikecualikan
//         const excludeIds = request.excludeIds || [];
//         console.log("Mengecualikan item IDs:", excludeIds);
//
//         // Ambil semua elemen <a> dengan kelas "contents"
//         const linkElements = document.querySelectorAll('a.contents');
//         const links = Array.from(linkElements).map(element => {
//             const href = element.getAttribute('href');
//             // Ekstrak shopid dan itemid menggunakan regex
//             const regex = /i\.(\d+)\.(\d+)/;
//             const match = href.match(regex);
//             if (match) {
//                 const shopid = match[1];
//                 const itemid = match[2];
//                 // Log untuk debugging
//                 console.log(`Memeriksa itemid: ${itemid}, apakah ada di excludeIds? ${excludeIds.includes(itemid)}`);
//                 // Cek apakah itemid ada di daftar pengecualian
//                 if (excludeIds.includes(itemid)) {
//                     return null; // Lewati link ini
//                 }
//                 return `https://shopee.co.id/product/${shopid}/${itemid}`;
//             }
//             return null; // Kembalikan null jika tidak cocok
//         }).filter(link => link !== null); // Filter link yang tidak valid
//
//         console.log("Link ditemukan:", links);
//         sendResponse({links: links});
//         return true; // Menjaga saluran pesan terbuka
//     }
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLinks") {
        // Ambil daftar itemid yang akan dikecualikan
        const excludeIds = request.excludeIds || [];
        console.log("Mengecualikan item IDs:", excludeIds);

        // Ambil semua elemen <a> dengan kelas "contents"
        const linkElements = document.querySelectorAll('a.contents');
        const links = Array.from(linkElements).map(element => {
            const href = element.getAttribute('href');
            // Ekstrak shopid dan itemid menggunakan regex
            const regex = /i\.(\d+)\.(\d+)/;
            const match = href.match(regex);
            if (match) {
                const shopid = match[1];
                const itemid = match[2];
                // Log untuk debugging
                console.log(`Memeriksa itemid: ${itemid}, apakah ada di excludeIds? ${excludeIds.includes(itemid)}`);
                // Cek apakah itemid ada di daftar pengecualian
                if (excludeIds.includes(itemid)) {
                    return null; // Lewati link ini
                }
                return `https://shopee.co.id/product/${shopid}/${itemid}`;
            }
            return null; // Kembalikan null jika tidak cocok
        }).filter(link => link !== null); // Filter link yang tidak valid

        console.log("Link ditemukan:", links);
        sendResponse({links: links});
        return true; // Menjaga saluran pesan terbuka
    }
});