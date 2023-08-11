const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal, focus on input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listener
modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click',() => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false))

// Validate Form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue){
        alert('Please submit values for both fields!');
        return false;
    }
    if (!urlValue.match(regex)){
        alert('Please provide a valid web adress');
        return false;
    }
    // Valid
    return true;
}

// Build our bookmarks Dom
function buildBookmarks() {
    // Build items
    bookmarks.forEach((bookmark) => {
        // Remove all bookmark elements
        bookmarkContainer.textContent = '';
       const {name, url} = bookmark;
       // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title','Delete Bookmarks');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt','Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target','_blank');
        link.textContent = name;
        // Append to Bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon,linkInfo);
        bookmarkContainer.appendChild(item);
    });
}

// Fetch Bookmarks from local storage
function fetchBookmarks() {
    // get bookmarks from local storage if available
    if (localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else {
        // Create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Jacinto Design',
                url: 'https://jacinto.design',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark,i) => {
       if (bookmark.url === url){
           bookmarks.splice(i,1);
       }
    });
    // Update Bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://','htpps://')){
        urlValue = `https://${urlValue}`;
    }
    validate(nameValue,urlValue);
    if (!validate(nameValue,urlValue)){
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    }
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit',storeBookmark);

// On Load
fetchBookmarks();