const GIT_HUB_API_URL = 'https://api.github.com/users/jdsecurity/repos';
let repos;

/* Функция, которая срабатывает при загрузке страницы и 
выключает значек загрузки с помощью добавления класса done */

document.body.onload = function () {
    setTimeout(()=>{
        let loader = document.getElementById('loader');
        if(!loader.classList.contains('done') && loader.classList.contains('load')) {
            loader.classList.add('done')
        }
    },1000)
}

// Функциия с помощью, которой осуществляется получение репозиториев 

function getData() {
    return fetch(GIT_HUB_API_URL, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
}

/* Функция, которая формирует первую страницу при загрузке репозиториев, 
   а также осуществляющая заполенение и отрисовку таблицы при смене страницы.
*/

async function formingPageSelection (event) {
    repos = repos ? repos : await getData()
    let reposTable = document.getElementById("repos")
    let reposOnPage = 10;
    let value = event === undefined ? 1 : event.target.value
    let start = ( value - 1) * reposOnPage;
    let end = start + reposOnPage;
    let pageRepos = repos.slice(start,end);

    Array.from(reposTable.rows).slice(1).forEach((elem)=>
    {
        elem.remove();
    })

    let fragment = document.createDocumentFragment();
    for (let rep of pageRepos) {
        let container = document.createElement('tr')
        let name = document.createElement('td')
        let language = document.createElement('td')
        let description = document.createElement('td')
        let createdAt = document.createElement('td')
        let publishedAt = document.createElement('td')
        let updatedAt = document.createElement('td')

        name.innerText = rep.name ? rep.name : 'Not indicated'
        language.innerText = rep.language ? rep.language : 'Not indicated'
        description.innerText = rep.description ? rep.description : 'Not indicated'
        createdAt.innerText = new Date(rep.created_at).toLocaleDateString().split('.').join('/')
        publishedAt.innerText = new Date(rep.pushed_at).toLocaleDateString().split('.').join('/')
        updatedAt.innerText = new Date(rep.updated_at).toLocaleDateString().split('.').join('/')

        container.appendChild(name)
        container.appendChild(language)
        container.appendChild(description)
        container.appendChild(createdAt)
        container.appendChild(publishedAt)
        container.appendChild(updatedAt)
        fragment.appendChild(container)
    }
    reposTable.appendChild(fragment)
}

/* Функция, формирующая элемент select с номерами страниц на случай динамического добавления страниц*/

async function formingPageSelector () {
    repos = repos ? repos : await getData()
    for (let i=0; i<Math.round(repos.length/10);i++) {
        let page = document.createElement('option')
        page.setAttribute('value',i+1)
        page.innerText = `Current page:${i+1}`
        let pageSelector = document.getElementById('page-pagination')
        pageSelector.appendChild(page)
    }
}

/*Функция сортирующая элементы таблицы по алфавиту и наоборот */

function sortTable (event) {
    let table = document.getElementById("repos")
    let rows = Array.from(table.rows);
    let resArray;
    if ( event.target.value === 'A-Z' ) {
        resArray = rows.slice(1)
        .sort(function (x, y) {
            if (x.cells[0].innerHTML.toLowerCase() > y.cells[0].innerHTML.toLowerCase()) {
               return  1;
            }
            else {
                return -1;
            } 
        })   
    }
    else if (event.target.value === 'Z-A') {
        resArray = rows.slice(1)
        .sort(function (x, y) {
            if (x.cells[0].innerHTML.toLowerCase() > y.cells[0].innerHTML.toLowerCase()) {
               return -1;
            }
            else {
               return 1;
            } 
        })
    }
    table.tBodies[0].append(...resArray);
}

/* Функция осуществляющая поиск по имени в таблице относительно значения в input */

function filterTable (event) {
    let table = document.getElementById("repos")
    let rows = Array.from(table.rows);
    rows.slice(1)
    .forEach(tableElem => 
        {
            let textValue = tableElem.cells[0].textContent ||  tableElem.cells[0].innerText;
            if (textValue.toUpperCase().indexOf(event.target.value.toUpperCase()) > -1) {
                tableElem.style.display = ''
            }
            else {
                tableElem.style.display = 'none'
            }
        })
}

formingPageSelection()
formingPageSelector ()

document.querySelector('#page-pagination')
        .addEventListener('change',formingPageSelection)

document.querySelector('#title_select')
        .addEventListener('change',sortTable)

document.querySelector('#search')
        .addEventListener('keyup',filterTable)