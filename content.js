// function injectCheckboxes() {
//     const items = document.querySelectorAll('li.shopee-search-item-result__item');
//     if (items.length === 0) return;
//
//     // === Tambahkan Select All sekali saja ===
//     if (!document.querySelector('#bobby-select-all-container')) {
//         const ulElement = items[0].closest('ul');
//         if (ulElement) {
//             // Buat container "Select All"
//             const container = document.createElement('div');
//             container.id = 'bobby-select-all-container';
//             container.style.display = 'flex';
//             container.style.alignItems = 'center';
//             container.style.gap = '8px';
//             container.style.margin = '8px 0';
//             container.style.padding = '4px 8px';
//             container.style.background = '#fff8';
//             container.style.position = 'sticky';
//             container.style.top = '0';
//             container.style.zIndex = '9999';
//             container.style.backdropFilter = 'blur(4px)';
//             container.style.borderRadius = '6px';
//
//             const selectAllCheckbox = document.createElement('input');
//             selectAllCheckbox.type = 'checkbox';
//             selectAllCheckbox.id = 'bobby-select-all';
//             selectAllCheckbox.style.transform = 'scale(1.2)';
//             selectAllCheckbox.style.cursor = 'pointer';
//
//             const label = document.createElement('label');
//             label.htmlFor = 'bobby-select-all';
//             label.textContent = 'Select All';
//             label.style.fontSize = '14px';
//             label.style.fontWeight = '600';
//             label.style.cursor = 'pointer';
//
//             container.appendChild(selectAllCheckbox);
//             container.appendChild(label);
//
//             // Sisipkan di atas <ul>
//             ulElement.parentNode.insertBefore(container, ulElement);
//
//             // Event: Select All
//             selectAllCheckbox.addEventListener('change', (e) => {
//                 const checked = e.target.checked;
//                 document.querySelectorAll('.bobby-checkbox').forEach(cb => {
//                     cb.checked = checked;
//                 });
//             });
//         }
//     }
//
//     // === Tambahkan checkbox di setiap item produk ===
//     items.forEach((item) => {
//         if (!item.querySelector('.bobby-checkbox')) {
//             const checkbox = document.createElement('input');
//             checkbox.type = 'checkbox';
//             checkbox.className = 'bobby-checkbox';
//             checkbox.style.position = 'absolute';
//             checkbox.style.top = '5px';
//             checkbox.style.right = '5px';
//             checkbox.style.zIndex = '9999';
//             checkbox.style.transform = 'scale(1.3)';
//             checkbox.style.cursor = 'pointer';
//
//             item.style.position = 'relative';
//             item.appendChild(checkbox);
//
//             // Jika salah satu item di-uncheck, maka Select All juga ikut uncheck
//             checkbox.addEventListener('change', () => {
//                 const allCheckboxes = document.querySelectorAll('.bobby-checkbox');
//                 const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
//                 const selectAllBox = document.querySelector('#bobby-select-all');
//                 if (selectAllBox) selectAllBox.checked = allChecked;
//             });
//         }
//     });
// }

async function injectCheckboxes() {
    // Ambil excludeIds dari chrome.storage.local
    const excludeIds = await new Promise((resolve) => {
        chrome.storage.local.get(['excludeIds'], (result) => {
            const raw = result.excludeIds;
            if (!raw) return resolve([]);
            // normalize format (bisa "123;456" atau array)
            const ids = Array.isArray(raw)
                ? raw.map(x => x.trim())
                : String(raw).split(';').map(x => x.trim()).filter(Boolean);
            resolve(ids);
        });
    });

    // Ambil semua item produk
    const items = document.querySelectorAll('li.shopee-search-item-result__item');
    if (!items.length) return;

    // Buat Select All jika belum ada
    if (!document.querySelector('#selectAllContainer')) {
        const ul = items[0].closest('ul');
        if (ul) {
            const container = document.createElement('div');
            container.id = 'selectAllContainer';
            container.style.margin = '10px 0';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '6px';

            const selectAll = document.createElement('input');
            selectAll.type = 'checkbox';
            selectAll.id = 'selectAllBox';

            const label = document.createElement('label');
            label.htmlFor = 'selectAllBox';
            label.textContent = 'Select All';
            label.style.fontWeight = '600';

            container.appendChild(selectAll);
            container.appendChild(label);
            ul.parentNode.insertBefore(container, ul);

            selectAll.addEventListener('change', (e) => {
                const all = document.querySelectorAll('.bobby-checkbox');
                all.forEach(cb => (cb.checked = e.target.checked));
            });
        }
    }

    // Loop setiap item
    items.forEach(item => {
        // Pastikan item punya posisi relative untuk posisi checkbox
        if (getComputedStyle(item).position === 'static') {
            item.style.position = 'relative';
        }

        // Tambahkan checkbox jika belum ada
        if (!item.querySelector('.bobby-checkbox')) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'bobby-checkbox';
            checkbox.style.position = 'absolute';
            checkbox.style.top = '6px';
            checkbox.style.right = '6px';
            checkbox.style.zIndex = '9999';
            checkbox.style.transform = 'scale(1.3)';
            checkbox.style.cursor = 'pointer';
            item.appendChild(checkbox);
        }

        // Cek apakah shopid termasuk di excludeIds
        const link = item.querySelector('a[href*="i."]');
        if (link) {
            const match = link.href.match(/i\.(\d+)\.(\d+)/);
            if (match) {
                const shopid = match[1];
                // Jika shopid masuk excludeIds → beri border biru tebal
                if (excludeIds.includes(shopid)) {
                    item.style.setProperty('border', '5px solid blue', 'important');
                    item.style.setProperty('borderRadius', '6px', 'important');
                } else {
                    item.style.removeProperty('border');
                }
            }
        }
    });
}


// Jalankan saat halaman dimuat
injectCheckboxes();

// Observer untuk lazy load Shopee
const observer = new MutationObserver(() => injectCheckboxes());
observer.observe(document.body, { childList: true, subtree: true });

// Saat popup.js minta link
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLinks") {
        const excludeIds = request.excludeIds || [];

        const checkedItems = document.querySelectorAll('li.shopee-search-item-result__item .bobby-checkbox:checked');
        const links = [];

        checkedItems.forEach((checkbox) => {
            const li = checkbox.closest('li.shopee-search-item-result__item');
            const linkElement = li.querySelector('a.contents');
            if (linkElement) {
                const href = linkElement.getAttribute('href');
                const regex = /i\.(\d+)\.(\d+)/;
                const match = href.match(regex);
                if (match) {
                    const shopid = match[1];
                    const itemid = match[2];
                    if (!excludeIds.includes(itemid)) {
                        links.push(`https://shopee.co.id/product/${shopid}/${itemid}`);
                    }
                }
            }
        });

        console.log("Link terpilih:", links);
        sendResponse({ links });
        return true;
    }
});
